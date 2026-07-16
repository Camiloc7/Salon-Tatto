'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Loader2, Star, Trash2, UploadCloud, X, Link as LinkIcon, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import type { Category } from '@salon-tatto/shared';
import Link from 'next/link';
import { Reorder } from 'framer-motion';

type ArtistImage = {
  id: string;
  url: string;
  isFeatured: boolean;
  orderIndex: number;
  categoryId: string | null;
  category?: { name?: string };
  format?: string;
};

type PendingFile = {
  file: File;
  preview: string;
  categoryId: string | null;
};

type GalleryManagerProps = {
  artistId: string;
};

export function GalleryManager({ artistId }: GalleryManagerProps) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [localImages, setLocalImages] = useState<ArtistImage[]>([]);

  const { data: artist } = useQuery({
    queryKey: queryKeys.artists.detail(artistId),
    queryFn: () => api.get<any>(`/artists/id/${artistId}`),
  });

  const { data: images, isLoading } = useQuery({
    queryKey: ['gallery', artistId],
    queryFn: () => api.get<ArtistImage[]>(`/artists/${artistId}/images`),
  });

  useEffect(() => {
    if (images) {
      setLocalImages([...images].sort((a, b) => a.orderIndex - b.orderIndex));
    }
  }, [images]);

  const { data: categories } = useQuery({
    queryKey: queryKeys.blog.categories(),
    queryFn: () => api.get<any[]>('/blog/categories').then((res) => res),
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      categoryId: null,
    }));
    setPendingFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'image/*': [],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
      'video/*': [],
    },
  });

  useEffect(() => {
    return () => pendingFiles.forEach(f => URL.revokeObjectURL(f.preview));
  }, [pendingFiles]);

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePendingCategory = (index: number, categoryId: string) => {
    setPendingFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index].categoryId = categoryId || null;
      return newFiles;
    });
  };

  const uploadAll = async () => {
    if (pendingFiles.length === 0) return;
    setUploading(true);
    try {
      for (const item of pendingFiles) {
        const formData = new FormData();
        formData.append('files', item.file);
        const uploadedImages = await api.post<ArtistImage[]>(`/artists/${artistId}/images`, formData);
        const newImage = uploadedImages[0];
        
        if (item.categoryId && newImage) {
          await api.patch(`/gallery/${newImage.id}/category`, { categoryId: item.categoryId });
        }
      }
      toast.success('Images uploaded successfully!');
      setPendingFiles([]);
      queryClient.invalidateQueries({ queryKey: ['gallery', artistId] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload some images');
    } finally {
      setUploading(false);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (imageId: string) => api.delete(`/gallery/${imageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery', artistId] });
      toast.success('Image deleted');
    },
    onError: () => toast.error('Failed to delete image'),
  });

  const setFeaturedMutation = useMutation({
    mutationFn: (imageId: string) => api.patch(`/gallery/${imageId}/featured`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery', artistId] });
      toast.success('Image set as featured');
    },
    onError: () => toast.error('Failed to set featured image'),
  });

  const bulkReorderMutation = useMutation({
    mutationFn: (updates: { id: string; orderIndex: number }[]) => 
      api.patch(`/gallery/bulk-reorder`, { updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery', artistId] });
      toast.success('Gallery reordered');
    },
    onError: () => toast.error('Failed to reorder gallery'),
  });

  const saveOrder = () => {
    if (!images) return;
    const sortedOriginal = [...images].sort((a, b) => a.orderIndex - b.orderIndex);
    const hasChanged = localImages.some((img, idx) => img.id !== sortedOriginal[idx]?.id);
    if (!hasChanged) return;
    
    const updates = localImages.map((img, idx) => ({ id: img.id, orderIndex: idx }));
    bulkReorderMutation.mutate(updates);
  };

  const handleReorder = (newOrder: ArtistImage[]) => {
    setLocalImages(newOrder);
  };

  const setCategoryMutation = useMutation({
    mutationFn: ({ imageId, categoryId }: { imageId: string; categoryId: string | null }) => 
      api.patch(`/gallery/${imageId}/category`, { categoryId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery', artistId] });
      toast.success('Category updated');
    },
    onError: () => toast.error('Failed to update category'),
  });

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Gallery Images</h3>
        {artist?.slug && (
          <Link href={`/en/artists/${artist.slug}`} target="_blank" className="flex items-center gap-2 text-sm text-primary hover:underline">
            <LinkIcon className="h-4 w-4" /> View Public Profile
          </Link>
        )}
      </div>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <UploadCloud className="h-10 w-10 mb-2" />
          <p className="text-base font-medium text-foreground">Drag & drop images here</p>
          <p className="text-sm">or click to select files</p>
        </div>
      </div>

      {pendingFiles.length > 0 && (
        <div className="bg-muted/30 border rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Pending Uploads ({pendingFiles.length})</h4>
            <Button onClick={uploadAll} disabled={uploading}>
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pendingFiles.map((item, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden border bg-background flex flex-col">
                {item.file.type.startsWith('video/') ? (
                  <video src={item.preview} className="w-full h-32 object-cover" autoPlay loop muted />
                ) : (
                  <img src={item.preview} alt="preview" className="w-full h-32 object-cover" />
                )}
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePendingFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="p-2 border-t">
                  <select 
                    className="w-full text-xs p-1 border rounded bg-background"
                    value={item.categoryId || ''}
                    onChange={(e) => updatePendingCategory(index, e.target.value)}
                  >
                    <option value="">No Category</option>
                    {categories?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name || cat.slug}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {localImages.length > 0 && (
        <Reorder.Group 
          axis="y" 
          values={localImages} 
          onReorder={handleReorder}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {localImages.map((image, index) => (
            <Reorder.Item 
              key={image.id} 
              value={image}
              className="relative group rounded-xl overflow-hidden border shadow-sm flex flex-col bg-card" onDragEnd={saveOrder}
            >
              <div className="relative">
                {image.format === 'mp4' || image.format === 'mov' || image.format === 'webm' ? (
                  <video src={image.url} className="w-full h-56 object-cover" autoPlay loop muted />
                ) : (
                  <img src={image.url} alt="" className="w-full h-56 object-cover" />
                )}
                
                <div className="absolute top-2 left-2 flex gap-1">
                  {image.isFeatured && (
                    <div className="bg-amber-500 text-white p-1 rounded-full shadow-sm">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  )}
                  <div className="bg-black/70 text-white px-2 rounded-md text-xs flex items-center">
                    #{index}
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 cursor-grab active:cursor-grabbing"
                      title="Drag to reorder"
                    >
                      <GripVertical className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => setFeaturedMutation.mutate(image.id)}
                      title="Set as cover"
                    >
                      <Star className={`h-4 w-4 ${image.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => {
                        if (confirm('Delete this image?')) deleteMutation.mutate(image.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-card border-t flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Category:</span>
                <select 
                  className="flex-1 text-xs p-1 border rounded bg-background truncate"
                  value={image.categoryId || ''}
                  onChange={(e) => setCategoryMutation.mutate({ imageId: image.id, categoryId: e.target.value || null })}
                >
                  <option value="">None</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name || cat.slug}</option>
                  ))}
                </select>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}

