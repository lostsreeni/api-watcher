"use client";

import { useEffect, useState } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChangelogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [changelog, setChangelog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/changelogs/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setChangelog(data);
        }
      } catch (e) {
        console.error("Failed to fetch changelog", e);
      } finally {
        setLoading(false);
      }
    };
    fetchChangelog();
  }, [params.id]);

  if (loading) {
    return <div className="p-6 text-center text-text-muted">Loading changelog...</div>;
  }

  if (!changelog) {
    return <div className="p-6 text-center text-text-muted">Changelog not found.</div>;
  }

  let changesList = [];
  try {
    changesList = JSON.parse(changelog.changes);
  } catch (e) {
    console.error("Failed to parse changes JSON");
  }

  const groupedChanges = changesList.reduce((acc: any, change: any) => {
    const s = change.severity || "informational";
    if (!acc[s]) acc[s] = [];
    acc[s].push(change);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title={`Changelog Details`}
        description={`cl_${changelog.id}`}
        actions={
          <Link href={`/sources/${changelog.source_id}`}>
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Source
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Badge variant={changelog.severity as any} className="text-lg py-1 px-3">
            {changelog.severity.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Clock className="h-4 w-4" />
            {new Date(changelog.created_at).toLocaleString()}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert">
                {changelog.changelog_summary ? (
                  <pre className="whitespace-pre-wrap font-sans text-sm">{changelog.changelog_summary}</pre>
                ) : (
                  <p className="text-text-muted">No summary available.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grouped Changes</CardTitle>
              <CardDescription>Detailed breakdown of what changed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.keys(groupedChanges).length === 0 && (
                <p className="text-sm text-text-muted">No detailed changes available.</p>
              )}

              {["breaking", "added", "modified", "informational"].map((severityType) => {
                if (!groupedChanges[severityType] || groupedChanges[severityType].length === 0) return null;

                return (
                  <div key={severityType}>
                    <h4 className="text-sm font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Badge variant={severityType as any}>{severityType}</Badge>
                    </h4>
                    <ul className="space-y-2">
                      {groupedChanges[severityType].map((change: any, i: number) => (
                        <li key={i} className="text-sm border-l-2 border-border pl-3 ml-1 py-1">
                          <span className="font-mono text-xs text-primary bg-surface py-0.5 px-1 rounded mr-2">
                            {change.type}
                          </span>
                          <span className="text-text">{change.details}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
