import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Settings — Ted's Lab" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, loading } = useAuth();
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <header className="bio-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Account</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground">User settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update your profile details and manage the account you use to study.
        </p>
      </header>

      <section className="bio-panel space-y-6 p-6">
        <div className="space-y-1">
          <Label htmlFor="display-name">Display name</Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </div>

        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          This is the current account settings view. You can extend it later with password changes, notifications, or profile preferences.
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button">Save changes</Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
