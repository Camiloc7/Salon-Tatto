'use client';

import { cn } from '@/lib/utils';
import { LOCALE_CONFIG, type LocaleCode } from '@salon-tatto/shared';

type LocaleTabsProps = {
  activeLocale: LocaleCode;
  onLocaleChange: (locale: LocaleCode) => void;
  className?: string;
};

export function LocaleTabs({ activeLocale, onLocaleChange, className }: LocaleTabsProps) {
  return (
    <div className={cn('flex gap-1 border-b', className)}>
      {(Object.entries(LOCALE_CONFIG) as [LocaleCode, typeof LOCALE_CONFIG[LocaleCode]][]).map(
        ([code, config]) => (
          <button
            key={code}
            type="button"
            onClick={() => onLocaleChange(code)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              'border-b-2 -mb-px',
              activeLocale === code
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {config.nativeName}
          </button>
        ),
      )}
    </div>
  );
}
