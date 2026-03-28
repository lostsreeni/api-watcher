import { TopNav } from "@/components/layout/top-nav";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SourcesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="Sources"
        description="Manage your monitored API specifications and documentation."
        actions={
          <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Source
          </Button>
        }
      />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search sources..."
              className="w-full rounded-md border border-border bg-surface pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="rounded-md border border-border bg-surface shadow-subtle">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    <a href={`/sources/${i}`} className="hover:underline text-primary">
                      Acme Corp API {i}
                    </a>
                  </TableCell>
                  <TableCell>OpenAPI</TableCell>
                  <TableCell>
                    <Badge variant={i === 2 ? "warning" : "info"}>
                      {i === 2 ? "Syncing..." : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-muted">
                    {i * 10} mins ago
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" className="h-8 px-2 text-xs">
                      Edit
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
