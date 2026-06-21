import { ShopLayout } from '@/components/ethra/ShopLayout';
import { ContactForm } from '@/components/ethra/ContactForm';

export const metadata = {
  title: 'Contacto | Ethra Sport',
  description: 'Escríbenos. Estamos aquí para ayudarte.',
};

export default function ContactoPage() {
  return (
    <ShopLayout>
      <section className="bg-ethra-bone px-6 py-16 md:py-20">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-display text-4xl tracking-tight text-ethra-black md:text-5xl">
            Escríbenos
          </h1>
          <p className="mt-4 text-sm text-ethra-stone">Estamos aquí para escucharte.</p>
        </div>
      </section>

      <section className="bg-ethra-bone px-6 pb-20">
        <div className="mx-auto max-w-xl px-2 md:px-0">
          <ContactForm />
          <p className="mt-12 text-center text-sm text-ethra-stone">
            Si prefieres contactarnos directamente, escríbenos a nuestras redes sociales.
          </p>
        </div>
      </section>
    </ShopLayout>
  );
}
