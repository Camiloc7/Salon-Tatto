import { FaqForm } from '@/components/admin/faq/faq-form';

export default function CreateFaqPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nueva FAQ</h1>
        <p className="text-muted-foreground text-sm">
          Añade una nueva pregunta frecuente al sistema.
        </p>
      </div>

      <FaqForm />
    </div>
  );
}
