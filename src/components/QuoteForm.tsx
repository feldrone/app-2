import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown, Loader2, Mail } from "lucide-react";
import { company } from "../data/company";
import { useDict, type Dictionary } from "../i18n";
import { PREFILL_EVENT, PENDING_SERVICE_KEY } from "../utils/quote";
import { cn } from "../utils/cn";

/**
 * Quote request form — V10 behaviour, V11 languages, V12 reusable.
 *
 * The payload sent to POST /api/quote is byte-for-byte what it was: `service`
 * is always the canonical French identifier (see `dict.contact.form.options`),
 * the honeypot field still ships as `website`, and the field names never
 * change with the locale — so the API contract, the validation, the
 * sanitisation, the rate limiting and the honest email status are untouched.
 *
 * V12 mount points: the home page section (`/`), `/devis` and `/contact`.
 * Exactly one instance is mounted at a time, and each keeps `id="quote-form"`
 * so the existing focus handshake in `utils/quote.ts` keeps working.
 */
const API_ENDPOINT = "/api/quote";

type FormValues = {
  name: string;
  phone: string;
  email: string;
  company: string;
  wilaya: string;
  service: string;
  message: string;
  website: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;
type Status = "idle" | "submitting" | "success" | "error" | "offline";

const EMPTY: FormValues = {
  name: "",
  phone: "",
  email: "",
  company: "",
  wilaya: "",
  service: "",
  message: "",
  website: "",
};

function digits(v: string) {
  return (v.match(/\d/g) ?? []).length;
}

/** Localised messages, identical rules to the server (lib/quote-core.mjs). */
function validate(values: FormValues, e: Dictionary["contact"]["form"]["errors"]): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  if (!name) errors.name = e.nameRequired;
  else if (name.length < 2 || name.length > 80) errors.name = e.nameLength;

  const phone = values.phone.trim();
  if (!phone) errors.phone = e.phoneRequired;
  else if (!/^[+0-9][0-9 ().+/–-]{5,19}$/.test(phone) || digits(phone) < 8 || digits(phone) > 15)
    errors.phone = e.phoneInvalid;

  const email = values.email.trim();
  if ((email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) || email.length > 120)
    errors.email = e.emailInvalid;

  const companyVal = values.company.trim();
  if (companyVal && companyVal.length > 120) errors.company = e.companyLength;

  const wilaya = values.wilaya.trim();
  if (!wilaya) errors.wilaya = e.wilayaRequired;
  else if (wilaya.length < 2 || wilaya.length > 80) errors.wilaya = e.wilayaLength;

  if (!values.service) errors.service = e.serviceRequired;

  const message = values.message.trim();
  if (!message) errors.message = e.messageRequired;
  else if (message.length < 15) errors.message = e.messageShort;
  else if (message.length > 3000) errors.message = e.messageLong;

  return errors;
}

export default function QuoteForm() {
  const dict = useDict();
  const t = dict.contact;
  const uid = useId();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const set = (field: keyof FormValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };
  const blur = (field: keyof FormValues) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((er) => ({ ...er, [field]: validate(values, t.form.errors)[field] }));
  };

  /** Accept a service prefill from a service card — always a canonical value. */
  const applyService = (service: string) => {
    setStatus("idle");
    setValues((v) => ({
      ...v,
      service: t.form.options.some((o) => o.value === service) ? service : "Autre",
    }));
    setErrors((er) => ({ ...er, service: undefined }));
  };

  useEffect(() => {
    const onPrefill = (e: Event) => applyService((e as CustomEvent<string>).detail);
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // Prefill handed over across a route change (`/services/...` → `/devis`).
  useEffect(() => {
    try {
      const pending = window.sessionStorage.getItem(PENDING_SERVICE_KEY);
      if (pending) {
        window.sessionStorage.removeItem(PENDING_SERVICE_KEY);
        applyService(pending);
      }
    } catch {
      /* storage unavailable — the visitor simply fills the field */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const showErrors = (next: FieldErrors) => {
    setErrors(next);
    const first = (["name", "phone", "wilaya", "email", "company", "service", "message"] as const).find((f) => next[f]);
    if (first) document.getElementById(idOf(first))?.focus();
  };

  const idOf = (field: keyof FormValues) => `${uid}-${field}`;

  const mailtoHref = () => {
    const m = t.form.mailto;
    const subject = m.subject(values.service, values.name);
    const body = [
      `${m.name} : ${values.name}`,
      `${m.phone} : ${values.phone}`,
      values.company ? `${m.company} : ${values.company}` : null,
      `${m.wilaya} : ${values.wilaya}`,
      values.email ? `${m.email} : ${values.email}` : null,
      `${m.service} : ${values.service}`,
      "",
      `${m.message} :`,
      values.message,
    ]
      .filter(Boolean)
      .join("\n");
    return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = validate(values, t.form.errors);
    if (Object.keys(validation).length > 0) {
      setTouched({ name: true, phone: true, wilaya: true, email: true, company: true, service: true, message: true });
      showErrors(validation);
      return;
    }
    setStatus("submitting");
    try {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 12000);
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim() || null,
          company: values.company.trim() || null,
          wilaya: values.wilaya.trim(),
          service: values.service,
          message: values.message.trim(),
          website: values.website,
        }),
        signal: controller.signal,
      });
      window.clearTimeout(timer);

      if (res.ok) {
        const data = (await res.json().catch(() => null)) as { id?: string } | null;
        setReference(data?.id ? data.id.slice(0, 8).toUpperCase() : null);
        setStatus("success");
        setValues(EMPTY);
        setTouched({});
        setErrors({});
      } else if (res.status === 429) {
        setStatus("error");
        setErrors({ message: t.form.errors.rateLimited });
      } else if (res.status === 404 || res.status === 405) {
        setStatus("offline");
      } else {
        // Server field errors carry canonical field keys; re-validate locally
        // so the message is shown in the visitor's language.
        const data = (await res.json().catch(() => null)) as { fields?: FieldErrors } | null;
        if (data?.fields && Object.keys(data.fields).length > 0) {
          setStatus("error");
          showErrors(validate(values, t.form.errors));
        } else {
          setStatus("error");
        }
      }
    } catch {
      setStatus("offline");
    }
    statusRef.current?.scrollIntoView({ block: "nearest" });
  };

  const field = (name: keyof FormValues) => ({
    id: idOf(name),
    name,
    "data-quote-field": name,
    onChange: set(name),
    onBlur: blur(name),
    "aria-invalid": Boolean(touched[name] && errors[name]) || undefined,
    "aria-describedby": errors[name] && touched[name] ? `${idOf(name)}-error` : undefined,
  });

  return (
    <div ref={statusRef} id="quote-form" className="rounded-[4px] bg-white p-7 sm:p-10">
      {status === "success" ? (
        <div role="status" className="flex flex-col items-start gap-4 py-6">
          <CheckCircle2 size={34} className="text-success" aria-hidden="true" />
          <h3 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
            {t.form.success.title}
            {reference && (
              <>
                {" — "}
                {t.form.success.reference}{" "}
                <span className="font-mono text-[1.05em]">{reference}</span>
              </>
            )}
          </h3>
          <p className="max-w-md text-[14px] leading-relaxed text-ink-soft">
            {t.form.success.body}{" "}
            <a className="font-medium text-navy-900 underline decoration-signal-600 decoration-2 underline-offset-4" href={`tel:${company.phoneHref}`}>
              <span dir="ltr" className="inline-block">{company.phone}</span>
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide text-signal-700 uppercase transition-colors hover:text-navy-900"
          >
            {t.form.success.again}
            <ArrowRight size={14} className="rtl:rotate-180" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <form noValidate onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-7 gap-y-7 sm:grid-cols-2">
            <TextField label={t.form.name} required {...field("name")} error={touched.name ? errors.name : undefined} autoComplete="name" placeholder={t.form.namePlaceholder} />
            <TextField label={t.form.phone} required {...field("phone")} error={touched.phone ? errors.phone : undefined} type="tel" inputMode="tel" autoComplete="tel" placeholder={t.form.phonePlaceholder} hint={t.form.phoneHint} />
            <TextField label={t.form.company} {...field("company")} error={touched.company ? errors.company : undefined} autoComplete="organization" placeholder={t.form.companyPlaceholder} />
            <TextField label={t.form.wilaya} required {...field("wilaya")} error={touched.wilaya ? errors.wilaya : undefined} autoComplete="address-level1" placeholder={t.form.wilayaPlaceholder} />
            <TextField label={t.form.email} {...field("email")} error={touched.email ? errors.email : undefined} type="email" inputMode="email" autoComplete="email" placeholder={t.form.emailPlaceholder} />
            <div>
              <label htmlFor={idOf("service")} className="mb-2 block text-[13px] font-medium text-iron">
                {t.form.service} <span className="text-signal-600" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <select
                  {...field("service")}
                  value={values.service}
                  className={cn(
                    "w-full appearance-none rounded-[4px] border bg-white px-4 py-3 pe-9 text-[14px] text-iron outline-none transition-colors focus:border-navy-900",
                    touched.service && errors.service ? "border-error" : "border-slate",
                    !values.service && "text-graphite",
                  )}
                >
                  <option value="" disabled>
                    {t.form.servicePlaceholder}
                  </option>
                  {t.form.options.map((option) => (
                    <option key={option.value} value={option.value} className="text-iron">
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute top-1/2 end-1 -translate-y-1/2 text-mute" aria-hidden="true" />
              </div>
              {touched.service && errors.service && <FieldError id={`${idOf("service")}-error`}>{errors.service}</FieldError>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={idOf("message")} className="mb-2 block text-[13px] font-medium text-iron">
                {t.form.message} <span className="text-signal-600" aria-hidden="true">*</span>
              </label>
              <textarea
                {...field("message")}
                rows={5}
                maxLength={3000}
                placeholder={t.form.messagePlaceholder}
                className={cn(
                  "w-full resize-y rounded-[4px] border bg-white px-4 py-3 text-[14px] text-iron outline-none transition-colors placeholder:text-graphite focus:border-navy-900",
                  touched.message && errors.message ? "border-error" : "border-slate",
                )}
              />
              <div className="mt-2 flex items-start justify-between gap-4">
                {touched.message && errors.message ? <FieldError id={`${idOf("message")}-error`}>{errors.message}</FieldError> : <span />}
                <span className="text-[11.5px] text-mute tabular-nums" aria-hidden="true">
                  {values.message.length}/3000
                </span>
              </div>
            </div>

            <div className="sr-only" aria-hidden="true">
              <label htmlFor={idOf("website")}>{t.form.honeypot}</label>
              <input id={idOf("website")} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal-500 px-8 py-3.5 text-[14px] font-medium tracking-wide text-navy-950 transition-[background-color,transform] duration-200 hover:bg-signal-600 active:translate-y-px disabled:cursor-wait disabled:opacity-70 sm:w-auto"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    {t.form.submitting}
                  </>
                ) : (
                  <>
                    {t.form.submit}
                    <ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true" />
                  </>
                )}
              </button>
              <p className="mt-4 max-w-xl text-[12px] leading-relaxed text-mute">
                {t.form.required} <span className="text-signal-600">*</span> — {t.form.footnote}
              </p>

              {status === "error" && !Object.values(errors).some(Boolean) && (
                <p role="alert" className="mt-4 flex items-start gap-2 rounded-[4px] border border-error/30 bg-error/5 px-4 py-3 text-[13px] leading-relaxed text-iron">
                  <AlertCircle size={15} className="mt-0.5 shrink-0 text-error" aria-hidden="true" />
                  {t.form.errorSend}{" "}
                  <a className="font-medium underline decoration-signal-600 decoration-2 underline-offset-4" href={`tel:${company.phoneHref}`}>
                    <span dir="ltr" className="inline-block">{company.phone}</span>
                  </a>
                  .
                </p>
              )}
              {status === "offline" && (
                <div role="alert" className="mt-4 rounded-[4px] border border-fog bg-white px-4 py-4 text-[13px] leading-relaxed text-iron">
                  <p className="flex items-start gap-2 font-medium text-navy-900">
                    <AlertCircle size={15} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                    {t.form.offlineTitle}
                  </p>
                  <p className="mt-2 text-graphite">{t.form.offlineBody(company.phone)}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <a href={mailtoHref()} className="inline-flex items-center gap-2 rounded-full bg-signal-500 px-5 py-2.5 text-[13px] font-medium tracking-wide text-navy-950 transition-colors hover:bg-signal-600">
                      <Mail size={14} aria-hidden="true" />
                      {t.form.offlineEmail}
                    </a>
                    <button type="button" onClick={() => setStatus("idle")} className="inline-flex items-center px-2 py-2.5 text-[13px] font-medium text-navy-700 underline decoration-signal-600 decoration-2 underline-offset-4 transition-colors hover:text-navy-900">
                      {t.form.retry}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-[12.5px] text-error">
      <AlertCircle size={14} aria-hidden="true" /> {children}
    </p>
  );
}

function TextField({
  label,
  id,
  name,
  type = "text",
  error,
  hint,
  required = false,
  ...rest
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  error?: string;
  hint?: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement> & { onChange: (e: ChangeEvent<HTMLInputElement>) => void; onBlur: () => void }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-iron">
        {label} {required && <span className="text-signal-600" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        aria-required={required || undefined}
        {...rest}
        className={cn(
          "w-full rounded-[4px] border bg-white px-4 py-3 text-[14px] text-iron outline-none transition-colors placeholder:text-graphite focus:border-navy-900",
          error ? "border-error" : "border-slate",
        )}
      />
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : hint ? <p className="mt-2 text-[11.5px] text-mute">{hint}</p> : null}
    </div>
  );
}
