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
    <section className="border-b-2 border-[var(--ink-950)] bg-[var(--paper-0)] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1440px]">
        {backHref && (
          <Link href={backHref} className="mb-6 inline-flex items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4">
            <ArrowLeft aria-hidden="true" size={17} /> Back
          </Link>
        )}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">{eyebrow}</p>
            <h1 className="font-display text-4xl font-bold leading-none md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-6 text-[var(--ink-600)]">{description}</p>
          </div>
          {action && (
            <Link href={action.href} className="button button-primary">
              <Plus aria-hidden="true" size={19} /> {action.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
