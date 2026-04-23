import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PerpexLogo } from "@/components/PerpexLogo";
import { setAdminSession } from "@/lib/storage";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — PerpeX" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (u === "admin" && p === "admin123") {
      setAdminSession(true);
      navigate({ to: "/admin/dashboard" });
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--gradient-soft)] px-6">
      <Toaster richColors position="top-center" />
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
        <div className="mb-6 flex justify-center">
          <PerpexLogo />
        </div>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to view submissions</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Username</Label>
            <Input value={u} onChange={(e) => setU(e.target.value)} autoFocus />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Password</Label>
            <Input type="password" value={p} onChange={(e) => setP(e.target.value)} />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full">Sign In</Button>
        </form>
      </div>
    </div>
  );
}
