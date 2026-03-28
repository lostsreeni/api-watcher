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
                <TableHead>Snapshot ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Changes Detected</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-sm text-primary hover:underline cursor-pointer">
                    snap_{Math.random().toString(36).substring(7)}
                  </TableCell>
                  <TableCell className="flex items-center gap-2 text-text-muted">
                    <Clock className="h-3 w-3" />
                    {new Date(Date.now() - i * 10000000).toLocaleString()}
                  </TableCell>
                  <TableCell>{i * 2} endpoints affected</TableCell>
                  <TableCell>
                    {i === 1 ? (
                      <Badge variant="breaking">Breaking</Badge>
                    ) : i % 2 === 0 ? (
                      <Badge variant="modified">Modified</Badge>
                    ) : (
                      <Badge variant="info">No changes</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" className="h-8 px-2 text-xs">
                      View Diff
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
