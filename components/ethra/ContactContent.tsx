"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, Instagram, MessageCircle, ChevronDown, Loader2 } from "lucide-react";
import { submitContactMessageAction } from "@/lib/storefront/actions";
import type { ContactMessagePayload } from "@/lib/storefront/types";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
} as const;

const CONTACT_ITEMS = [
  {
    icon: Mail,
    label: "Correo electrónico",
    value: "hola@ethrasport.com",
    href: "mailto:hola@ethrasport.com",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+52 55 8765 4321",
    href: "https://wa.me/5255876543210",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@ethra.sport",
    href: "https://instagram.com/ethra.sport",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Polanco, Ciudad de México\nCDMX 11560, México",
    href: null,
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: "Lun–Vie · 9:00 – 18:00 h\nSáb · 10:00 – 14:00 h",
    href: null,
  },
] as const;

const REQUEST_TYPE_OPTIONS: { value: ContactMessagePayload["requestType"]; label: string }[] = [
  { value: "INQUIRY", label: "Consulta" },
  { value: "COMPLAINT", label: "Queja" },
  { value: "CLAIM", label: "Reclamo" },
  { value: "SUGGESTION", label: "Sugerencia" },
  { value: "OTHER", label: "Otro" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RequestTypeValue = ContactMessagePayload["requestType"] | "";

function validateForm(values: {
  nombre: string;
  email: string;
  phone: string;
  requestType: RequestTypeValue;
  asunto: string;
  mensaje: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.nombre.trim()) {
    errors.nombre = "El nombre es obligatorio.";
  } else if (values.nombre.trim().length > 255) {
    errors.nombre = "El nombre no puede superar 255 caracteres.";
  }

  if (!values.email.trim()) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Ingresa un correo electrónico válido.";
  } else if (values.email.trim().length > 255) {
    errors.email = "El correo no puede superar 255 caracteres.";
  }

  if (values.phone.trim() && values.phone.trim().length > 64) {
    errors.phone = "El teléfono no puede superar 64 caracteres.";
  }

  if (!values.requestType) {
    errors.requestType = "Selecciona un tipo de solicitud.";
  }

  if (!values.asunto.trim()) {
    errors.asunto = "El asunto es obligatorio.";
  } else if (values.asunto.trim().length > 255) {
    errors.asunto = "El asunto no puede superar 255 caracteres.";
  }

  if (!values.mensaje.trim()) {
    errors.mensaje = "El mensaje es obligatorio.";
  } else if (values.mensaje.trim().length < 10) {
    errors.mensaje = "El mensaje debe tener al menos 10 caracteres.";
  } else if (values.mensaje.trim().length > 5000) {
    errors.mensaje = "El mensaje no puede superar 5000 caracteres.";
  }

  return errors;
}

export function ContactContent() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    phone: "",
    requestType: "" as RequestTypeValue,
    asunto: "",
    mensaje: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nombreRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const requestTypeRef = useRef<HTMLSelectElement>(null);
  const asuntoRef = useRef<HTMLInputElement>(null);
  const mensajeRef = useRef<HTMLTextAreaElement>(null);

  const fieldRefs: Record<string, React.RefObject<HTMLElement | null>> = {
    nombre: nombreRef,
    email: emailRef,
    phone: phoneRef,
    requestType: requestTypeRef,
    asunto: asuntoRef,
    mensaje: mensajeRef,
  };

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function resetForm() {
    setForm({ nombre: "", email: "", phone: "", requestType: "", asunto: "", mensaje: "" });
    setErrors({});
    setSubmitError(null);
    setIsSubmitting(false);
    setIsSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0];
      fieldRefs[firstKey]?.current?.focus();
      return;
    }

    setIsSubmitting(true);

    const payload: ContactMessagePayload = {
      fullName: form.nombre.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      requestType: form.requestType as ContactMessagePayload["requestType"],
      subject: form.asunto.trim(),
      message: form.mensaje.trim(),
    };

    try {
      const result = await submitContactMessageAction(payload);
      setIsSubmitting(false);
      if (result.ok) {
        setIsSuccess(true);
      } else if (result.status === 400) {
        const data = result.data as { message?: string | string[] } | undefined;
        if (Array.isArray(data?.message)) {
          setSubmitError(data.message.join(". "));
        } else if (typeof data?.message === "string") {
          setSubmitError(data.message);
        } else {
          setSubmitError("Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.");
        }
      } else {
        setSubmitError("Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.");
      }
    } catch {
      setIsSubmitting(false);
      setSubmitError("Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.");
    }
  }

  return (
    <>
      {/* Hero tipográfico */}
      <section className="bg-ethra-bone px-6 pt-20 pb-16 md:px-10 md:pt-28 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[1400px] text-center"
        >
          <p className="font-display text-[10px] tracking-luxury uppercase text-ethra-stone">
            Contacto
          </p>
          <div className="gold-line mx-auto mt-6 max-w-[200px]" />
          <h1 className="mt-7 font-serif text-4xl text-ethra-black md:text-5xl lg:text-[3.5rem]">
            Estamos aquí para ti
          </h1>
          <p className="mt-5 mx-auto max-w-md text-[15px] leading-[1.85] text-ethra-charcoal">
            Ya sea que tengas una pregunta, una idea o simplemente quieras saludarnos — nos encantará escucharte.
          </p>
        </motion.div>
      </section>

      {/* Contenido principal */}
      <section className="bg-ethra-bone px-6 pb-28 md:px-10 md:pb-36">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-20 xl:gap-28">

          {/* Panel de información */}
          <motion.div {...fadeUp} className="lg:col-span-2 space-y-12">
            <div>
              <p className="font-display text-[10px] tracking-luxury uppercase text-ethra-stone mb-8">
                Información de contacto
              </p>
              <ul className="space-y-8">
                {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-5">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-ethra-stone/20 bg-ethra-cream/50">
                      <Icon className="h-3.5 w-3.5 text-ethra-gold" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-display text-[9px] tracking-[0.2em] uppercase text-ethra-stone mb-1.5">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-[14px] leading-[1.7] text-ethra-charcoal transition-colors hover:text-ethra-gold"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-[14px] leading-[1.7] text-ethra-charcoal whitespace-pre-line">
                          {value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-ethra-stone/15 pt-10">
              <p className="font-display text-[10px] tracking-luxury uppercase text-ethra-stone mb-4">
                Escríbenos directamente
              </p>
              <a
                href="mailto:hola@ethrasport.com"
                className="font-serif text-xl text-ethra-black transition-colors hover:text-ethra-gold"
              >
                hola@ethrasport.com
              </a>
              <p className="mt-3 text-[13px] leading-[1.7] text-ethra-stone">
                Respondemos en 24–48 horas hábiles.
              </p>
            </div>
          </motion.div>

          {/* Panel del formulario */}
          <motion.div {...fadeUp} className="lg:col-span-3">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center py-20 px-8 text-center border border-ethra-stone/20"
              >
                <div className="h-px w-10 bg-ethra-gold/50 mb-8" />
                <p className="font-display text-[10px] tracking-luxury uppercase text-ethra-stone mb-5">
                  Mensaje enviado
                </p>
                <h2 className="font-serif text-2xl text-ethra-black md:text-3xl">
                  Gracias por escribirnos
                </h2>
                <p className="mt-4 text-[14px] leading-[1.85] text-ethra-charcoal max-w-sm">
                  Hemos recibido tu mensaje. Nos pondremos en contacto contigo a través del correo o teléfono que nos proporcionaste.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-10 font-display text-[10px] tracking-luxury uppercase text-ethra-stone transition-colors hover:text-ethra-black"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-7">
                <p className="font-display text-[10px] tracking-luxury uppercase text-ethra-stone mb-8">
                  Envíanos un mensaje
                </p>

                {/* Nombre y correo */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="nombre"
                      className="block font-display text-[9px] tracking-[0.2em] uppercase text-ethra-stone"
                    >
                      Nombre completo <span className="text-ethra-gold" aria-hidden="true">*</span>
                    </label>
                    <input
                      ref={nombreRef}
                      id="nombre"
                      name="nombre"
                      type="text"
                      autoComplete="name"
                      value={form.nombre}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Tu nombre"
                      className="w-full border border-ethra-stone/25 bg-transparent px-4 py-3 text-[14px] text-ethra-black placeholder:text-ethra-stone/40 transition-colors focus:border-ethra-black focus:outline-none disabled:opacity-50"
                    />
                    {errors.nombre && (
                      <p className="text-[12px] text-red-600">{errors.nombre}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block font-display text-[9px] tracking-[0.2em] uppercase text-ethra-stone"
                    >
                      Correo electrónico <span className="text-ethra-gold" aria-hidden="true">*</span>
                    </label>
                    <input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="tu@correo.com"
                      className="w-full border border-ethra-stone/25 bg-transparent px-4 py-3 text-[14px] text-ethra-black placeholder:text-ethra-stone/40 transition-colors focus:border-ethra-black focus:outline-none disabled:opacity-50"
                    />
                    {errors.email && (
                      <p className="text-[12px] text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Teléfono y tipo de solicitud */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block font-display text-[9px] tracking-[0.2em] uppercase text-ethra-stone"
                    >
                      Teléfono
                    </label>
                    <input
                      ref={phoneRef}
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Opcional"
                      className="w-full border border-ethra-stone/25 bg-transparent px-4 py-3 text-[14px] text-ethra-black placeholder:text-ethra-stone/40 transition-colors focus:border-ethra-black focus:outline-none disabled:opacity-50"
                    />
                    {errors.phone && (
                      <p className="text-[12px] text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="requestType"
                      className="block font-display text-[9px] tracking-[0.2em] uppercase text-ethra-stone"
                    >
                      Tipo de solicitud <span className="text-ethra-gold" aria-hidden="true">*</span>
                    </label>
                    <div className="relative">
                      <select
                        ref={requestTypeRef}
                        id="requestType"
                        name="requestType"
                        value={form.requestType}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full appearance-none border border-ethra-stone/25 bg-ethra-bone px-4 py-3 pr-10 text-[14px] text-ethra-black transition-colors focus:border-ethra-black focus:outline-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="" disabled hidden>Selecciona una opción</option>
                        {REQUEST_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ethra-stone"
                        strokeWidth={1.5}
                      />
                    </div>
                    {errors.requestType && (
                      <p className="text-[12px] text-red-600">{errors.requestType}</p>
                    )}
                  </div>
                </div>

                {/* Asunto */}
                <div className="space-y-2">
                  <label
                    htmlFor="asunto"
                    className="block font-display text-[9px] tracking-[0.2em] uppercase text-ethra-stone"
                  >
                    Asunto <span className="text-ethra-gold" aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={asuntoRef}
                    id="asunto"
                    name="asunto"
                    type="text"
                    value={form.asunto}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="¿En qué podemos ayudarte?"
                    className="w-full border border-ethra-stone/25 bg-transparent px-4 py-3 text-[14px] text-ethra-black placeholder:text-ethra-stone/40 transition-colors focus:border-ethra-black focus:outline-none disabled:opacity-50"
                  />
                  {errors.asunto && (
                    <p className="text-[12px] text-red-600">{errors.asunto}</p>
                  )}
                </div>

                {/* Mensaje */}
                <div className="space-y-2">
                  <label
                    htmlFor="mensaje"
                    className="block font-display text-[9px] tracking-[0.2em] uppercase text-ethra-stone"
                  >
                    Mensaje <span className="text-ethra-gold" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    ref={mensajeRef}
                    id="mensaje"
                    name="mensaje"
                    rows={6}
                    value={form.mensaje}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                    className="w-full resize-none border border-ethra-stone/25 bg-transparent px-4 py-3 text-[14px] text-ethra-black placeholder:text-ethra-stone/40 transition-colors focus:border-ethra-black focus:outline-none disabled:opacity-50"
                  />
                  {errors.mensaje && (
                    <p className="text-[12px] text-red-600">{errors.mensaje}</p>
                  )}
                </div>

                {/* Error general de envío */}
                {submitError && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                    {submitError}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <p className="font-display text-[9px] tracking-[0.14em] uppercase text-ethra-stone/60">
                    * campos requeridos
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 border border-ethra-black px-10 py-3.5 font-display text-[10px] tracking-luxury uppercase text-ethra-black transition-colors hover:bg-ethra-black hover:text-ethra-bone disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {isSubmitting ? "Enviando…" : "Enviar mensaje"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Cierre editorial */}
      <section className="bg-ethra-cream px-6 py-20 md:px-10 md:py-28">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-2xl leading-snug text-ethra-black md:text-3xl">
            &ldquo;Cada conversación es el comienzo de algo hermoso.&rdquo;
          </p>
          <div className="gold-line mx-auto mt-8 max-w-[200px]" />
          <p className="mt-6 font-display text-[10px] tracking-luxury uppercase text-ethra-stone">
            Equipo Ethra Sport
          </p>
        </motion.div>
      </section>
    </>
  );
}
