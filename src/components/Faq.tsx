import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { useDict } from "../i18n";
import { requestQuote } from "../utils/quote";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { cn } from "../utils/cn";

/**
 * FAQ — single-open accordion, quiet by design: hairline rules, a plus mark
 * that rotates into a minus, rows that expand via a grid-rows transition (no
 * height measurement, no layout jank). Answers are process facts and contact
 * routes — never invented prices, delays or coverage.
 *
 * V11: questions and answers come from the active dictionary; the "ask a
 * question" button pre-fills the form with the canonical "Autre" service value
 * so the API contract is language-independent.
 */
export default function Faq() {
  const dict = useDict();
  const t = dict.faq;
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-white py-32 lg:py-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading
              id="faq-heading"
              eyebrow={t.eyebrow}
              title={t.title}
              lede={t.lede}
            />
            <Reveal delay={120}>
              <button
                type="button"
                onClick={() => requestQuote("Autre")}
                className="mt-10 inline-flex items-center gap-2 border border-line-strong px-5 py-3 text-[13px] font-medium tracking-wide text-navy-900 transition-[border-color,background-color,transform] duration-200 hover:border-navy-900 hover:bg-paper active:translate-y-px"
              >
                {t.askCta}
              </button>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <dl className="border-t border-line">
              {t.items.map((item, i) => {
                const isOpen = open === i;
                const btnId = `${uid}-q-${i}`;
                const panelId = `${uid}-a-${i}`;
                return (
                  <Reveal key={item.q} delay={i * 40}>
                    <div className="border-b border-line">
                      <dt>
                        <button
                          id={btnId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setOpen(isOpen ? null : i)}
                          className="group flex w-full items-baseline justify-between gap-8 py-6 text-start"
                        >
                          <span
                            className={cn(
                              "text-[15.5px] leading-snug font-semibold tracking-tight transition-colors duration-200",
                              isOpen ? "text-navy-900" : "text-ink group-hover:text-navy-900",
                            )}
                          >
                            {item.q}
                          </span>
                          <span
                            className={cn(
                              "relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border transition-[background-color,border-color,color] duration-200",
                              isOpen
                                ? "border-navy-900 bg-navy-900 text-white"
                                : "border-line-strong text-navy-900 group-hover:border-navy-900",
                            )}
                            aria-hidden="true"
                          >
                            <Plus size={13} className={cn("transition-transform duration-300 ease-out", isOpen && "rotate-45")} />
                          </span>
                        </button>
                      </dt>
                      <dd
                        id={panelId}
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-2xl pb-7 text-[14.5px] leading-relaxed text-ink-soft">{item.a}</p>
                        </div>
                      </dd>
                    </div>
                  </Reveal>
                );
              })}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
