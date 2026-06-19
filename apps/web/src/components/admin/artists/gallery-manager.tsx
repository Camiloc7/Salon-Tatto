'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Loader2, Star, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

type ArtistImage = {
  id: string;
  url: string;
  isFeatured: boolean;
  orderIndex: number;
};

type GalleryManagerProps = {
  artistId: string;
};

export function GalleryManager({ artistId }: GalleryManagerProps) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: images, isLoading } = useQuery({
    queryKey: ['gallery', artistId],
    queryFn: () => api.get<ArtistImage[]>(`/artists/${artistId}/images`),
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('files', file));
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_URL}/artists/${artistId}/images`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery', artistId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId: string) => api.delete(`/gallery/${imageId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery', artistId] }),
  });

  const setFeaturedMutation = useMutation({
    mutationFn: (imageId: string) => api.patch(`/gallery/${imageId}/featured`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery', artistId] }),
  });

  const reorderMutation = useMutation({
    mutationFn: ({ imageId, orderIndex }: { imageId: string; orderIndex: number }) => 
      api.patch(`/gallery/${imageId}/reorder`, { orderIndex }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery', artistId] }),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      try {
        await uploadMutation.mutateAsync(e.target.files);
      } finally {
        setUploading(false);
      }
    }
  };

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />;

  const sortedImages = [...(images || [])].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Gallery Images</h3>
        <div className="relative w-full sm:w-auto">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <Button disabled={uploading} className="w-full sm:w-auto">
            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload Photos
          </Button>
        </div>
      </div>

      {sortedImages.length === 0 ? (
        <p className="text-sm text-muted-foreground">No images yet. Upload some photos to get started.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedImages.map((image, index) => (
            <div key={image.id} className="relative group rounded-lg overflow-hidden border">
              <img src={image.url} alt="" className="w-full h-48 object-cover" />
              
              <div className="absolute top-2 left-2 flex gap-1">
                {image.isFeatured && (
                  <div className="bg-amber-500 text-white p-1 rounded-full shadow-sm">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                )}
                <div className="bg-black/70 text-white px-2 rounded-md text-xs flex items-center">
                  #{image.orderIndex}
                </div>
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <div className="flex gap-2">
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
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 text-black"
                    disabled={index === 0}
                    onClick={() => reorderMutation.mutate({ imageId: image.id, orderIndex: image.orderIndex - 1 })}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 text-black"
                    onClick={() => reorderMutation.mutate({ imageId: image.id, orderIndex: image.orderIndex + 1 })}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
