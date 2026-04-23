import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PerpexLogo } from "@/components/PerpexLogo";
import { addSubmission } from "@/lib/storage";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply — PerpeX BYOB Gamma Batch" },
      { name: "description", content: "Submit your pre-batch alignment form for PerpeX BYOB." },
    ],
  }),
  component: ApplyPage,
});

const STAGES = ["Just an idea", "Started but inconsistent", "Actively working", "Already getting customers"];
const DONE_OPTIONS = ["Research", "Validation (spoken to potential users)", "Built something", "Got first customer", "Nothing yet"];
const BOTTLENECKS = ["Clarity", "Taking action", "Sales / getting customers", "Confidence", "Consistency"];
const HOURS = ["<5 hrs", "5–10 hrs", "10–20 hrs", "20+ hrs"];

function ApplyPage() {
  const navigate = useNavigate();
  const [logoClicks, setLogoClicks] = useState(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setLogoClicks(0), 800);
    if (next >= 3) {
      setLogoClicks(0);
      navigate({ to: "/admin/login" });
    }
  };

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    stage: "",
    ideaSentence: "",
    buildingWhat: "",
    targetCustomer: "",
    problem: "",
    currentSolutions: "",
    whySwitch: "",
    doneSoFar: [] as string[],
    bottleneck: "",
    hoursWeekly: "",
    outcome: "",
    agreed: false,
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleDone = (opt: string) =>
    update(
      "doneSoFar",
      form.doneSoFar.includes(opt)
        ? form.doneSoFar.filter((x) => x !== opt)
        : [...form.doneSoFar, opt]
    );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required: [string, unknown][] = [
      ["Full Name", form.fullName.trim()],
      ["Phone Number", form.phone.trim()],
      ["Current stage", form.stage],
      ["One-sentence description", form.ideaSentence.trim()],
      ["What you're building", form.buildingWhat.trim()],
      ["Target customer", form.targetCustomer.trim()],
      ["Problem", form.problem.trim()],
      ["Current solutions", form.currentSolutions.trim()],
      ["Why switch", form.whySwitch.trim()],
      ["Bottleneck", form.bottleneck],
      ["Hours weekly", form.hoursWeekly],
      ["Outcome", form.outcome.trim()],
    ];
    for (const [name, val] of required) {
      if (!val) {
        toast.error(`Please fill: ${name}`);
        return;
      }
    }
    if (form.doneSoFar.length === 0) {
      toast.error("Select at least one option in 'What have you already done?'");
      return;
    }
    if (!form.agreed) {
      toast.error("You must agree to the commitment to proceed.");
      return;
    }
    addSubmission(form);
    navigate({ to: "/success" });
  };

  useEffect(() => () => { if (clickTimer.current) clearTimeout(clickTimer.current); }, []);

  return (
    <div className="min-h-screen bg-[var(--gradient-soft)] text-foreground">
      <Toaster richColors position="top-center" />
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <PerpexLogo onClick={handleLogoClick} />
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ChevronLeft className="h-4 w-4" /> Back</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Gamma Batch · Pre-Batch Alignment</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Application Form</h1>
          <p className="mt-2 text-muted-foreground">Be specific. Be honest. This is execution-first.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <Section number={1} title="Basic Details">
            <Field label="Full Name" required>
              <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Your full name" />
            </Field>
            <Field label="Phone Number" required>
              <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 ..." />
            </Field>
          </Section>

          <Section number={2} title="Your Starting Point">
            <Field label="1. Which stage are you currently in?" required>
              <RadioGroup value={form.stage} onValueChange={(v) => update("stage", v)} className="grid gap-2 sm:grid-cols-2">
                {STAGES.map((s) => (
                  <label key={s} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-primary/50">
                    <RadioGroupItem value={s} />
                    <span className="text-sm text-foreground">{s}</span>
                  </label>
                ))}
              </RadioGroup>
            </Field>
            <Field label="2. Describe your business / idea in one clear sentence." required>
              <Input value={form.ideaSentence} onChange={(e) => update("ideaSentence", e.target.value)} maxLength={200} />
            </Field>
            <Field label="3. What exactly are you trying to build?" hint="Be specific — avoid vague answers like 'startup'" required>
              <Textarea rows={3} value={form.buildingWhat} onChange={(e) => update("buildingWhat", e.target.value)} maxLength={600} />
            </Field>
          </Section>

          <Section number={3} title="Reality Check">
            <Field label="4. Who is your exact target customer?" required>
              <Textarea rows={2} value={form.targetCustomer} onChange={(e) => update("targetCustomer", e.target.value)} maxLength={400} />
            </Field>
            <Field label="5. What real problem are you solving?" required>
              <Textarea rows={2} value={form.problem} onChange={(e) => update("problem", e.target.value)} maxLength={400} />
            </Field>
            <Field label="6. How are people currently solving this problem?" required>
              <Textarea rows={2} value={form.currentSolutions} onChange={(e) => update("currentSolutions", e.target.value)} maxLength={400} />
            </Field>
            <Field label="7. Why would they switch to you?" required>
              <Textarea rows={2} value={form.whySwitch} onChange={(e) => update("whySwitch", e.target.value)} maxLength={400} />
            </Field>
          </Section>

          <Section number={4} title="Current Actions">
            <Field label="8. What have you already done?" hint="Select all that apply" required>
              <div className="grid gap-2 sm:grid-cols-2">
                {DONE_OPTIONS.map((opt) => (
                  <label key={opt} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-primary/50">
                    <Checkbox checked={form.doneSoFar.includes(opt)} onCheckedChange={() => toggleDone(opt)} />
                    <span className="text-sm text-foreground">{opt}</span>
                  </label>
                ))}
              </div>
            </Field>
            <Field label="9. What is your biggest bottleneck right now?" required>
              <RadioGroup value={form.bottleneck} onValueChange={(v) => update("bottleneck", v)} className="grid gap-2 sm:grid-cols-2">
                {BOTTLENECKS.map((b) => (
                  <label key={b} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-primary/50">
                    <RadioGroupItem value={b} />
                    <span className="text-sm text-foreground">{b}</span>
                  </label>
                ))}
              </RadioGroup>
            </Field>
          </Section>

          <Section number={5} title="Commitment & Outcome">
            <Field label="10. How many hours can you dedicate weekly?" required>
              <RadioGroup value={form.hoursWeekly} onValueChange={(v) => update("hoursWeekly", v)} className="grid gap-2 sm:grid-cols-4">
                {HOURS.map((h) => (
                  <label key={h} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-primary/50">
                    <RadioGroupItem value={h} />
                    <span className="text-sm text-foreground">{h}</span>
                  </label>
                ))}
              </RadioGroup>
            </Field>
            <Field label="11. By the end of this BYOB batch, clearly describe what you aim to achieve." hint="Be specific — revenue, customers, launch, MVP, etc." required>
              <Textarea rows={3} value={form.outcome} onChange={(e) => update("outcome", e.target.value)} maxLength={600} />
            </Field>
          </Section>

          <Section number={6} title="Acknowledgement">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm font-semibold text-foreground">12. I understand that:</p>
              <ul className="mt-3 space-y-1.5 text-sm text-foreground/80">
                <li>• This is an execution-focused program, not just learning</li>
                <li>• I will be expected to take action consistently</li>
                <li>• I may receive direct and honest feedback</li>
                <li>• My results depend on my effort and consistency</li>
              </ul>
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-3">
                <Checkbox checked={form.agreed} onCheckedChange={(v) => update("agreed", Boolean(v))} className="mt-0.5" />
                <span className="text-sm font-medium text-foreground">
                  👉 I agree to fully commit to this process.
                </span>
              </label>
            </div>
          </Section>

          <div className="flex flex-col items-center gap-3 pt-4">
            <Button type="submit" variant="hero" size="xl" className="w-full sm:w-auto">
              Submit Application
            </Button>
            <p className="text-xs text-muted-foreground">Your responses are reviewed by the PerpeX team.</p>
          </div>
        </form>
      </main>
    </div>
  );
}

function Section({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {number}
        </span>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-foreground">
        {label}
        {required && <span className="ml-1 text-primary-glow">*</span>}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}
