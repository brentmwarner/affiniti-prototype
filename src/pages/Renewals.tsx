import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { Checkbox } from "../components/ui/checkbox";
import { SearchIcon, MoreVerticalIcon, EyeIcon, EditIcon, CircleCheck, CircleX, Loader, ChevronDown, Download, Trash2, Bell, PaintRoller } from "lucide-react";

import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { MemberWithRenewalStatus, RenewalStatus } from "../types/member";
import { mockMembersWithRenewalStatus, mockPharmacyMembers, mockApplications } from "../data/generateMockData";
import { MetricCard } from "../components/dashboard/MetricCard";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import { useToast } from "../components/ui/toast";

const getRenewalStatusColor = (status: RenewalStatus) => {
  switch (status) {
    case 'past_due':
      return 'bg-white border border-red-200 text-red-700';
    case 'due_soon':
      return 'bg-white border border-orange-200 text-orange-700';
    case 'upcoming':
      return 'bg-white border border-blue-200 text-blue-700';
    case 'renewed':
      return 'bg-white border border-green-200 text-green-700';
    default:
      return 'bg-white border border-gray-100 text-gray-800';
  }
};

const getRenewalStatusIcon = (status: RenewalStatus) => {
  switch (status) {
    case 'past_due':
      return <CircleX className="w-3 h-3 mr-2 text-red-700" />;
    case 'due_soon':
      return <Loader className="w-3 h-3 mr-2 text-orange-700" />;
    case 'upcoming':
      return <TrendingUp className="w-3 h-3 mr-2 text-blue-700" />;
    case 'renewed':
      return <CircleCheck className="w-3 h-3 mr-2 text-green-700" />;
    default:
      return <Loader className="w-3 h-3 mr-2 text-gray-800" />;
  }
};

const formatRenewalStatus = (status: RenewalStatus) => {
  switch (status) {
    case 'past_due':
      return 'Past Due';
    case 'due_soon':
      return 'Due Soon';
    case 'upcoming':
      return 'Upcoming';
    case 'renewed':
      return 'Renewed';
    default:
      return status;
  }
};

export const Renewals = (): JSX.Element => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedMember, setSelectedMember] = useState<MemberWithRenewalStatus | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "renewalStatus", value: "past_due" } // Default to showing past due
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { showToast } = useToast();

  const columns: ColumnDef<MemberWithRenewalStatus>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "membershipId",
      header: "Member ID",
      cell: ({ row }) => (
        <div className="font-medium whitespace-nowrap">{row.getValue("membershipId")}</div>
      ),
    },
    {
      accessorKey: "businessName",
      header: "Business Name",
      cell: ({ row }) => (
        <div className="font-medium whitespace-nowrap">{row.getValue("businessName")}</div>
      ),
    },
    {
      accessorKey: "contactName",
      header: "Contact Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("contactName")}</div>
      ),
    },
    {
      accessorKey: "renewalStatus",
      header: "Status",
      filterFn: (row, id, value) => {
        return value === "all" || row.getValue(id) === value;
      },
      cell: ({ row }) => {
        const status = row.getValue("renewalStatus") as RenewalStatus;
        return (
          <Badge className="bg-white border border-gray-100 text-gray-800 whitespace-nowrap">
            {getRenewalStatusIcon(status)}
            {formatRenewalStatus(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "membershipPrice",
      header: "Membership Price",
      cell: ({ row }) => (
        <div className="font-medium">
          ${(row.getValue("membershipPrice") as number).toLocaleString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedMember(row.original)}>
              <EyeIcon className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <EditIcon className="h-4 w-4 mr-2" />
              Send Renewal Notice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Calculate renewal metrics
  const renewalMetrics = useMemo(() => {
    const totalRenewals = mockMembersWithRenewalStatus.length;
    const pastDue = mockMembersWithRenewalStatus.filter(m => m.renewalStatus === 'past_due').length;
    const dueSoon = mockMembersWithRenewalStatus.filter(m => m.renewalStatus === 'due_soon').length;
    const upcoming = mockMembersWithRenewalStatus.filter(m => m.renewalStatus === 'upcoming').length;
    const totalRevenue = mockMembersWithRenewalStatus.reduce((sum, m) => sum + m.membershipPrice, 0);
    
    return {
      totalRenewals,
      pastDue,
      dueSoon,
      upcoming,
      totalRevenue
    };
  }, []);


  const table = useReactTable({
    data: mockMembersWithRenewalStatus,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    state: {
      globalFilter,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
    enableColumnFilters: true,
    enableHiding: true,
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "past_due", label: "Past Due" },
    { value: "due_soon", label: "Due Soon" },
    { value: "upcoming", label: "Upcoming" },
    { value: "renewed", label: "Renewed" },
  ];

  const pageSizeOptions = [10, 25, 50, 100, 200];

  // Calculate selected members data
  const selectedMembersData = useMemo(() => {
    const selectedRows = table.getSelectedRowModel().rows;
    const count = selectedRows.length;
    const total = selectedRows.reduce((sum, row) => sum + row.original.membershipPrice, 0);
    return { count, total };
  }, [rowSelection, table]);

  // Handlers for selection menu actions
  const handleSendReminder = () => {
    showToast("Reminder sent successfully");
    setRowSelection({});
  };

  const handleDownload = () => {
    showToast("Download started");
    setRowSelection({});
  };

  const handleDelete = () => {
    showToast("Members deleted");
    setRowSelection({});
  };


  return (
    <Layout 
      activeNav="Renewals"
      searchData={{
        members: mockPharmacyMembers,
        applications: mockApplications,
        renewals: mockMembersWithRenewalStatus
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl leading-8 font-normal text-gray-900">Renewals</h1>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <PaintRoller className="h-4 w-4" />
              Customize Invoice Template
            </Button>
          </div>
          <Select defaultValue="this_month">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="this_quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            title="Renewals"
            value={renewalMetrics.totalRenewals}
            trend={{ value: 2.5, direction: "up" }}
            description="This month"
            icon={Users}
          />
          <MetricCard
            title="Past Due"
            value={renewalMetrics.pastDue}
            trend={{ value: 0.5, direction: "down" }}
            description="Requires attention"
            icon={Activity}
            customColor="red"
          />
          <MetricCard
            title="Estimated Renewal Revenue"
            value={`$${renewalMetrics.totalRevenue.toLocaleString()}`}
            trend={{ value: 8.2, direction: "up" }}
            description="Expected this period"
            icon={DollarSign}
          />
        </div>

        {/* Search and Table */}
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search renewals..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(String(event.target.value))}
                className="pl-9"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select
                value={table.getColumn("renewalStatus")?.getFilterValue() as string || "past_due"}
                onValueChange={(value) => 
                  table.getColumn("renewalStatus")?.setFilterValue(value === "all" ? undefined : value)
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-gray-200">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-gray-800 font-medium px-4 py-3">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-gray-600 px-4 py-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-gray-600"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 py-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{' '}
                of {table.getFilteredRowModel().rows.length} entries
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Show:</span>
                <Select
                  value={table.getState().pagination.pageSize.toString()}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">per page</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">Page</span>
                <span className="text-sm font-medium">
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                Last
              </Button>
            </div>
          </div>
        </div>

        {/* Member Detail Modal */}
        {selectedMember && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedMember(null)}
          >
            <Card 
              className="max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-white border-gray-200 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{selectedMember.businessName}</CardTitle>
                    <p className="text-gray-600">{selectedMember.contactName}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMember(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Member ID</label>
                    <p className="mt-1">{selectedMember.membershipId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Renewal Status</label>
                    <div className="mt-1">
                      <Badge className={getRenewalStatusColor(selectedMember.renewalStatus)}>
                        {getRenewalStatusIcon(selectedMember.renewalStatus)}
                        {formatRenewalStatus(selectedMember.renewalStatus)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Membership Tier</label>
                    <p className="mt-1">
                      {(() => {
                        const tier = selectedMember.membershipTier;
                        switch (tier) {
                          case 'pharmacy': return 'Pharmacy';
                          case 'staff_pharmacist': return 'Staff Pharmacist';
                          case 'sustaining': return 'Sustaining';
                          case 'retired': return 'Retired';
                          case 'student': return 'Student';
                          case 'ltc_division': return 'LTC Division';
                          case 'corporate': return 'Corporate';
                          default: return tier;
                        }
                      })()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Annual Price</label>
                    <p className="mt-1">${selectedMember.membershipPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="mt-1 break-words">{selectedMember.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Business Phone</label>
                      <p className="mt-1">{selectedMember.businessPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Membership Details */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Renewal Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Join Date</label>
                      <p className="mt-1">{new Date(selectedMember.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Renewal Date</label>
                      <p className="mt-1">{new Date(selectedMember.renewalDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Last Activity</label>
                      <p className="mt-1">{new Date(selectedMember.lastActivity).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">Send Renewal Notice</Button>
                  <Button variant="secondary" className="flex-1">Mark as Renewed</Button>
                  <Button variant="secondary" className="flex-1">Contact Member</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Animated Selection Menu */}
        <div 
          className={`fixed bottom-16 left-0 right-0 z-50 transition-all duration-500 ease-out ${
            selectedMembersData.count > 0 
              ? 'transform translate-y-0 opacity-100' 
              : 'transform translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex justify-center">
            <div className="bg-white/75 backdrop-blur-sm border border-gray-100 rounded-full shadow-lg px-4 py-3 flex items-center gap-6">
              {/* Selection Info */}
              <div className="flex items-center gap-2">
                <span className="text-sm leading-6 font-medium text-gray-800">
                  {selectedMembersData.count} member{selectedMembersData.count !== 1 ? 's' : ''} selected
                </span>
                <span className="text-sm leading-6 font-normal text-gray-500">
                  worth ${selectedMembersData.total.toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Download Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4 text-gray-600" />
                </Button>

                {/* Delete Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-red-700" />
                </Button>

                {/* Send Reminder Button */}
                <Button
                  onClick={handleSendReminder}
                  size="sm"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-3 py-2 h-9 flex items-center gap-1.5"
                >
                  <Bell className="h-3 w-3" />
                  <span className="text-xs font-medium">Send Reminder</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};