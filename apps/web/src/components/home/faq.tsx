'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Loader2 } from 'lucide-react';
import { faqApi } from '@/lib/api/faq';

export function FAQ() {
  const t = useTranslations('home');
  const locale = useLocale();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['faq', 'public', locale],
    queryFn: () => faqApi.getAll({ locale }),
  });

  const faqs = data?.items || [];

  return (
    <section className="py-20">
      <div className="container max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('faq.title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('faq.description')}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center mt-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="mt-12 text-center text-muted-foreground">
            No se pudieron cargar las preguntas frecuentes.
          </div>
        ) : faqs.length > 0 ? (
          <Accordion.Root
            type="single"
            collapsible
            className="mt-12 space-y-4"
          >
            {faqs.map((faq) => {
              const translation = faq.translations?.[0];
              if (!translation) return null;
              
              return (
                <Accordion.Item
                  key={faq.id}
                  value={faq.id}
                  className="rounded-lg border"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-left font-medium transition-colors hover:text-primary [&[data-state=open]>svg]:rotate-180">
                      {translation.question}
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-6 pb-4 text-muted-foreground data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    {translation.answer}
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        ) : (
          <div className="mt-12 text-center text-muted-foreground">
            No hay preguntas frecuentes disponibles en este momento.
          </div>
        )}
      </div>
    </section>
  );
}
