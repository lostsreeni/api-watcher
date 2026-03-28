"use client";

import { useEffect, useState } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2, Pause, Play, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SourceForm } from "@/components/sources/source-form";
import { Input } from "@/components/ui/input";

interface Source {
  id: number;
  name: string;
  url: string;
  type: string;
  status: string;
  last_checked_at: string | null;
}

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editType, setEditType] = useState("openapi");

  const fetchSources = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sources/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSources(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sources/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchSources();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "paused" ? "active" : "paused";
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sources/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchSources();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditClick = (source: Source) => {
    setEditingSourceId(source.id);
    setEditName(source.name);
    setEditUrl(source.url);
    setEditType(source.type);
  };

  const handleEditSave = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sources/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName, url: editUrl, type: editType })
      });
      setEditingSourceId(null);
      fetchSources();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="Sources"
        description="Manage your monitored API specifications and documentation."
        actions={
          <Button variant="primary" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Source
          </Button>
        }
      />

      <div className="p-6">
        {isAdding && (
          <div className="mb-6 max-w-lg">
            <SourceForm onSuccess={() => { setIsAdding(false); fetchSources(); }} onCancel={() => setIsAdding(false)} />
          </div>
        )}

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
                <TableHead>URL / Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-text-muted">Loading...</TableCell>
                </TableRow>
              ) : sources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-text-muted">No sources found. Add one to get started.</TableCell>
                </TableRow>
              ) : (
                sources.map((source) => (
                  <TableRow key={source.id}>
                    {editingSourceId === source.id ? (
                      <>
                        <TableCell>
                          <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                             <Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} className="h-8 text-xs" />
                             <select
                                value={editType}
                                onChange={(e) => setEditType(e.target.value)}
                                className="flex h-8 w-full rounded-md border border-border bg-background px-3 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="openapi">OpenAPI</option>
                                <option value="docs">Docs</option>
                                <option value="sdk">SDK</option>
                              </select>
                          </div>
                        </TableCell>
                        <TableCell>
                           <Badge variant={source.status === "paused" ? "warning" : source.status === "error" ? "danger" : "info"}>
                             {source.status}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-text-muted">
                           {source.last_checked_at ? new Date(source.last_checked_at).toLocaleString() : "Never"}
                        </TableCell>
                        <TableCell className="text-right flex gap-2 justify-end">
                           <Button size="sm" onClick={() => handleEditSave(source.id)}>Save</Button>
                           <Button size="sm" variant="ghost" onClick={() => setEditingSourceId(null)}>Cancel</Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">
                          <a href={`/sources/${source.id}`} className="hover:underline text-primary">
                            {source.name}
                          </a>
                        </TableCell>
                        <TableCell>
                           <div className="text-xs text-text-muted max-w-[200px] truncate" title={source.url}>{source.url}</div>
                           <div className="capitalize text-xs font-medium">{source.type}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={source.status === "paused" ? "warning" : source.status === "error" ? "danger" : "info"}>
                            {source.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-text-muted">
                          {source.last_checked_at ? new Date(source.last_checked_at).toLocaleString() : "Never"}
                        </TableCell>
                        <TableCell className="text-right flex gap-2 justify-end">
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleToggleStatus(source.id, source.status)}>
                            {source.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEditClick(source)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10" onClick={() => handleDelete(source.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </>
                    )}
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
