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
import { History, Bell, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SourceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title={`Source Detail: Acme Corp API ${params.id}`}
        description="View details, recent snapshots, and alert configurations."
        actions={
          <div className="flex items-center gap-2">
            <Link href="/sources">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button variant="secondary">Sync Now</Button>
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
                  <div className="text-xl font-bold">OpenAPI 3.0</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Bell className="h-4 w-4 text-text-muted" />
                </CardHeader>
                <CardContent>
                  <Badge variant="info">Healthy</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Last Sync
                  </CardTitle>
                  <History className="h-4 w-4 text-text-muted" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">12 mins ago</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Snapshots
                  </CardTitle>
                  <History className="h-4 w-4 text-text-muted" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">42</div>
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
                <div className="flex items-center gap-4 border-b border-border pb-4">
                  <div className="flex-1">
                    <p className="text-sm font-mono">/users/profile</p>
                    <p className="text-xs text-text-muted">
                      Response schema updated.
                    </p>
                  </div>
                  <Badge variant="modified">Modified</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-mono">/legacy/billing</p>
                    <p className="text-xs text-text-muted">
                      Endpoint deprecated.
                    </p>
                  </div>
                  <Badge variant="breaking">Removed</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="snapshots">
            <Card>
              <CardHeader>
                <CardTitle>Snapshot History</CardTitle>
                <CardDescription>
                  All recorded versions of this source.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-text-muted">
                  <Link
                    href={`/sources/${params.id}/history`}
                    className="text-primary hover:underline"
                  >
                    View full history timeline
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
