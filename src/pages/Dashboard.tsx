import React from "react";
import { Layout } from "../components/layout/Layout";
import { DashboardMetrics } from "../components/dashboard/DashboardMetrics";
import { MembershipPerformanceChart } from "../components/dashboard/MembershipPerformanceChart";

export const Dashboard = (): JSX.Element => {
  return (
    <Layout activeNav="Dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl leading-8 font-normal text-gray-900">Dashboard</h1>
        </div>

        {/* Metric Cards */}
        <DashboardMetrics />

        {/* Membership Performance Chart */}
        <MembershipPerformanceChart />

        {/* Additional dashboard content */}
        <div className="space-y-4 mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          {/* Add some demo content to demonstrate scrolling */}
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Activity {i + 1}</h3>
              <p className="text-gray-600 mt-2">
                This is demo content showing recent activity in your organization.
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};