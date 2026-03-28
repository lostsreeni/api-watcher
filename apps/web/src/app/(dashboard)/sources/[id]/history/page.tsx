"use client";

import { useEffect, useState } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SourceHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [changelogs, setChangelogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };
    fetchChangelogs();
  }, [params.id]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="Snapshot History"
        description="View the timeline of changes for this source."
        actions={
          <Link href={`/sources/${params.id}`}>
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Source
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-6">
        <div className="rounded-md border border-border bg-surface shadow-subtle">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Changelog ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Changes Detected</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-text-muted">Loading history...</TableCell>
                </TableRow>
              ) : changelogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-text-muted">No history found.</TableCell>
                </TableRow>
              ) : (
                changelogs.map((log) => {
                  let parsedChanges = [];
                  try {
                    parsedChanges = JSON.parse(log.changes);
                  } catch (err) {
                    console.error(err);
                  }

                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm text-primary hover:underline cursor-pointer">
                        <Link href={`/changelogs/${log.id}`}>
                          cl_{log.id}
                        </Link>
                      </TableCell>
                      <TableCell className="flex items-center gap-2 text-text-muted">
                        <Clock className="h-3 w-3" />
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>{parsedChanges.length} change(s)</TableCell>
                      <TableCell>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <Badge variant={log.severity as any}>{log.severity}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/changelogs/${log.id}`}>
                          <Button variant="ghost" className="h-8 px-2 text-xs">
                            View Detail
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
