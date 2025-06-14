import React from "react";
import { Layout } from "../components/layout/Layout";
import { DashboardMetrics } from "../components/dashboard/DashboardMetrics";
import { MembershipPerformanceChart } from "../components/dashboard/MembershipPerformanceChart";
import { RecentApplicationsCard } from "../components/dashboard/RecentApplicationsCard";
import { TopMemberLocationsCard } from "../components/dashboard/TopMemberLocationsCard";
import { mockPharmacyMembers, mockApplications } from "../data/generateMockData";

export const Dashboard = (): JSX.Element => {
  return (
    <Layout 
      activeNav="Dashboard"
      searchData={{
        members: mockPharmacyMembers,
        applications: mockApplications
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl leading-8 font-normal text-gray-900">Welcome, Sahil</h1>
        </div>

        {/* Metric Cards */}
        <DashboardMetrics />

        {/* Membership Performance Chart */}
        <MembershipPerformanceChart />

        {/* Recent Applications and Top Member Locations Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentApplicationsCard />
          <TopMemberLocationsCard />
        </div>
      </div>
    </Layout>
  );
};