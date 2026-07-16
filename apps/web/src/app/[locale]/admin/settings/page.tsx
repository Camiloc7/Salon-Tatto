'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';
import { Loader2, Save, UploadCloud } from 'lucide-react';
import type { StudioSettings } from '@salon-tatto/shared';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { SeoPreviewCard } from '@/components/admin/seo-preview-fieldset';
import { clearSiteCache } from '@/app/actions';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

type SettingsForm = {
  studioName: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  googleMapsLat: string;
  googleMapsLng: string;
  mondayHours: string;
  tuesdayHours: string;
  wednesdayHours: string;
  thursdayHours: string;
  fridayHours: string;
  saturdayHours: string;
  sundayHours: string;
  heroMediaUrl: string;
  heroSubtitle_en: string;
  heroSubtitle_es: string;
  licenseNumber: string;
  licenseDates: string;
  sameDayReservation: string;
  logoUrl: string;
};

const emptyForm: SettingsForm = {
  studioName: '',
  address: '',
  phone: '',
  whatsapp: '',
  email: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  googleMapsLat: '',
  googleMapsLng: '',
  mondayHours: '',
  tuesdayHours: '',
  wednesdayHours: '',
  thursdayHours: '',
  fridayHours: '',
  saturdayHours: '',
  sundayHours: '',
  heroMediaUrl: '',
  heroSubtitle_en: '',
  heroSubtitle_es: '',
  licenseNumber: '',
  licenseDates: '',
  sameDayReservation: 'false',
  logoUrl: '',
};

export default function SettingsPage() {
  const t = useTranslations('admin.settings');
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SettingsForm>(emptyForm);

  const { data: settings, isLoading } = useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: () => api.get<StudioSettings>('/settings'),
  });

  useEffect(() => {
    if (settings) {
      setForm({
        studioName: settings.studioName || '',
        address: settings.address || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        instagram: settings.instagram || '',
        facebook: settings.facebook || '',
        tiktok: settings.tiktok || '',
        googleMapsLat: settings.googleMapsLat || '',
        googleMapsLng: settings.googleMapsLng || '',
        mondayHours: settings.mondayHours || '',
        tuesdayHours: settings.tuesdayHours || '',
        wednesdayHours: settings.wednesdayHours || '',
        thursdayHours: settings.thursdayHours || '',
        fridayHours: settings.fridayHours || '',
        saturdayHours: settings.saturdayHours || '',
        sundayHours: settings.sundayHours || '',
        heroMediaUrl: settings.heroMediaUrl || '',
        heroSubtitle_en: settings.heroSubtitle_en || '',
        heroSubtitle_es: settings.heroSubtitle_es || '',
        licenseNumber: settings.licenseNumber || '',
        licenseDates: settings.licenseDates || '',
        sameDayReservation: settings.sameDayReservation || 'false',
        logoUrl: settings.logoUrl || '',
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: SettingsForm) => api.put('/settings', { settings: data }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      toast.success(t('saved'));
      await clearSiteCache();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to save settings');
    },
  });

  const updateField = (field: keyof SettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveMutation.mutate(form);
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post<{ url: string }>('/upload/image', formData);
    },
    onSuccess: (data) => {
      updateField('heroMediaUrl', data.url);
      toast.success(t('saved')); // Or a specific success message
    },
    onError: () => {
      toast.error('Failed to upload file');
    }
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        uploadMutation.mutate(acceptedFiles[0]);
      }
    },
    accept: {
      'image/*': [],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
      'video/*': [],
    },
    maxFiles: 1,
  });

  const logoUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post<{ url: string }>('/upload/image', formData);
    },
    onSuccess: (data) => {
      updateField('logoUrl', data.url);
      toast.success(t('saved'));
    },
    onError: () => {
      toast.error('Failed to upload logo');
    }
  });

  const {
    getRootProps: getLogoRootProps,
    getInputProps: getLogoInputProps,
    isDragActive: isLogoDragActive
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        logoUploadMutation.mutate(acceptedFiles[0]);
      }
    },
    accept: {
      'image/*': [],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
    },
    maxFiles: 1,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Configura la información general de tu estudio. Estos datos aparecerán en el pie de página, en la página de contacto y en otras secciones de la web pública.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="w-full sm:w-auto shrink-0">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">{t('general')}</h2>
          <div>
            <label className="block text-base font-medium mb-1">Studio Name</label>
            <input
              value={form.studioName}
              onChange={(e) => updateField('studioName', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div>
            <label className="block text-base font-medium mb-1">Site Logo</label>
            <div className="flex gap-2">
              <input
                value={form.logoUrl}
                onChange={(e) => updateField('logoUrl', e.target.value)}
                placeholder="https://..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex-1"
              />
            </div>
            {form.logoUrl && (
              <div className="mt-2 bg-black/5 rounded-md flex justify-center p-4 w-fit border border-border">
                <img src={form.logoUrl} alt="Logo" className="h-16 object-contain" />
              </div>
            )}
            <div 
              {...getLogoRootProps()} 
              className={`mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                isLogoDragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
              }`}
            >
              <input {...getLogoInputProps()} />
              {logoUploadMutation.isPending ? (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <UploadCloud className="h-6 w-6 mb-1" />
                  <span className="text-sm">Drag & drop or click to upload logo</span>
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-base font-medium mb-1">Hero Subtitle (English)</label>
              <textarea
                value={form.heroSubtitle_en}
                onChange={(e) => updateField('heroSubtitle_en', e.target.value)}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Hero Subtitle (Español)</label>
              <textarea
                value={form.heroSubtitle_es}
                onChange={(e) => updateField('heroSubtitle_es', e.target.value)}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-base font-medium mb-1">Hero Background (Image or Video URL)</label>
            <div className="flex gap-2">
              <input
                value={form.heroMediaUrl}
                onChange={(e) => updateField('heroMediaUrl', e.target.value)}
                placeholder="https://..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex-1"
              />
            </div>
            <div 
              {...getRootProps()} 
              className={`mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              {uploadMutation.isPending ? (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <UploadCloud className="h-6 w-6 mb-1" />
                  <span className="text-sm">Drag & drop or click to upload media</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">{t('contact')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-base font-medium mb-1">Address</label>
              <input
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">WhatsApp</label>
              <input
                value={form.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Email</label>
              <input
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">{t('social')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-base font-medium mb-1">Instagram</label>
              <input
                value={form.instagram}
                onChange={(e) => updateField('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Facebook</label>
              <input
                value={form.facebook}
                onChange={(e) => updateField('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">TikTok</label>
              <input
                value={form.tiktok}
                onChange={(e) => updateField('tiktok', e.target.value)}
                placeholder="https://tiktok.com/..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">{t('location')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-base font-medium mb-1">Latitude</label>
              <input
                value={form.googleMapsLat}
                onChange={(e) => updateField('googleMapsLat', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Longitude</label>
              <input
                value={form.googleMapsLng}
                onChange={(e) => updateField('googleMapsLng', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Professional Credentials</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-base font-medium mb-1">License Number</label>
              <input
                value={form.licenseNumber}
                onChange={(e) => updateField('licenseNumber', e.target.value)}
                placeholder="e.g. #50107542"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">License Valid Dates</label>
              <input
                value={form.licenseDates}
                onChange={(e) => updateField('licenseDates', e.target.value)}
                placeholder="e.g. 01/07/2025 - 12/31/2026"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">{t('hours')}</h2>

          <div className="flex items-center space-x-2 pb-4 border-b mb-4">
            <input 
              type="checkbox" 
              id="sameDayReservation" 
              checked={form.sameDayReservation === 'true'}
              onChange={(e) => updateField('sameDayReservation', e.target.checked ? 'true' : 'false')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="sameDayReservation" className="text-sm font-medium leading-none cursor-pointer">
              {t('sameDayReservation')}
            </label>
          </div>

          {(!form.sameDayReservation || form.sameDayReservation === 'false') ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {DAYS.map((day) => (
                <div key={day}>
                  <label className="block text-base font-medium mb-1 capitalize">{day}</label>
                  <input
                    value={form[`${day}Hours` as keyof SettingsForm] as string}
                    onChange={(e) => updateField(`${day}Hours` as keyof SettingsForm, e.target.value)}
                    placeholder="e.g. 10:00 - 19:00"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground p-4 bg-accent/50 rounded-md">
              Se ocultarán los horarios y se mostrará un mensaje de disponibilidad de reservas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
