import React, { useState } from "react";
import { Layout } from "../components/layout/Layout";
import { DashboardMetrics } from "../components/dashboard/DashboardMetrics";
import { MembershipPerformanceChart } from "../components/dashboard/MembershipPerformanceChart";
import { RecommendedActionsCard } from "../components/dashboard/RecommendedActionsCard";
import { PastDueMembersCard } from "../components/dashboard/PastDueMembersCard";
import { MissingContactsCard } from "../components/dashboard/MissingContactsCard";
import { RecentMemberActivity } from "../components/dashboard/RecentMemberActivity";
import { mockPharmacyMembers, mockApplications } from "../data/generateMockData";

export const Dashboard = (): JSX.Element => {
  const [currentStepperStep, setCurrentStepperStep] = useState(0)
  
  const sampleActions = [
    {
      id: "1",
      title: "You have 105 Members that have past due membership fees",
      description: "Create an email campaign and send a payment link to get them caught up on the membership dues.",
      status: "active" as const,
      primaryAction: "Create campaign",
      secondaryAction: "Skip"
    },
    {
      id: "2", 
      title: "Several customers are missing their contact information",
      description: "Reach out to customers via phone or alternative methods to request their updated contact details.",
      status: "upcoming" as const,
      primaryAction: "Update contacts",
      secondaryAction: "Skip"
    },
    {
      id: "3",
      title: "Renewal notices are due for 75 Members whose memberships are expiring soon", 
      description: "Prepare and send out renewal reminders to ensure timely renewals and maintain membership.",
      status: "upcoming" as const,
      primaryAction: "Send reminders",
      secondaryAction: "Skip"
    }
  ];

  const handlePrimaryAction = (actionId: string) => {
    console.log("Primary action for:", actionId);
  };

  const handleSecondaryAction = (actionId: string) => {
    console.log("Secondary action for:", actionId);
  };

  const handleStepChange = (step: number) => {
    setCurrentStepperStep(step);
  };

  return (
    <Layout 
      activeNav="Dashboard"
      searchData={{
        members: mockPharmacyMembers,
        applications: mockApplications
      }}
    >
      <div className="space-y-10">
        <div>
          <h1 className="text-2xl leading-8 font-normal text-gray-900">Welcome, Sahil</h1>
        </div>

        {/* Metric Cards */}
        <DashboardMetrics />

        {/* Membership Performance Chart */}
        <MembershipPerformanceChart />

        {/* Recommended Actions and Dynamic Chart Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecommendedActionsCard 
              actions={sampleActions}
              onPrimaryAction={handlePrimaryAction}
              onSecondaryAction={handleSecondaryAction}
              onStepChange={handleStepChange}
            />
          </div>
          <div className="lg:col-span-1">
            {currentStepperStep === 0 ? (
              <PastDueMembersCard />
            ) : (
              <MissingContactsCard />
            )}
          </div>
        </div>

        {/* Recent Member Activity */}
        <RecentMemberActivity />
      </div>
    </Layout>
  );
};