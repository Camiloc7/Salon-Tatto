'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api-client';

type Promotion = {
  id: string;
  code: string | null;
  message: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
};

export default function PromotionBanner() {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Do not fetch or display promotions on admin panel
    if (pathname && pathname.includes('/admin')) {
      return;
    }

    async function fetchActivePromotion() {
      try {
        const data = await api.get<Promotion>('/promotions/active');
        if (data && data.isActive) {
          setPromotion(data);
        }
      } catch (error) {
        // No active promotion or error fetching, ignore
      }
    }
    
    fetchActivePromotion();
  }, []);

  if (!promotion) return null;

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
