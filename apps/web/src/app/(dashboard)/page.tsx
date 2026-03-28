import { TopNav } from "@/components/layout/top-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Bell, FileCode2, History } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav
        title="Dashboard"
        description="Overview of your API specifications and recent changes."
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
              <FileCode2 className="h-4 w-4 text-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-text-muted">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recent Changes</CardTitle>
              <History className="h-4 w-4 text-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-text-muted">In the last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Breaking Alerts</CardTitle>
              <Bell className="h-4 w-4 text-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger">3</div>
              <p className="text-xs text-text-muted">Requires immediate attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">Healthy</div>
              <p className="text-xs text-text-muted">Last check 2 mins ago</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Changes</CardTitle>
              <CardDescription>
                Latest updates across all monitored sources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Stripe API (v2.1.0)</p>
                      <p className="text-xs text-text-muted">
                        Updated 2 hours ago
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {i % 3 === 0 ? (
                        <Badge variant="breaking">Breaking</Badge>
                      ) : i % 2 === 0 ? (
                        <Badge variant="modified">Modified</Badge>
                      ) : (
                        <Badge variant="added">Added</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Sources Status</CardTitle>
              <CardDescription>Current health of your configured sources.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted">
                      <FileCode2 className="h-4 w-4 text-text-muted" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium">Production API Docs</p>
                      <p className="truncate text-xs text-text-muted">Synced 5 mins ago</p>
                    </div>
                    <Badge variant="info">Synced</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
