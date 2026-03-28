"use client";

import { useEffect, useState } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Bell, Settings, ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function SourceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [source, setSource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [changelogs, setChangelogs] = useState<any[]>([]);

  const [alertEmail, setAlertEmail] = useState("");
  const [alertSlack, setAlertSlack] = useState("");
  const [savingAlerts, setSavingAlerts] = useState(false);

  const fetchSource = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sources/${params.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setSource(data);
        setAlertEmail(data.alert_email || "");
        setAlertSlack(data.alert_slack_webhook || "");
      }
    } catch (e) {
      console.error("Failed to fetch source", e);
    }
  };

  const fetchChangelogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sources/${params.id}/changelogs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setChangelogs(data);
      }
    } catch (e) {
      console.error("Failed to fetch changelogs", e);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchSource();
      await fetchChangelogs();
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sources/${params.id}/fetch`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Poll for updates or just wait a bit and refresh
      setTimeout(() => {
        fetchSource();
        fetchChangelogs();
        setSyncing(false);
      }, 3000);
    } catch (e) {
      console.error(e);
      setSyncing(false);
    }
  };

  const handleSaveAlerts = async () => {
    setSavingAlerts(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sources/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            alert_email: alertEmail || null,
            alert_slack_webhook: alertSlack || null,
          }),
        }
      );
      await fetchSource();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingAlerts(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-text-muted">Loading source details...</div>;
  }

  if (!source) {
    return <div className="p-6 text-center text-text-muted">Source not found.</div>;
  }

  const latestChangelog = changelogs.length > 0 ? changelogs[0] : null;

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title={`Source Detail: ${source.name}`}
        description={source.url}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/sources">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button variant="secondary" onClick={handleSync} disabled={syncing}>
              {syncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {syncing ? "Syncing..." : "Sync Now"}
            </Button>
            <Button variant="primary">Edit Settings</Button>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="snapshots">Snapshots</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="raw">Raw Source</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Type</CardTitle>
                  <Settings className="h-4 w-4 text-text-muted" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold uppercase">{source.type}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Bell className="h-4 w-4 text-text-muted" />
                </CardHeader>
                <CardContent>
                  <Badge
                    variant={
                      source.status === "paused"
                        ? "warning"
                        : source.status === "error"
                        ? "breaking"
                        : source.status === "syncing"
                        ? "info"
                        : "info"
                    }
                  >
                    {source.status}
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Last Checked</CardTitle>
                  <History className="h-4 w-4 text-text-muted" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium">
                    {source.last_checked_at ? new Date(source.last_checked_at).toLocaleString() : "Never"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Changes</CardTitle>
                  <History className="h-4 w-4 text-text-muted" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{changelogs.length}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Latest Diff Summary</CardTitle>
                <CardDescription>
                  Changes detected in the last sync.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {latestChangelog ? (
                  <div>
                    <div className="mb-4">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <Badge variant={latestChangelog.severity as any}>
                        {latestChangelog.severity}
                      </Badge>
                      <span className="text-xs text-text-muted ml-2">
                        {new Date(latestChangelog.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {latestChangelog.changelog_summary ? (
                        <pre className="whitespace-pre-wrap font-sans text-sm">
                          {latestChangelog.changelog_summary}
                        </pre>
                      ) : (
                        <p className="text-text-muted">No summary available.</p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <Link href={`/changelogs/${latestChangelog.id}`}>
                        <Button variant="secondary">View Full Detail</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">No changelogs recorded yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="snapshots">
            <Card>
              <CardHeader>
                <CardTitle>Snapshot & Change History</CardTitle>
                <CardDescription>
                  All recorded changes for this source.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {changelogs.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                      <div>
                        <div className="font-medium">Change #{log.id}</div>
                        <div className="text-xs text-text-muted">{new Date(log.created_at).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <Badge variant={log.severity as any}>{log.severity}</Badge>
                        <Link href={`/changelogs/${log.id}`}>
                          <Button variant="ghost">View</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {changelogs.length > 5 && (
                    <div className="pt-2">
                      <Link
                        href={`/sources/${params.id}/history`}
                        className="text-sm text-primary hover:underline"
                      >
                        View full history timeline →
                      </Link>
                    </div>
                  )}
                  {changelogs.length === 0 && (
                    <p className="text-sm text-text-muted">No history available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Alert Configurations</CardTitle>
                <CardDescription>
                  Set up notifications for when changes are detected in this source.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Alert</label>
                  <Input
                    type="email"
                    placeholder="alert@example.com"
                    value={alertEmail}
                    onChange={e => setAlertEmail(e.target.value)}
                  />
                  <p className="text-xs text-text-muted">Sends an email when a change is detected.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Slack Webhook URL</label>
                  <Input
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={alertSlack}
                    onChange={e => setAlertSlack(e.target.value)}
                  />
                  <p className="text-xs text-text-muted">Posts a message to a Slack channel when a change is detected.</p>
                </div>

                <Button onClick={handleSaveAlerts} disabled={savingAlerts}>
                  {savingAlerts ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Alerts
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
