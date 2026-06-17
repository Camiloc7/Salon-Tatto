'use client';

import { useTranslations } from 'next-intl';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How should I prepare for my tattoo session?',
    answer:
      'Make sure you are well-rested, hydrated, and have eaten a good meal before your appointment. Avoid alcohol and caffeine 24 hours prior. Wear comfortable clothing that allows access to the area being tattooed.',
  },
  {
    question: 'Does it hurt?',
    answer:
      'Pain tolerance varies by person and location. Most people describe it as a scratching sensation. We use numbing creams and techniques to minimize discomfort.',
  },
  {
    question: 'How do I care for my new tattoo?',
    answer:
      'Keep it clean and moisturized. Avoid sun exposure, swimming, and heavy exercise for the first two weeks. Follow the aftercare instructions provided by your artist.',
  },
  {
    question: 'Can I bring a friend?',
    answer:
      'Yes, you are welcome to bring one person for support. However, we ask that they remain respectful of the workspace and other clients.',
  },
  {
    question: 'How much does a tattoo cost?',
    answer:
      'Pricing depends on size, complexity, and placement. Contact us for a free consultation and quote. We offer competitive rates and high-quality work.',
  },
  {
    question: 'Do you offer consultations?',
    answer:
      'Yes, we offer free consultations. You can visit the studio or schedule a video call to discuss your design, placement, and any questions you may have.',
  },
];

export function FAQ() {
  const t = useTranslations();

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

        <Accordion.Root
          type="single"
          collapsible
          className="mt-12 space-y-4"
        >
          {faqs.map((faq, index) => (
            <Accordion.Item
              key={index}
              value={`item-${index}`}
              className="rounded-lg border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-left font-medium transition-colors hover:text-primary [&[data-state=open]>svg]:rotate-180">
                  {faq.question}
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-6 pb-4 text-muted-foreground data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                {faq.answer}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
