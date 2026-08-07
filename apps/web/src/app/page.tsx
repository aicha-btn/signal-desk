import type { Metadata } from "next";
import {
  ArrowDown,
  ArrowRight,
  Check,
  MoveRight,
  Sparkles,
} from "lucide-react";
import { LeadForm } from "@/components/landing/lead-form";
import { MotionController } from "@/components/landing/motion-controller";
import { SignalFeedDemo } from "@/components/landing/signal-feed-demo";

export const metadata: Metadata = {
  title: "SignalDesk | Turn customer feedback into clear decisions",
  description:
    "Capture customer feedback from every channel, reveal what matters, and close the loop with one shared signal feed.",
};

const steps = [
  {
    number: "01",
    title: "Capture every signal",
    copy: "Bring email, support, calls and team notes into one living feed.",
    color: "bg-[var(--cobalt-500)] text-[var(--paper-0)]",
  },
  {
    number: "02",
    title: "Focus the noise",
    copy: "Group recurring friction and rank it with criteria everyone can inspect.",
    color: "bg-[var(--acid-400)] text-[var(--ink-950)]",
  },
  {
    number: "03",
    title: "Close the loop",
    copy: "Assign the next move, ship with context and tell customers what changed.",
    color: "bg-[var(--coral-500)] text-[var(--ink-950)]",
  },
] as const;

const audiences = [
  {
    label: "PRODUCT",
    title: "Build from evidence, not volume.",
    copy: "Know which signals deserve a roadmap slot and why.",
  },
  {
    label: "SUPPORT",
    title: "Make recurring friction impossible to lose.",
    copy: "Turn repeated conversations into visible product action.",
  },
  {
    label: "LEADERSHIP",
    title: "See momentum without another status meeting.",
    copy: "Read the pulse, the owners and the closed loops in one view.",
  },
] as const;

const questions = [
  {
    question: "Does SignalDesk replace our support tool?",
    answer:
      "No. It connects the product decisions that begin in support, email, calls and team conversations. Your existing tools keep doing their jobs.",
  },
  {
    question: "Is it useful for a small team?",
    answer:
      "Yes. The workflow starts simple for five people and stays legible as more teams, signals and decision-makers join.",
  },
  {
    question: "Is prioritization powered by a black box?",
    answer:
      "No. SignalDesk is built around transparent criteria, visible context and human decisions. Assistance should clarify judgment, not hide it.",
  },
  {
    question: "What will early access cost?",
    answer:
      "Founding teams will see pricing before committing and will help shape the plans. Joining the list is free and carries no obligation.",
  },
] as const;

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SignalDesk",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "A shared signal feed that turns scattered customer feedback into clear product decisions.",
  };

  return (
    <main className="overflow-x-clip bg-[var(--paper-0)] text-[var(--ink-950)]">
      <MotionController />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="relative z-30 flex h-[68px] items-center justify-between border-b-2 border-[var(--ink-950)] bg-[var(--paper-0)] px-4 md:px-8">
        <a href="#top" className="font-display text-xl font-extrabold">
          SignalDesk
        </a>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          <a className="nav-link" href="#product">Product</a>
          <a className="nav-link" href="#method">Method</a>
          <a className="nav-link" href="#teams">Teams</a>
          <a className="nav-link" href="#faq">FAQ</a>
        </nav>
        <a className="button button-dark min-h-10 px-4 text-sm" href="#early-access">
          Get early access
          <ArrowRight aria-hidden="true" size={17} strokeWidth={2.4} />
        </a>
      </header>

      <section
        id="top"
        aria-labelledby="hero-title"
        className="relative isolate min-h-[640px] overflow-hidden border-b-2 border-[var(--ink-950)] bg-[var(--paper-0)] sm:min-h-[680px] lg:h-[calc(100svh-110px)] lg:min-h-[650px] lg:max-h-[850px]"
      >
        <div aria-hidden="true" className="hero-color-field">
          <span className="hero-color-plane hero-color-plane-cobalt" />
          <span className="hero-color-plane hero-color-plane-magenta" />
          <span className="hero-color-plane hero-color-plane-acid" />
          <span className="hero-color-plane hero-color-plane-coral" />
          <span className="hero-color-plane hero-color-plane-cyan" />
          <span className="hero-color-line hero-color-line-one" />
          <span className="hero-color-line hero-color-line-two" />
        </div>

        <div className="mx-auto flex h-full min-h-[640px] max-w-[1600px] flex-col justify-between px-4 py-7 sm:min-h-[680px] md:px-8 md:py-10 lg:min-h-[650px]">
          <div className="max-w-[840px]">
            <p className="eyebrow mb-5" data-reveal>
              CUSTOMER FEEDBACK INTELLIGENCE
            </p>
            <h1
              id="hero-title"
              className="max-w-[830px] font-display text-[clamp(3.7rem,9vw,8.4rem)] font-extrabold leading-[0.82]"
            >
              <span className="block" data-hero-word>Signal</span>
              <span className="block text-[var(--cobalt-500)]" data-hero-word>Desk.</span>
            </h1>
          </div>

          <div className="grid items-end gap-8 pb-2 md:grid-cols-12">
            <div className="md:col-span-7 lg:col-span-6" data-reveal>
              <h2 className="max-w-[680px] font-display text-3xl font-bold leading-[1.02] sm:text-4xl lg:text-5xl">
                Stop collecting feedback. Start deciding with it.
              </h2>
              <p className="mt-4 max-w-[650px] text-base leading-6 text-[var(--ink-800)] sm:text-lg sm:leading-7">
                One shared signal feed turns scattered customer input into priorities
                your product, support and leadership teams can actually close.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a className="button button-primary" href="#early-access">
                  Get early access
                  <ArrowRight aria-hidden="true" size={19} strokeWidth={2.4} />
                </a>
                <a className="button button-light" href="#product">
                  See the signal feed
                  <ArrowDown aria-hidden="true" size={18} strokeWidth={2.4} />
                </a>
              </div>
            </div>

            <p className="hidden border-l-2 border-[var(--ink-950)] pl-5 font-mono text-xs leading-5 lg:col-span-3 lg:col-start-10 lg:block" data-reveal>
              BUILT FOR TEAMS WITH
              <br />
              MORE FEEDBACK THAN CLARITY.
            </p>
          </div>
        </div>
      </section>

      <div className="grid min-h-11 grid-cols-2 border-b-2 border-[var(--ink-950)] bg-[var(--acid-400)] sm:grid-cols-4">
        {["CAPTURE", "PRIORITIZE", "ASSIGN", "CLOSE THE LOOP"].map((label, index) => (
          <div
            key={label}
            className="flex items-center justify-between border-r-2 border-b-2 border-[var(--ink-950)] px-4 py-3 font-mono text-[11px] font-medium last:border-r-0 sm:border-b-0"
          >
            <span>{label}</span>
            {index < 3 && <MoveRight aria-hidden="true" size={16} />}
          </div>
        ))}
      </div>

      <section className="border-b-2 border-[var(--ink-950)] bg-[var(--paper-0)]" aria-labelledby="problem-title">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7" data-reveal>
            <p className="eyebrow mb-6">THE PROBLEM / NOT THE PEOPLE</p>
            <h2 id="problem-title" className="section-title max-w-[900px]">
              Your customers are talking. Your roadmap is guessing.
            </h2>
          </div>
          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9" data-reveal>
            <p className="text-xl leading-8 text-[var(--ink-800)]">
              Insight arrives everywhere. Decisions happen somewhere else. In between,
              urgency gets mistaken for importance and context quietly disappears.
            </p>
            <div className="mt-8 flex flex-wrap gap-2" aria-label="Feedback channels">
              {["EMAIL", "SLACK", "SUPPORT", "CALLS", "FORMS"].map((channel, index) => (
                <span key={channel} className={`signal-chip signal-chip-${index + 1}`}>{channel}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="border-b-2 border-[var(--ink-950)] bg-[var(--canvas-50)]" aria-labelledby="product-title">
        <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
          <div className="grid items-end gap-8 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-8">
              <p className="eyebrow mb-6">THE CONTROL ROOM</p>
              <h2 id="product-title" className="section-title max-w-[960px]">
                A working view, not a feedback graveyard.
              </h2>
            </div>
            <p className="max-w-md text-lg leading-7 text-[var(--ink-800)] lg:col-span-4 lg:pb-2">
              Every signal keeps its source, customer weight, owner and next move.
              Filter the feed without losing the story.
            </p>
          </div>
          <div className="mt-12" data-reveal>
            <SignalFeedDemo />
          </div>
        </div>
      </section>

      <section id="method" aria-labelledby="method-title">
        <div className="border-b-2 border-[var(--ink-950)] bg-[var(--ink-950)] px-4 py-16 text-[var(--paper-0)] md:px-8 md:py-20">
          <div className="mx-auto max-w-[1600px]" data-reveal>
            <p className="eyebrow mb-6 text-[var(--acid-400)]">ONE CALM OPERATING RHYTHM</p>
            <h2 id="method-title" className="section-title max-w-[1050px]">
              From raw signal to clear next move.
            </h2>
          </div>
        </div>
        <div className="process-track">
          {steps.map((step) => (
            <article
              key={step.number}
              className={`grid min-h-[260px] border-b-2 border-[var(--ink-950)] p-4 md:grid-cols-12 md:p-8 ${step.color}`}
              data-process-step
            >
              <p className="font-mono text-sm font-medium md:col-span-2">{step.number}</p>
              <h3 className="mt-8 font-display text-4xl font-bold leading-none md:col-span-6 md:mt-0 md:text-6xl">
                {step.title}
              </h3>
              <div className="mt-10 flex max-w-md items-start gap-4 md:col-span-4 md:mt-0">
                <Check aria-hidden="true" className="mt-1 shrink-0" size={22} strokeWidth={2.4} />
                <p className="text-lg leading-7">{step.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="teams" className="border-b-2 border-[var(--ink-950)] bg-[var(--paper-0)]" aria-labelledby="teams-title">
        <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
          <div className="grid gap-8 lg:grid-cols-12" data-reveal>
            <p className="eyebrow lg:col-span-3">ONE SIGNAL / SHARED BY ALL</p>
            <h2 id="teams-title" className="section-title lg:col-span-9">
              Less translation between teams. More movement.
            </h2>
          </div>
          <div className="mt-14 border-t-2 border-[var(--ink-950)]">
            {audiences.map((audience, index) => (
              <article
                key={audience.label}
                className="grid gap-5 border-b-2 border-[var(--ink-950)] py-8 md:grid-cols-12 md:items-start"
                data-reveal
              >
                <p className="font-mono text-xs font-medium md:col-span-2">{audience.label}</p>
                <h3 className="font-display text-3xl font-bold leading-tight md:col-span-6 md:text-4xl">
                  {audience.title}
                </h3>
                <p className="max-w-md text-lg leading-7 text-[var(--ink-600)] md:col-span-4">
                  {audience.copy}
                </p>
                <span
                  aria-hidden="true"
                  className={`hidden h-2 md:col-span-10 md:col-start-3 md:block ${[
                    "bg-[var(--magenta-500)]",
                    "bg-[var(--cyan-400)]",
                    "bg-[var(--mint-500)]",
                  ][index]}`}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-b-2 border-[var(--ink-950)] bg-[var(--canvas-50)]" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <p className="eyebrow mb-6">CLEAR ANSWERS / NO THEATER</p>
            <h2 id="faq-title" className="section-title">Before you ask.</h2>
          </div>
          <div className="border-t-2 border-[var(--ink-950)] lg:col-span-7 lg:col-start-6" data-reveal>
            {questions.map((item) => (
              <details key={item.question} className="faq-item group border-b-2 border-[var(--ink-950)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 font-display text-xl font-bold md:text-2xl">
                  {item.question}
                  <span aria-hidden="true" className="faq-toggle">+</span>
                </summary>
                <p className="max-w-2xl pb-7 pr-10 text-base leading-7 text-[var(--ink-600)] md:text-lg">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="early-access" className="bg-[var(--cobalt-500)] text-[var(--paper-0)]" aria-labelledby="access-title">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7" data-reveal>
            <div className="mb-7 inline-flex size-12 items-center justify-center border-2 border-[var(--paper-0)]">
              <Sparkles aria-hidden="true" size={24} strokeWidth={2.2} />
            </div>
            <p className="eyebrow mb-6 text-[var(--acid-400)]">EARLY ACCESS / FOUNDING TEAMS</p>
            <h2 id="access-title" className="section-title max-w-[900px]">
              Your customers already sent the signal.
              <span className="block text-[var(--acid-400)]">Make the next move obvious.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9" data-reveal>
            <LeadForm />
          </div>
        </div>
      </section>

      <footer className="grid border-t-2 border-[var(--ink-950)] bg-[var(--acid-400)] px-4 py-7 md:grid-cols-3 md:px-8">
        <p className="font-display text-xl font-extrabold">SignalDesk</p>
        <p className="mt-4 font-mono text-xs md:mt-1 md:text-center">PRECISION WITH A PULSE.</p>
        <p className="mt-4 text-sm md:mt-1 md:text-right">© {new Date().getFullYear()} SignalDesk</p>
      </footer>
    </main>
  );
}
