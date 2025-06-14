import {
  BarChart3Icon,
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  LayoutPanelLeftIcon,
  PanelLeftCloseIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  SendIcon,
  UsersIcon,
} from "lucide-react";
import React, { useState, cloneElement } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { DashboardMetrics } from "../../components/dashboard/DashboardMetrics";
import { MembershipPerformanceChart } from "../../components/dashboard/MembershipPerformanceChart";
import { RecentApplicationsCard } from "../../components/dashboard/RecentApplicationsCard";
import { TopMemberLocationsCard } from "../../components/dashboard/TopMemberLocationsCard";

export const Dashboard = (): JSX.Element => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Navigation menu items data
  const navItems = [
    {
      icon: <LayoutDashboardIcon className="w-4 h-4" />,
      label: "Dashboard",
      active: true,
    },
    {
      icon: <UsersIcon className="w-4 h-4" />,
      label: "Members",
      active: false,
    },
    {
      icon: <RefreshCwIcon className="w-4 h-4" />,
      label: "Renewals",
      active: false,
    },
    {
      icon: <CreditCardIcon className="w-4 h-4" />,
      label: "Billing",
      active: false,
    },
    {
      icon: <BarChart3Icon className="w-4 h-4" />,
      label: "Marketing",
      active: false,
    },
  ];

  return (
    <div className="flex h-screen p-4 relative bg-gray-50 w-full">
      {/* Sidebar */}
      <div className={`flex flex-col items-start relative h-full bg-gray-50 rounded-l-xl overflow-hidden transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-[216px]'
      }`}>
        {/* Header with logo */}
        <header className="flex flex-col items-start p-2 relative self-stretch w-full flex-[0_0_auto] bg-transparent">
          <div 
            className={`flex items-center gap-2 p-2 relative self-stretch w-full flex-[0_0_auto] rounded-md overflow-hidden hover:bg-gray-200/50 transition-all duration-200 hover:shadow-sm cursor-pointer ${
            isSidebarCollapsed ? 'justify-center' : ''
          }`}
            onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
          >
            <img className="relative w-8 h-8" alt="Icon" src="/icon.svg" />
            {!isSidebarCollapsed && (
              <div className="flex flex-col items-start gap-0.5 relative flex-1 grow">
              <div className="relative self-stretch mt-[-1.00px] font-text-sm-leading-none-semibold font-[number:var(--text-sm-leading-none-semibold-font-weight)] text-zinc-700 text-[length:var(--text-sm-leading-none-semibold-font-size)] tracking-[var(--text-sm-leading-none-semibold-letter-spacing)] leading-[var(--text-sm-leading-none-semibold-line-height)] [font-style:var(--text-sm-leading-none-semibold-font-style)]">
                NCPA
              </div>
              </div>
            )}
            {!isSidebarCollapsed && <ChevronsUpDownIcon className="w-4 h-4" />}
          </div>
        </header>

        {/* Command search */}
        {!isSidebarCollapsed && (
          <div className="flex flex-col items-start gap-2 p-2 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex h-8 items-center px-3 py-2.5 relative self-stretch w-full bg-[#f3f4f6bf] rounded-md overflow-hidden border border-solid">
            <div className="relative flex-1 h-5 mt-[-5.00px] mb-[-3.00px] opacity-50 font-text-sm-leading-5-normal font-[number:var(--text-sm-leading-5-normal-font-weight)] text-zinc-950 text-[length:var(--text-sm-leading-5-normal-font-size)] tracking-[var(--text-sm-leading-5-normal-letter-spacing)] leading-[var(--text-sm-leading-5-normal-line-height)] whitespace-nowrap overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] [font-style:var(--text-sm-leading-5-normal-font-style)]">
              Commands
            </div>
            <div className="flex w-4 h-4 items-center justify-center gap-2 px-px py-[3px] relative mt-[-2.00px] mb-[-2.00px] bg-[#e5e7eb8c] rounded">
              <div className="relative w-fit mt-[-1.50px] mb-[-0.50px] [font-family:'Inter',Helvetica] font-medium text-gray-400 text-[10px] tracking-[1.00px] leading-3 whitespace-nowrap">
                /
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Navigation menu */}
        <nav className="flex flex-col items-start gap-2 relative flex-1 self-stretch w-full grow overflow-y-auto">
          <div className="flex flex-col items-start p-2 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <div
                    className={`flex items-center gap-2 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] rounded overflow-hidden ${
                      item.active ? "bg-gray-200/50" : ""
                    } ${isSidebarCollapsed ? 'justify-center min-w-0' : 'min-w-32'}`}
                  >
                    {cloneElement(item.icon, { 
                      className: `w-4 h-4 ${item.active ? 'text-indigo-500' : 'text-gray-500'}` 
                    })}
                    {!isSidebarCollapsed && (
                      <div
                      className={`relative flex-1 mt-[-1.00px] font-text-sm-leading-5-normal font-[number:var(--text-sm-leading-5-normal-font-weight)] text-[length:var(--text-sm-leading-5-normal-font-size)] tracking-[var(--text-sm-leading-5-normal-letter-spacing)] leading-[var(--text-sm-leading-5-normal-line-height)] [font-style:var(--text-sm-leading-5-normal-font-style)] ${
                        item.active ? "text-gray-800" : "text-gray-500"
                      }`}
                    >
                      {item.label}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* User profile footer */}
        <footer className="flex flex-col items-start gap-2.5 p-2 relative self-stretch w-full flex-[0_0_auto] bg-transparent">
          <div 
            className={`flex items-center gap-2 p-2 relative self-stretch w-full flex-[0_0_auto] rounded-md overflow-hidden hover:bg-gray-200/50 transition-all duration-200 hover:shadow-sm cursor-pointer ${
            isSidebarCollapsed ? 'justify-center' : ''
          }`}
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          >
            <Avatar className="w-8 h-8 bg-zinc-100">
              <AvatarFallback className="text-zinc-500 text-sm">
                UN
              </AvatarFallback>
            </Avatar>
            {!isSidebarCollapsed && (
              <div className="flex flex-col items-start gap-0.5 relative flex-1 grow">
              <div className="relative self-stretch mt-[-1.00px] font-text-sm-leading-none-semibold font-[number:var(--text-sm-leading-none-semibold-font-weight)] text-zinc-700 text-[length:var(--text-sm-leading-none-semibold-font-size)] tracking-[var(--text-sm-leading-none-semibold-letter-spacing)] leading-[var(--text-sm-leading-none-semibold-line-height)] [font-style:var(--text-sm-leading-none-semibold-font-style)]">
                User
              </div>
              <div className="relative self-stretch font-text-xs-leading-4-normal font-[number:var(--text-xs-leading-4-normal-font-weight)] text-zinc-700 text-[length:var(--text-xs-leading-4-normal-font-size)] tracking-[var(--text-xs-leading-4-normal-letter-spacing)] leading-[var(--text-xs-leading-4-normal-line-height)] [font-style:var(--text-xs-leading-4-normal-font-style)]">
                m@example.com
              </div>
              </div>
            )}
            {!isSidebarCollapsed && <ChevronsUpDownIcon className="w-4 h-4" />}
          </div>
        </footer>
      </div>

      {/* Main content */}
      <Card className="flex flex-col relative flex-1 h-full rounded-r-xl overflow-hidden bg-white border-0" style={{ boxShadow: '0 0 2px 0 #afb2ce8f, 0 1px 4px 0 #0404341a' }}>
        {/* Top navigation bar */}
        <div className="flex items-center justify-between p-3 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-gray-100 bg-white/45 backdrop-blur-sm sticky top-0 z-10">
          {/* Panel toggle */}
          <div className="inline-flex items-center gap-2 pl-0 pr-3 py-1 relative flex-[0_0_auto] border-r [border-right-style:solid] border-gray-100">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-md"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? (
                <LayoutPanelLeftIcon className="w-4 h-4" />
              ) : (
                <PanelLeftCloseIcon className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Search bar */}
          <div className="flex flex-col w-[841px] items-start gap-2 px-14 py-0 relative">
            <div className="flex h-8 items-center px-3 py-2.5 relative self-stretch w-full bg-white rounded-md overflow-hidden border border-solid">
              <div className="inline-flex items-center pl-0 pr-2 py-0 relative flex-[0_0_auto] mt-[-2.00px] mb-[-2.00px]">
                <SearchIcon className="w-4 h-4" />
              </div>
              <div className="relative flex-1 h-5 mt-[-5.00px] mb-[-3.00px] opacity-50 font-text-sm-leading-5-normal font-[number:var(--text-sm-leading-5-normal-font-weight)] text-zinc-950 text-[length:var(--text-sm-leading-5-normal-font-size)] tracking-[var(--text-sm-leading-5-normal-letter-spacing)] leading-[var(--text-sm-leading-5-normal-line-height)] whitespace-nowrap overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] [font-style:var(--text-sm-leading-5-normal-font-style)]">
                Search
              </div>
              <div className="flex w-5 items-center justify-center gap-2 px-0.5 py-[3px] relative mt-[-3.00px] mb-[-3.00px] bg-[#e5e7eb8c] rounded">
                <div className="relative w-[18px] mt-[-0.50px] ml-[-1.00px] mr-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-gray-400 text-[10px] tracking-[1.00px] leading-3">
                  ⌘K
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
            {/* Notification bell */}
            <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-md"
              >
                <BellIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Send Invoice button */}
            <Button
              variant="secondary"
              size="sm"
              className="inline-flex min-w-16 h-8 items-center justify-center px-2 py-1.5 bg-gray-100 rounded-md"
            >
              <SendIcon className="w-4 h-4" />
              <span className="inline-flex items-start px-1 py-0 relative flex-[0_0_auto] mt-[-2.00px] mb-[-2.00px]">
                <span className="relative w-fit mt-[-1.00px] font-text-sm-leading-6-normal font-[number:var(--text-sm-leading-6-normal-font-weight)] text-zinc-900 text-[length:var(--text-sm-leading-6-normal-font-size)] tracking-[var(--text-sm-leading-6-normal-letter-spacing)] leading-[var(--text-sm-leading-6-normal-line-height)] whitespace-nowrap [font-style:var(--text-sm-leading-6-normal-font-style)]">
                  Send Invoice
                </span>
              </span>
            </Button>

            {/* Add Member button */}
            <Button
              size="sm"
              className="inline-flex min-w-16 h-8 items-center justify-center px-2 py-1.5 bg-indigo-500 rounded-md"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="inline-flex items-start px-1 py-0 relative flex-[0_0_auto] mt-[-2.00px] mb-[-2.00px]">
                <span className="relative w-fit mt-[-1.00px] font-text-sm-leading-6-normal font-[number:var(--text-sm-leading-6-normal-font-weight)] text-neutral-50 text-[length:var(--text-sm-leading-6-normal-font-size)] tracking-[var(--text-sm-leading-6-normal-letter-spacing)] leading-[var(--text-sm-leading-6-normal-line-height)] whitespace-nowrap [font-style:var(--text-sm-leading-6-normal-font-style)]">
                  Add Member
                </span>
              </span>
            </Button>
          </div>
        </div>

        {/* Main content area */}
        <CardContent className="relative flex-1 w-full grow overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl leading-8 font-normal text-gray-900">Welcome, Sahil</h1>
            </div>

            {/* Metric Cards */}
            <DashboardMetrics />

             {/* Membership Performance Chart */}
             <MembershipPerformanceChart/>

            {/* Recent Applications and Top Member Locations Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentApplicationsCard />
              <TopMemberLocationsCard />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
