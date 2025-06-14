import React from "react";
import { MetricCard } from "./MetricCard";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Members"
        value={205592}
        trend={{ value: 2, direction: "down" }}
        description="Trending down since last month"
        icon={Users}
      />
      <MetricCard
        title="Active Revenue"
        value="$14,205,592.18"
        trend={{ value: 10.2, direction: "up" }}
        description="Since last 30 days"
        icon={DollarSign}
      />
      <MetricCard
        title="Avg Member Value"
        value="$752.00"
        trend={{ value: 5.1, direction: "up" }}
        description="Currently active"
        icon={Activity}
      />
      <MetricCard
        title="Retention Rate"
        value="87.9%"
        trend={{ value: 0.8, direction: "up" }}
        description="From last month"
        icon={TrendingUp}
      />
    </div>
  );
}