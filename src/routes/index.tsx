import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PerpexLogo } from "@/components/PerpexLogo";
import { ArrowRight, CheckCircle2, Target, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PerpeX BYOB — Pre-Batch Alignment (Gamma Batch)" },
      {
        name: "description",
        content:
          "Apply for the PerpeX BYOB Gamma Batch — an execution-focused program to build your business.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <div className="min-h-screen bg-[var(--gradient-soft)]">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <PerpexLogo />
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Gamma Batch · 2026
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-20 pt-16 text-center md:pt-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse" />
          Pre-Batch Alignment Form
        </div>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
          Welcome to <span className="text-primary">PerpeX BYOB</span>
          <br />
          <span className="bg-[var(--gradient-primary)] bg-clip-text text-transparent">
            Gamma Batch
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">
          Hey future founder — before we kick off the batch, we need to understand exactly
          where you stand. This form helps us align with your goals, your bottlenecks, and
          your commitment level so we can push you to ship real results.
        </p>

        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
          Be honest. Be specific. Vague answers = vague outcomes. This is execution-first.
        </p>

        <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { icon: Target, title: "Get Clarity", desc: "Define your real target & problem" },
            { icon: Zap, title: "Take Action", desc: "Move from idea to execution" },
            { icon: CheckCircle2, title: "Ship Results", desc: "Revenue, MVP, customers" },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-5 text-left shadow-[var(--shadow-card)]"
            >
              <Icon className="mb-3 h-6 w-6 text-primary" />
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Button asChild variant="hero" size="lg">
            <Link to="/apply">
              Complete Application
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Takes ~5 minutes · 12 questions
          </p>
        </div>
      </main>
    </div>
  );
}
