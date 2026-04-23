import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import logo from "@/assets/perpex-logo.png";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/success")({
  head: () => ({
    meta: [
      { title: "Application Submitted — PerpeX BYOB" },
      { name: "description", content: "Your PerpeX BYOB application has been submitted successfully." },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--gradient-soft)] px-6 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-[var(--shadow-elegant)]">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/5 ring-1 ring-primary/20">
          <img src={logo} alt="PerpeX logo" className="h-16 w-16 object-contain" />
        </div>

        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <CheckCircle2 className="h-4 w-4" /> Submitted
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
          You're in the pipeline 🚀
        </h1>

        <p className="mt-4 text-base text-foreground/80">
          Thank you for completing the <span className="font-semibold text-primary">PerpeX BYOB Gamma Batch</span> pre-batch alignment form.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Our team will review your application and reach out shortly with next steps. Until then —
          stay sharp, keep building, and get ready to execute.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="hero" size="lg">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>

        <p className="mt-8 text-xs uppercase tracking-widest text-muted-foreground">
          PerpeX · Build · Execute · Win
        </p>
      </div>
    </div>
  );
}
