import { ShopLayout } from "@/components/ethra/ShopLayout";
import { ContactContent } from "@/components/ethra/ContactContent";

export const metadata = {
  title: "Contacto — Ethra Sport",
  description:
    "Escríbenos, visítanos o síguenos en redes. Estamos aquí para responder tus preguntas sobre pedidos, tallas, devoluciones y más.",
};

export default function ContactoPage() {
  return (
    <ShopLayout>
      <ContactContent />
    </ShopLayout>
  );
}
