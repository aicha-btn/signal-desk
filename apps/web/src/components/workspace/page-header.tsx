import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  backHref,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
  backHref?: string;
}) {
  return (
    <section className="border-b-2 border-[var(--ink-950)] bg-[var(--paper-0)] px-4 py-5 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1440px]">
        {backHref && (
          <Link href={backHref} className="mb-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4 md:mb-6">
            <ArrowLeft aria-hidden="true" size={17} /> Back
          </Link>
        )}
        <div className="flex flex-wrap items-end justify-between gap-4 md:gap-6">
          <div>
            <p className="eyebrow mb-2 md:mb-3">{eyebrow}</p>
            <h1 className="font-display text-3xl font-bold leading-none md:text-5xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-5 text-[var(--ink-600)] md:mt-4 md:text-base md:leading-6">{description}</p>
          </div>
          {action && (
            <Link href={action.href} className="button button-primary min-h-11 py-2.5 md:min-h-12 md:py-3">
              <Plus aria-hidden="true" size={19} /> {action.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
