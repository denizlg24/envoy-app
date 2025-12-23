"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export const ApiStatusComponent = () => {
  const [status, setStatus] = useState<boolean | undefined>(undefined);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        setStatus(undefined);
        const res = await fetch("/api/health");
        if (res.ok) {
          const { status } = await res.json();
          setStatus(status == "ok" ? true : false);
        } else {
          setStatus(false);
        }
      } catch {
        setStatus(false);
      } finally {
        setResponseTime(Date.now() - startTime);
        setLastChecked(new Date());
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000)

    return () => clearInterval(interval)
  }, []);

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-card/10 p-6 backdrop-blur-xs">
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/10 blur-2xl"></div>

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-mono text-sm font-medium text-muted-foreground">
            API Status
          </h3>
          {status ? (
            <Badge className="gap-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Operational
            </Badge>
          ) : status === undefined ? (
            <Badge variant="secondary" className="gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 animate-pulse rounded-full bg-muted-foreground"></span>
              </span>
              Checking...
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
              </span>
              Failing...
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Uptime</span>
            <span className="font-mono text-xl font-bold text-foreground">
              99.9%
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Response Time</span>
            <span className="font-mono text-xl font-bold text-primary">
              {responseTime ? `${responseTime}ms` : "—"}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              Last Checked
            </span>
            <span className="font-mono text-xl font-bold text-foreground">
              {lastChecked ? lastChecked.toLocaleTimeString() : "—"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
