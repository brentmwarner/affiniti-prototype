import {
  BellIcon,
  ChartNoAxesColumnIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LayoutPanelLeftIcon,
  MegaphoneIcon,
  PanelLeftCloseIcon,
  PlusIcon,
  RefreshCwIcon,
  SendIcon,
  UsersIcon,
} from "lucide-react";
import { useState, cloneElement, ReactNode, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { GlobalSearch, GlobalSearchRef } from "../ui/global-search";
import { AddMemberDialog } from "../members/AddMemberDialog";

interface LayoutProps {
  children: ReactNode;
  activeNav?: string;
  searchData?: {
    members?: any[];
    applications?: any[];
    renewals?: any[];
  };
}

export const Layout = ({ children, activeNav = "Dashboard", searchData }: LayoutProps): JSX.Element => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const navigate = useNavigate();
  const globalSearchRef = useRef<GlobalSearchRef>(null);

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        globalSearchRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation menu items data
  const navItems = [
    {
      icon: <ChartNoAxesColumnIcon className="w-4 h-4" />,
      label: "Dashboard",
      active: activeNav === "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <UsersIcon className="w-4 h-4" />,
      label: "Members",
      active: activeNav === "Members",
      path: "/members",
    },
    {
      icon: <RefreshCwIcon className="w-4 h-4" />,
      label: "Renewals",
      active: activeNav === "Renewals",
      path: "/renewals",
    },
    {
      icon: <CreditCardIcon className="w-4 h-4" />,
      label: "Billing",
      active: activeNav === "Billing",
      path: "/billing",
    },
    {
      icon: <MegaphoneIcon className="w-4 h-4" />,
      label: "Marketing",
      active: activeNav === "Marketing",
      path: "/marketing",
    },
  ];

  return (
    <div className="flex h-screen pt-4 pb-4 pr-4 relative bg-gray-50 w-full">
      {/* Sidebar */}
      <div className={`flex flex-col items-start relative h-full bg-gray-50 rounded-l-xl overflow-hidden transition-all duration-300 ease-in-out transform ${
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
            <div className={`flex flex-col items-start gap-0.5 relative flex-1 grow transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            }`}>
              <div className="relative self-stretch mt-[-1.00px] font-text-sm-leading-none-semibold font-[number:var(--text-sm-leading-none-semibold-font-weight)] text-zinc-700 text-[length:var(--text-sm-leading-none-semibold-font-size)] tracking-[var(--text-sm-leading-none-semibold-letter-spacing)] leading-[var(--text-sm-leading-none-semibold-line-height)] [font-style:var(--text-sm-leading-none-semibold-font-style)] whitespace-nowrap">
                NCPA
              </div>
            </div>
            <ChevronsUpDownIcon className={`w-4 h-4 transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-4'
            }`} />
          </div>
        </header>


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
                    className={`flex items-center gap-2 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] rounded overflow-hidden cursor-pointer hover:bg-gray-100 ${
                      item.active ? "bg-gray-200/50" : ""
                    } ${isSidebarCollapsed ? 'justify-center min-w-0' : 'min-w-32'}`}
                    onClick={() => navigate(item.path)}
                  >
                    {cloneElement(item.icon, { 
                      className: `w-4 h-4 transition-colors duration-200 ${item.active ? 'text-indigo-500' : 'text-gray-500'}` 
                    })}
                    <div
                      className={`relative flex-1 mt-[-1.00px] font-text-sm-leading-5-normal font-[number:var(--text-sm-leading-5-normal-font-weight)] text-[length:var(--text-sm-leading-5-normal-font-size)] tracking-[var(--text-sm-leading-5-normal-letter-spacing)] leading-[var(--text-sm-leading-5-normal-line-height)] [font-style:var(--text-sm-leading-5-normal-font-style)] whitespace-nowrap transition-all duration-300 ease-in-out ${
                        item.active ? "text-gray-800" : "text-gray-500"
                      } ${
                        isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                      }`}
                    >
                      {item.label}
                    </div>
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
                SP
              </AvatarFallback>
            </Avatar>
            <div className={`flex flex-col items-start gap-0.5 relative flex-1 grow transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            }`}>
              <div className="relative self-stretch mt-[-1.00px] font-text-sm-leading-none-semibold font-[number:var(--text-sm-leading-none-semibold-font-weight)] text-zinc-700 text-[length:var(--text-sm-leading-none-semibold-font-size)] tracking-[var(--text-sm-leading-none-semibold-letter-spacing)] leading-[var(--text-sm-leading-none-semibold-line-height)] [font-style:var(--text-sm-leading-none-semibold-font-style)] whitespace-nowrap">
                Sahil Padnis
              </div>
              <div className="relative self-stretch font-text-xs-leading-4-normal font-[number:var(--text-xs-leading-4-normal-font-weight)] text-zinc-700 text-[length:var(--text-xs-leading-4-normal-font-size)] tracking-[var(--text-xs-leading-4-normal-letter-spacing)] leading-[var(--text-xs-leading-4-normal-line-height)] [font-style:var(--text-xs-leading-4-normal-font-style)] whitespace-nowrap">
                email@example.com
              </div>
            </div>
            <ChevronsUpDownIcon className={`w-4 h-4 transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-4'
            }`} />
          </div>
        </footer>
      </div>

      {/* Main content */}
      <Card className="flex flex-col relative flex-1 h-full rounded-r-xl overflow-hidden bg-white border-0" style={{ boxShadow: '0 0 2px 0 #afb2ce8f, 0 1px 4px 0 #0404341a' }}>
        {/* Top navigation bar */}
        <div className="flex items-center justify-between p-2 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-gray-100 bg-white/45 backdrop-blur-sm sticky top-0 z-10">
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
            <GlobalSearch 
              ref={globalSearchRef}
              data={searchData}
              onNavigate={navigate}
              className="w-full"
            />
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
              className="inline-flex min-w-16 h-8 items-center justify-center px-2 py-1.5 bg-indigo-500 hover:bg-indigo-700 rounded-md"
              onClick={() => {
                console.log("Add Member button clicked");
                setIsAddMemberOpen(true);
              }}
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
        <CardContent className="relative flex-1 w-full grow overflow-y-auto p-7">
          {children}
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <AddMemberDialog 
        open={isAddMemberOpen} 
        onOpenChange={(open) => {
          console.log("Dialog open state changed:", open);
          setIsAddMemberOpen(open);
        }}
        onAddMember={(member) => {
          console.log("New member added:", member);
          // In a real app, this would call an API to add the member
          // and potentially refresh the members list
        }}
      />
    </div>
  );
};