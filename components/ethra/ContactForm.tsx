'use client';

import { useRef, useState, type FormEvent, type RefObject } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { submitContactMessage } from '@/lib/storefront/api';
import { StorefrontApiError } from '@/lib/storefront/client';
import type { ContactMessagePayload } from '@/lib/storefront/types';

type RequestTypeValue = ContactMessagePayload['requestType'] | '';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUEST_TYPE_OPTIONS: { value: ContactMessagePayload['requestType']; label: string }[] = [
  { value: 'INQUIRY', label: 'Consulta' },
  { value: 'COMPLAINT', label: 'Queja' },
  { value: 'CLAIM', label: 'Reclamo' },
  { value: 'SUGGESTION', label: 'Sugerencia' },
  { value: 'OTHER', label: 'Otro' },
];

const fieldClassName =
  'w-full border border-ethra-stone/30 bg-white px-4 py-3 text-sm text-ethra-black outline-none transition-colors focus:border-ethra-black rounded-sm';

const labelClassName = 'mb-2 block text-xs uppercase tracking-wider text-ethra-stone';

function validateForm(values: {
  fullName: string;
  email: string;
  phone: string;
  requestType: RequestTypeValue;
  subject: string;
  message: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'El nombre es obligatorio.';
  } else if (values.fullName.trim().length > 255) {
    errors.fullName = 'El nombre no puede superar 255 caracteres.';
  }

  if (!values.email.trim()) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Ingresa un correo electrónico válido.';
  } else if (values.email.trim().length > 255) {
    errors.email = 'El correo no puede superar 255 caracteres.';
  }

  if (values.phone.trim() && values.phone.trim().length > 64) {
    errors.phone = 'El teléfono no puede superar 64 caracteres.';
  }

  if (!values.requestType) {
    errors.requestType = 'Selecciona un tipo de solicitud.';
  }

  if (!values.subject.trim()) {
    errors.subject = 'El asunto es obligatorio.';
  } else if (values.subject.trim().length > 255) {
    errors.subject = 'El asunto no puede superar 255 caracteres.';
  }

  if (!values.message.trim()) {
    errors.message = 'El mensaje es obligatorio.';
  } else if (values.message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres.';
  } else if (values.message.trim().length > 5000) {
    errors.message = 'El mensaje no puede superar 5000 caracteres.';
  }

  return errors;
}

export function ContactForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requestType, setRequestType] = useState<RequestTypeValue>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const requestTypeRef = useRef<HTMLSelectElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const fieldRefs: Record<string, RefObject<HTMLElement | null>> = {
    fullName: fullNameRef,
    email: emailRef,
    phone: phoneRef,
    requestType: requestTypeRef,
    subject: subjectRef,
    message: messageRef,
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setRequestType('');
    setSubject('');
    setMessage('');
    setErrors({});
    setSubmitError(null);
    setIsSubmitting(false);
    setIsSuccess(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const nextErrors = validateForm({
      fullName,
      email,
      phone,
      requestType,
      subject,
      message,
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0];
      fieldRefs[firstKey]?.current?.focus();
      return;
    }

    setIsSubmitting(true);

    const payload: ContactMessagePayload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      requestType: requestType as ContactMessagePayload['requestType'],
      subject: subject.trim(),
      message: message.trim(),
    };

    try {
      await submitContactMessage(payload);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof StorefrontApiError) {
        if (err.status === 401) {
          setSubmitError(
            'No se pudo enviar el mensaje. La tienda no está disponible temporalmente.',
          );
        } else if (err.status === 400) {
          const data = err.data as { message?: string | string[] } | undefined;
          if (Array.isArray(data?.message)) {
            setSubmitError(data.message.join('. '));
          } else if (typeof data?.message === 'string') {
            setSubmitError(data.message);
          } else {
            setSubmitError('Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.');
          }
        } else {
          setSubmitError('Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.');
        }
      } else {
        setSubmitError('Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.');
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <CheckCircle2 className="mb-6 h-12 w-12 text-ethra-gold" strokeWidth={1.25} />
        <h2 className="font-display text-2xl text-ethra-black">Mensaje enviado</h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ethra-stone">
          Hemos recibido tu mensaje. Nos pondremos en contacto contigo a través del correo o
          teléfono que nos proporcionaste.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-8 border border-ethra-black px-8 py-3 font-display text-xs uppercase tracking-widest text-ethra-black transition-colors hover:bg-ethra-black hover:text-white"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="fullName" className={labelClassName}>
          Nombre completo
        </label>
        <input
          ref={fullNameRef}
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isSubmitting}
          className={fieldClassName}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelClassName}>
          Correo electrónico
        </label>
        <input
          ref={emailRef}
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className={fieldClassName}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className={labelClassName}>
          Teléfono (opcional)
        </label>
        <input
          ref={phoneRef}
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isSubmitting}
          className={fieldClassName}
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="requestType" className={labelClassName}>
          Tipo de solicitud
        </label>
        <select
          ref={requestTypeRef}
          id="requestType"
          value={requestType}
          onChange={(e) => setRequestType(e.target.value as RequestTypeValue)}
          disabled={isSubmitting}
          className={fieldClassName}
        >
          <option value="" disabled hidden>
            Selecciona una opción
          </option>
          {REQUEST_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.requestType && (
          <p className="mt-1 text-sm text-red-600">{errors.requestType}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className={labelClassName}>
          Asunto
        </label>
        <input
          ref={subjectRef}
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={isSubmitting}
          className={fieldClassName}
        />
        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
      </div>

      <div>
        <label htmlFor="message" className={labelClassName}>
          Mensaje
        </label>
        <textarea
          ref={messageRef}
          id="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
          className={`${fieldClassName} resize-y min-h-[144px]`}
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
      </div>

      {submitError && (
        <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full items-center justify-center bg-ethra-black font-display text-sm uppercase tracking-widest text-white transition-colors hover:bg-ethra-charcoal disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Enviar mensaje'
        )}
      </button>
    </form>
  );
}
