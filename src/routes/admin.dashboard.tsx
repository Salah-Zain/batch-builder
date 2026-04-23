import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PerpexLogo } from "@/components/PerpexLogo";
import { getSubmissions, isAdminLoggedIn, setAdminSession, type Submission } from "@/lib/storage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, CheckCircle2, Clock, TrendingUp, Search, LogOut, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard — PerpeX" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [list, setList] = useState<Submission[]>([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Submission | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate({ to: "/admin/login" });
      return;
    }
    setList(getSubmissions());
  }, [navigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.stage.toLowerCase().includes(q) ||
        s.bottleneck.toLowerCase().includes(q)
    );
  }, [list, query]);

  const stats = useMemo(() => {
    const total = list.length;
    const committed = list.filter((s) => s.hoursWeekly === "20+ hrs" || s.hoursWeekly === "10–20 hrs").length;
    const withCustomers = list.filter((s) => s.stage === "Already getting customers").length;
    const today = new Date().toDateString();
    const todayCount = list.filter((s) => new Date(s.submittedAt).toDateString() === today).length;
    return { total, committed, withCustomers, todayCount };
  }, [list]);

  const logout = () => {
    setAdminSession(false);
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-soft)]">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <PerpexLogo />
            <span className="hidden rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary sm:inline">
              Admin
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">All BYOB Gamma Batch submissions in one place.</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Total Applications" value={stats.total} accent="from-primary to-primary-glow" />
          <StatCard icon={Clock} label="Submitted Today" value={stats.todayCount} accent="from-primary-glow to-primary" />
          <StatCard icon={CheckCircle2} label="High Commitment (10+ hrs)" value={stats.committed} accent="from-primary to-primary-glow" />
          <StatCard icon={TrendingUp} label="Already Getting Customers" value={stats.withCustomers} accent="from-primary-glow to-primary" />
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="flex flex-col items-stretch justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-foreground">Submissions</h2>
              <p className="text-xs text-muted-foreground">{filtered.length} of {list.length} shown</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, stage…"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="text-foreground">Name</TableHead>
                  <TableHead className="text-foreground">Phone</TableHead>
                  <TableHead className="text-foreground">Stage</TableHead>
                  <TableHead className="text-foreground">Bottleneck</TableHead>
                  <TableHead className="text-foreground">Hours/Week</TableHead>
                  <TableHead className="text-foreground">Submitted</TableHead>
                  <TableHead className="text-right text-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-16 text-center text-muted-foreground">
                      {list.length === 0 ? "No applications submitted yet." : "No results match your search."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => (
                    <TableRow key={s.id} className="hover:bg-secondary/40">
                      <TableCell className="font-semibold text-foreground">{s.fullName}</TableCell>
                      <TableCell className="text-foreground">{s.phone}</TableCell>
                      <TableCell><Badge>{s.stage}</Badge></TableCell>
                      <TableCell className="text-foreground">{s.bottleneck}</TableCell>
                      <TableCell className="text-foreground">{s.hoursWeekly}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(s.submittedAt).toLocaleDateString()}{" "}
                        <span className="text-xs">{new Date(s.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setActive(s)}>
                          <Eye className="h-4 w-4" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">{active?.fullName}</DialogTitle>
          </DialogHeader>
          {active && (
            <div className="space-y-4 text-sm text-foreground">
              <Detail k="Phone" v={active.phone} />
              <Detail k="Stage" v={active.stage} />
              <Detail k="One-sentence idea" v={active.ideaSentence} />
              <Detail k="What they're building" v={active.buildingWhat} />
              <Detail k="Target customer" v={active.targetCustomer} />
              <Detail k="Problem" v={active.problem} />
              <Detail k="Current solutions" v={active.currentSolutions} />
              <Detail k="Why switch" v={active.whySwitch} />
              <Detail k="Done so far" v={active.doneSoFar.join(", ")} />
              <Detail k="Bottleneck" v={active.bottleneck} />
              <Detail k="Hours weekly" v={active.hoursWeekly} />
              <Detail k="Outcome goal" v={active.outcome} />
              <Detail k="Agreed to commit" v={active.agreed ? "Yes ✅" : "No"} />
              <Detail k="Submitted" v={new Date(active.submittedAt).toLocaleString()} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, accent,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-10`} />
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
      {children}
    </span>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</p>
      <p className="mt-1 whitespace-pre-wrap text-foreground">{v || "—"}</p>
    </div>
  );
}
