'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

type SeoPreviewCardProps = {
  title: string;
  description: string;
  onTitleChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  defaultTitle?: string;
  defaultDescription?: string;
};

export function SeoPreviewCard({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  defaultTitle = '',
  defaultDescription = '',
}: SeoPreviewCardProps) {
  const ta = useTranslations('admin.seo.form');
  
  const displayTitle = title || defaultTitle || 'Título de tu página';
  const displayDescription = description || defaultDescription || 'Aquí aparecerá la descripción de tu página. Intenta que sea atractiva e invite a los usuarios a hacer clic en tu enlace.';

  const titleLength = title.length;
  const descLength = description.length;

  const getTitleColor = () => {
    if (titleLength === 0) return 'text-muted-foreground';
    if (titleLength > 60) return 'text-red-500';
    if (titleLength < 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getDescColor = () => {
    if (descLength === 0) return 'text-muted-foreground';
    if (descLength > 160) return 'text-red-500';
    if (descLength < 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formularios */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium">{ta('title')}</label>
              <span className={cn("text-xs font-mono", getTitleColor())}>
                {titleLength} / 60
              </span>
            </div>
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={defaultTitle || "Título óptimo (50-60 caracteres)"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Este es el enlace azul gigante que la gente clickeará en Google.
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium">{ta('description')}</label>
              <span className={cn("text-xs font-mono", getDescColor())}>
                {descLength} / 160
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder={defaultDescription || "Descripción que invite a hacer clic (hasta 160 caracteres)"}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Escribe un texto persuasivo para convencer al cliente de visitar tu página.
            </p>
          </div>
        </div>

        {/* Vista Previa de Google */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Globe className="h-4 w-4" />
            <span className="font-medium">Vista Previa en Google</span>
          </div>
          
          <div className="p-4 bg-white dark:bg-[#202124] rounded-md shadow-sm border font-sans">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px]">
                ST
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#202124] dark:text-[#dadce0] font-medium leading-none">Salon Tatto</span>
                <span className="text-[12px] text-[#4d5156] dark:text-[#bdc1c6] leading-none mt-1">https://tusitio.com/es/pagina</span>
              </div>
            </div>
            <h3 className="text-[20px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer mb-1 leading-tight truncate">
              {displayTitle}
            </h3>
            <p className="text-[14px] text-[#4d5156] dark:text-[#bdc1c6] leading-snug line-clamp-2">
              {displayDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
