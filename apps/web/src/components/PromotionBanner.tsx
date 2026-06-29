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
      <div className="animate-marquee inline-block font-semibold px-4 tracking-wider text-sm md:text-base">
        {promotion.message}
        {promotion.code && (
          <span className="ml-4 px-2 py-0.5 bg-white/20 rounded font-bold border border-white/30">
            {promotion.code}
          </span>
        )}
      </div>
    </div>
  );
}
