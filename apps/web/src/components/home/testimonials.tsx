'use client';

import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah M.',
    text: 'Increíble experiencia. El estudio es muy profesional y el artista realmente entendió lo que quería. ¡El resultado superó mis expectativas!',
    role: 'Cliente',
  },
  {
    name: 'James K.',
    text: 'Best tattoo experience I have ever had. The attention to detail and cleanliness is outstanding. Highly recommended!',
    role: 'Client',
  },
  {
    name: 'Maria G.',
    text: 'Mi tercer tatuaje aquí y siempre salgo feliz. El ambiente es acogedor y los artistas son verdaderos profesionales.',
    role: 'Cliente',
  },
];

export function Testimonials() {
  const t = useTranslations();

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
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="relative rounded-lg border bg-background p-8"
            >
              <Quote className="mb-4 h-8 w-8 text-primary/40" />
              <p className="text-muted-foreground">&ldquo;{item.text}&rdquo;</p>
              <div className="mt-6">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
