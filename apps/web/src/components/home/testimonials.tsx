'use client';

import { useTranslations } from 'next-intl';
import { Quote, Star } from 'lucide-react';
import type { GoogleReview } from '@/lib/google-places';
import Image from 'next/image';

const defaultTestimonials = [
  {
    author_name: 'Sarah M.',
    text: 'Increíble experiencia. El estudio es muy profesional y el artista realmente entendió lo que quería. ¡El resultado superó mis expectativas!',
    rating: 5,
  },
  {
    author_name: 'James K.',
    text: 'Best tattoo experience I have ever had. The attention to detail and cleanliness is outstanding. Highly recommended!',
    rating: 5,
  },
  {
    author_name: 'Maria G.',
    text: 'Mi tercer tatuaje aquí y siempre salgo feliz. El ambiente es acogedor y los artistas son verdaderos profesionales.',
    rating: 5,
  },
];

interface TestimonialsProps {
  initialReviews?: GoogleReview[];
}

export function Testimonials({ initialReviews = [] }: TestimonialsProps) {
  const t = useTranslations('home');
  
  // Use google reviews if available, otherwise fallback to defaults
  const displayReviews = initialReviews.length > 0 ? initialReviews : defaultTestimonials;

  return (
    <section className="bg-muted py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('testimonials.title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('testimonials.description')}
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {displayReviews.map((item, index) => {
            const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
            const isClickable = !!placeId;
            const Wrapper = isClickable ? 'a' : 'div';
            const wrapperProps = isClickable ? {
              href: `https://search.google.com/local/reviews?placeid=${placeId}`,
              target: "_blank",
              rel: "noopener noreferrer",
            } : {};

            return (
            <Wrapper
              key={index}
              {...wrapperProps}
              className={`relative rounded-lg border bg-background p-8 flex flex-col ${isClickable ? 'hover:border-primary/50 transition-colors cursor-pointer group' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <Quote className="h-8 w-8 text-primary/40" />
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < (item.rating || 5) ? 'fill-current' : 'text-zinc-700'}`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-muted-foreground flex-grow line-clamp-6" title={item.text}>
                &ldquo;{item.text}&rdquo;
              </p>
              
              <div className="mt-6 flex items-center gap-3">
                {/* Optional profile photo if coming from google */}
                {('profile_photo_url' in item && item.profile_photo_url) ? (
                  <Image 
                    src={item.profile_photo_url as string} 
                    alt={item.author_name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                    {item.author_name.charAt(0)}
                  </div>
                )}
                
                <div>
                  <p className="font-semibold">{item.author_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {('relative_time_description' in item) ? item.relative_time_description as string : 'Verified Client'}
                  </p>
                </div>
              </div>
            </Wrapper>
          )})}
        </div>
        

      </div>
    </section>
  );
}
