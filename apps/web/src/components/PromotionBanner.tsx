'use client';

import { usePathname } from 'next/navigation';

export type Promotion = {
  id: string;
  code: string | null;
  message: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
};

export default function PromotionBanner({ promotion }: { promotion: Promotion | null }) {
  const pathname = usePathname();

  if (!promotion) return null;
  if (pathname && pathname.includes('/admin')) return null;

  return (
    <div 
      className="w-full overflow-hidden whitespace-nowrap py-2 relative z-50 flex items-center"
      style={{ backgroundColor: promotion.backgroundColor, color: promotion.textColor }}
    >
      <div className="animate-marquee flex shrink-0 w-max">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center px-4 md:px-8">
            <span className="font-semibold tracking-wider text-sm md:text-base">
              {promotion.message}
            </span>
            {promotion.code && (
              <span className="ml-3 px-2 py-0.5 bg-white/20 rounded font-bold border border-white/30 text-sm">
                {promotion.code}
              </span>
            )}
            <span className="mx-4 md:mx-8 opacity-50 text-xs text-white/50">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
