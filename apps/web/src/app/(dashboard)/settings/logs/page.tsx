"use client";

import { useEffect, useState } from "react";
import { TopNav } from "@/components/layout/top-nav";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SystemLogsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/system/logs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (e) {
        console.error("Failed to fetch system logs", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="System Logs"
        description="View fetch logs and worker status across all sources."
      />

      <div className="flex-1 p-6">
        <div className="rounded-md border border-border bg-surface shadow-subtle">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-text-muted">Loading logs...</TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-text-muted">No logs found.</TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      <a href={`/sources/${log.source_id}`} className="text-primary hover:underline">
                        src_{log.source_id}
                      </a>
                    </TableCell>
                    <TableCell className="text-text-muted">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.status === "error" ? "breaking" : log.status === "success" ? "info" : "warning"}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm truncate max-w-xs">
                      {log.error_message || "Success"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
