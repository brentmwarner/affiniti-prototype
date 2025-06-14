import { useState, useMemo, useEffect } from "react";
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
import { SearchIcon, MoreVerticalIcon, EyeIcon, EditIcon, CircleCheck, CircleX, Loader, Columns, ChevronDown, LayoutGrid, LayoutList, Download, Trash2, Send, Settings } from "lucide-react";

import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Member, Application } from "../types/member";
import { mockPharmacyMembers, mockApplications } from "../data/generateMockData";
import { useToast } from "../components/ui/toast";

const getStatusColor = (status: Member['status']) => {
  switch (status) {
    case 'active':
      return 'bg-white border border-gray-100 text-gray-800';
    case 'inactive':
      return 'bg-white border border-gray-100 text-gray-800';
    case 'pending':
      return 'bg-white border border-gray-100 text-gray-800';
    case 'churned':
      return 'bg-white border border-gray-100 text-gray-800';
    default:
      return 'bg-white border border-gray-100 text-gray-800';
  }
};



export const Members = (): JSX.Element => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"full" | "condensed">("full");
  const { showToast } = useToast();

  const columns: ColumnDef<Member>[] = [
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
      enableHiding: true,
      cell: ({ row }) => (
        <div className="font-medium whitespace-nowrap">{row.getValue("membershipId")}</div>
      ),
    },
    {
      accessorKey: "businessName",
      header: "Business Name",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="font-medium whitespace-nowrap">{row.getValue("businessName")}</div>
      ),
    },
    {
      accessorKey: "contactName",
      header: "Contact Name",
      enableHiding: true,
      cell: ({ row }) => (
        <div>
          <div>{row.original.contactName}</div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      id: "businessAddress",
      header: "Business Address",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="text-sm whitespace-nowrap">
          {row.original.businessAddress.street}, {row.original.businessAddress.city}, {row.original.businessAddress.state} {row.original.businessAddress.zipCode}
        </div>
      ),
    },
    {
      id: "homeAddress",
      header: "Home Address",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="text-sm whitespace-nowrap">
          {row.original.homeAddress.street}, {row.original.homeAddress.city}, {row.original.homeAddress.state} {row.original.homeAddress.zipCode}
        </div>
      ),
    },
    {
      accessorKey: "businessPhone",
      header: "Business Phone",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("businessPhone")}</div>
      ),
    },
    {
      accessorKey: "personalPhone",
      header: "Personal Phone",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("personalPhone")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableHiding: true,
      cell: ({ row }) => {
        const status = row.getValue("status") as Member['status'];
        const getStatusIcon = () => {
          switch (status) {
            case 'active':
              return <CircleCheck className="w-3 h-3 mr-2 text-green-700" />;
            case 'churned':
              return <CircleX className="w-3 h-3 mr-2 text-red-700" />;
            case 'pending':
            case 'inactive':
              return <Loader className="w-3 h-3 mr-2 text-gray-800" />;
            default:
              return <Loader className="w-3 h-3 mr-2 text-gray-800" />;
          }
        };
        return (
          <Badge className={getStatusColor(status)}>
            {getStatusIcon()}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "membershipTier",
      header: "Tier",
      enableHiding: true,
      filterFn: (row, id, value) => {
        return value === "all" || row.getValue(id) === value;
      },
      cell: ({ row }) => {
        const tier = row.getValue("membershipTier") as string;
        const formatTierName = (tier: string) => {
          switch (tier) {
            case 'pharmacy': return 'Pharmacy';
            case 'staff_pharmacist': return 'Staff Pharmacist';
            case 'sustaining': return 'Sustaining';
            case 'retired': return 'Retired';
            case 'student': return 'Student';
            case 'ltc_division': return 'LTC Division';
            case 'corporate': return 'Corporate';
            default: return tier.charAt(0).toUpperCase() + tier.slice(1);
          }
        };
        return (
          <div className="text-sm">
            {formatTierName(tier)}
          </div>
        );
      },
    },
    {
      accessorKey: "membershipPrice",
      header: "Price",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="font-medium">
          ${(row.getValue("membershipPrice") as number).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "renewalDate",
      header: "Renewal Date",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("renewalDate")).toLocaleDateString()}
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
              Edit Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Application columns for the applications tab
  const applicationColumns: ColumnDef<Application>[] = [
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
      accessorKey: "applicationId",
      header: "Application ID",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="font-medium whitespace-nowrap">{row.getValue("applicationId")}</div>
      ),
    },
    {
      accessorKey: "businessName",
      header: "Business Name",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="font-medium whitespace-nowrap">{row.getValue("businessName")}</div>
      ),
    },
    {
      accessorKey: "contactName",
      header: "Contact Name",
      enableHiding: true,
      cell: ({ row }) => (
        <div>
          <div>{row.original.contactName}</div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      id: "businessAddress",
      header: "Business Address",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="text-sm whitespace-nowrap">
          {row.original.businessAddress.street}, {row.original.businessAddress.city}, {row.original.businessAddress.state} {row.original.businessAddress.zipCode}
        </div>
      ),
    },
    {
      accessorKey: "businessPhone",
      header: "Business Phone",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("businessPhone")}</div>
      ),
    },
    {
      accessorKey: "requestedTier",
      header: "Requested Tier",
      enableHiding: true,
      cell: ({ row }) => {
        const tier = row.getValue("requestedTier") as string;
        const formatTierName = (tier: string) => {
          switch (tier) {
            case 'pharmacy': return 'Pharmacy';
            case 'staff_pharmacist': return 'Staff Pharmacist';
            case 'sustaining': return 'Sustaining';
            case 'retired': return 'Retired';
            case 'student': return 'Student';
            case 'ltc_division': return 'LTC Division';
            case 'corporate': return 'Corporate';
            default: return tier.charAt(0).toUpperCase() + tier.slice(1);
          }
        };
        return (
          <div className="text-sm">
            {formatTierName(tier)}
          </div>
        );
      },
    },
    {
      accessorKey: "submittedDate",
      header: "Submitted Date",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("submittedDate")).toLocaleDateString()}
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
            <DropdownMenuItem onClick={() => setSelectedApplication(row.original)}>
              <EyeIcon className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <EditIcon className="h-4 w-4 mr-2" />
              Review Application
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Filter data based on active tab
  const filteredData = useMemo(() => {
    if (activeTab === "new_applications") {
      return mockApplications;
    }
    if (activeTab === "all") {
      return mockPharmacyMembers;
    }
    return mockPharmacyMembers.filter(member => member.status === activeTab);
  }, [activeTab]);

  // Define columns for condensed view
  const condensedColumns = ["select", "membershipId", "businessName", "contactName", "status", "membershipPrice", "actions"];
  const condensedApplicationColumns = ["select", "applicationId", "businessName", "contactName", "submittedDate", "actions"];

  // Create separate tables for members and applications
  const memberTable = useReactTable({
    data: activeTab === "new_applications" ? [] : filteredData as Member[],
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

  const applicationTable = useReactTable({
    data: activeTab === "new_applications" ? filteredData as Application[] : [],
    columns: applicationColumns,
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

  // Use the appropriate table based on active tab
  const table = activeTab === "new_applications" ? applicationTable : memberTable;


  const tierOptions = [
    { value: "all", label: "All Tiers" },
    { value: "pharmacy", label: "Pharmacy" },
    { value: "staff_pharmacist", label: "Staff Pharmacist" },
    { value: "student", label: "Student" },
    { value: "retired", label: "Retired" },
    { value: "sustaining", label: "Sustaining" },
    { value: "corporate", label: "Corporate" },
    { value: "ltc_division", label: "LTC Division" },
  ];

  const pageSizeOptions = [10, 25, 50, 100, 200];

  // Calculate selected members data
  const selectedMembersData = useMemo(() => {
    const selectedRows = table.getSelectedRowModel().rows;
    const count = selectedRows.length;
    const total = selectedRows.reduce((sum, row) => {
      const member = row.original as Member;
      return sum + member.membershipPrice;
    }, 0);
    return { count, total };
  }, [rowSelection, table]);

  // Handlers for selection menu actions
  const handleExportSelected = () => {
    showToast("Export started");
    setRowSelection({});
  };

  const handleSendInvoice = () => {
    showToast("Invoices sent successfully");
    setRowSelection({});
  };

  const handleUpdateStatus = () => {
    showToast("Status updated");
    setRowSelection({});
  };

  const handleDeleteSelected = () => {
    showToast("Members deleted");
    setRowSelection({});
  };

  const tabs = [
    { 
      id: "all", 
      label: "All", 
      count: mockPharmacyMembers.length 
    },
    { 
      id: "new_applications", 
      label: "New Applications", 
      count: mockApplications.length 
    },
    { 
      id: "active", 
      label: "Active", 
      count: mockPharmacyMembers.filter(m => m.status === 'active').length 
    },
    { 
      id: "pending", 
      label: "Pending", 
      count: mockPharmacyMembers.filter(m => m.status === 'pending').length 
    },
    { 
      id: "inactive", 
      label: "Inactive", 
      count: mockPharmacyMembers.filter(m => m.status === 'inactive').length 
    },
    { 
      id: "churned", 
      label: "Churned", 
      count: mockPharmacyMembers.filter(m => m.status === 'churned').length 
    }
  ];

  // Update column visibility based on view mode
  useEffect(() => {
    if (viewMode === "condensed") {
      const newVisibility: VisibilityState = {};
      const currentCondensedColumns = activeTab === "new_applications" ? condensedApplicationColumns : condensedColumns;
      table.getAllColumns().forEach((column) => {
        if (column.getCanHide()) {
          newVisibility[column.id] = currentCondensedColumns.includes(column.id);
        }
      });
      setColumnVisibility(newVisibility);
    } else {
      // Show all columns in full view
      const newVisibility: VisibilityState = {};
      table.getAllColumns().forEach((column) => {
        if (column.getCanHide()) {
          newVisibility[column.id] = true;
        }
      });
      setColumnVisibility(newVisibility);
    }
  }, [viewMode, table, activeTab]);

  return (
    <Layout 
      activeNav="Members"
      searchData={{
        members: mockPharmacyMembers,
        applications: mockApplications
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl leading-8 font-normal text-gray-900">Members</h1>
        </div>

        {/* CRM Pipeline Tabs */}
        <div className="border-b border-gray-200">
          <nav className="inline-flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setGlobalFilter("");
                  setRowSelection({});
                  memberTable.setPageIndex(0);
                  applicationTable.setPageIndex(0);
                }}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-lg leading-7 transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
                <span className={`
                  ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-900 group-hover:bg-gray-200'
                  }
                `}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Table */}
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search members..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(String(event.target.value))}
                className="pl-9"
              />
            </div>
            
            <div className="flex items-center gap-2">
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {viewMode === "full" ? <LayoutGrid className="h-4 w-4 mr-2" /> : <LayoutList className="h-4 w-4 mr-2" />}
                    {viewMode === "full" ? "Full View" : "Condensed View"}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewMode("condensed")}>
                    <LayoutList className="h-4 w-4 mr-2" />
                    Condensed View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode("full")}>
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Full View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Select
                value={table.getColumn("membershipTier")?.getFilterValue() as string || "all"}
                onValueChange={(value) => 
                  table.getColumn("membershipTier")?.setFilterValue(value === "all" ? undefined : value)
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {tierOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    <Columns className="h-4 w-4 mr-2" />
                    Customize Columns
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] z-[100]">
                  <DropdownMenuLabel>Customize Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      const columnNames: Record<string, string> = {
                        membershipId: "Member ID",
                        businessName: "Business Name",
                        contactName: "Contact Name",
                        businessAddress: "Business Address",
                        homeAddress: "Home Address",
                        businessPhone: "Business Phone",
                        personalPhone: "Personal Phone",
                        status: "Status",
                        membershipTier: "Tier",
                        membershipPrice: "Price",
                        renewalDate: "Renewal Date"
                      };
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {columnNames[column.id] || column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white overflow-x-auto">
            {activeTab === "new_applications" ? (
              <Table>
                <TableHeader>
                  {applicationTable.getHeaderGroups().map((headerGroup) => (
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
                  {applicationTable.getRowModel().rows?.length ? (
                    applicationTable.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('.dropdown, button, input, [role="button"]')) {
                            return;
                          }
                          setSelectedApplication(row.original);
                        }}
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
                        colSpan={applicationColumns.length}
                        className="h-24 text-center text-gray-600"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  {memberTable.getHeaderGroups().map((headerGroup) => (
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
                  {memberTable.getRowModel().rows?.length ? (
                    memberTable.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('.dropdown, button, input, [role="button"]')) {
                            return;
                          }
                          setSelectedMember(row.original);
                        }}
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
            )}
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

        {/* Member Detail Side Tray */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="flex-1 bg-black/50 transition-opacity duration-300 ease-out animate-in fade-in-0"
              onClick={() => setSelectedMember(null)}
            />
            
            {/* Side Tray */}
            <div className="w-96 h-full bg-white border-l border-gray-200 shadow-2xl overflow-y-auto transform transition-all duration-300 ease-out animate-in slide-in-from-right-0 data-[state=open]:slide-in-from-right-0">
              <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-500">Member</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMember(null)}
                    className="text-gray-400 hover:text-gray-600 -mt-1 -mr-2"
                  >
                    ×
                  </Button>
                </div>

                {/* Business Name */}
                <div>
                  <h1 className="text-3xl font-normal text-gray-900">{selectedMember.businessName}</h1>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="secondary" size="sm">
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Invoice
                  </Button>
                  <Button variant="secondary" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>

                {/* Member ID */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Member ID</h4>
                  <p className="text-gray-900">{selectedMember.membershipId}</p>
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Status</h4>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedMember.status)}>
                      {selectedMember.status === 'active' && <CircleCheck className="w-3 h-3 mr-2 text-green-700" />}
                      {selectedMember.status === 'churned' && <CircleX className="w-3 h-3 mr-2 text-red-700" />}
                      {(selectedMember.status === 'pending' || selectedMember.status === 'inactive') && <Loader className="w-3 h-3 mr-2 text-gray-800" />}
                      {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Contact Name */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Contact Name</h4>
                  <p className="text-gray-900">{selectedMember.contactName}</p>
                </div>

                {/* Email */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Email</h4>
                  <p className="text-gray-900 break-words overflow-wrap-anywhere">{selectedMember.email}</p>
                </div>

                {/* Business Phone */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Business Phone</h4>
                  <p className="text-gray-900">{selectedMember.businessPhone}</p>
                </div>

                {/* Personal Phone */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Personal Phone</h4>
                  <p className="text-gray-900">{selectedMember.personalPhone}</p>
                </div>

                {/* Business Address */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Business Address</h4>
                  <div className="text-gray-900">
                    <p>{selectedMember.businessAddress.street}</p>
                    <p>{selectedMember.businessAddress.city}, {selectedMember.businessAddress.state} {selectedMember.businessAddress.zipCode}</p>
                  </div>
                </div>

                {/* Home Address */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Home Address</h4>
                  <div className="text-gray-900">
                    <p>{selectedMember.homeAddress.street}</p>
                    <p>{selectedMember.homeAddress.city}, {selectedMember.homeAddress.state} {selectedMember.homeAddress.zipCode}</p>
                  </div>
                </div>

                {/* Membership Tier */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Membership Tier</h4>
                  <p className="text-gray-900">
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

                {/* Annual Price */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Annual Price</h4>
                  <p className="text-gray-900 font-medium">${selectedMember.membershipPrice.toLocaleString()}</p>
                </div>

                {/* Join Date */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Join Date</h4>
                  <p className="text-gray-900">{new Date(selectedMember.joinDate).toLocaleDateString()}</p>
                </div>

                {/* Renewal Date */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Renewal Date</h4>
                  <p className="text-gray-900">{new Date(selectedMember.renewalDate).toLocaleDateString()}</p>
                </div>

                {/* Last Activity */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Last Activity</h4>
                  <p className="text-gray-900">{new Date(selectedMember.lastActivity).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Detail Side Tray */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="flex-1 bg-black/50 transition-opacity duration-300 ease-out animate-in fade-in-0"
              onClick={() => setSelectedApplication(null)}
            />
            
            {/* Side Tray */}
            <div className="w-96 h-full bg-white border-l border-gray-200 shadow-2xl overflow-y-auto transform transition-all duration-300 ease-out animate-in slide-in-from-right-0 data-[state=open]:slide-in-from-right-0">
              <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-500">Application</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600 -mt-1 -mr-2"
                  >
                    ×
                  </Button>
                </div>

                {/* Business Name */}
                <div>
                  <h1 className="text-3xl font-normal text-gray-900">{selectedApplication.businessName}</h1>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="secondary" size="sm">
                    <EditIcon className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="secondary" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>

                {/* Application ID */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Application ID</h4>
                  <p className="text-gray-900">{selectedApplication.applicationId}</p>
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Status</h4>
                  <p className="text-gray-900 font-medium">
                    {(() => {
                      const status = selectedApplication.status;
                      switch (status) {
                        case 'pending_review': return 'Pending Review';
                        case 'under_review': return 'Under Review';
                        case 'approved': return 'Approved';
                        case 'rejected': return 'Rejected';
                        case 'requires_info': return 'Requires Info';
                        default: return status;
                      }
                    })()}
                  </p>
                </div>

                {/* Contact Name */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Contact Name</h4>
                  <p className="text-gray-900">{selectedApplication.contactName}</p>
                </div>

                {/* Email */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Email</h4>
                  <p className="text-gray-900 break-words overflow-wrap-anywhere">{selectedApplication.email}</p>
                </div>

                {/* Business Phone */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Business Phone</h4>
                  <p className="text-gray-900">{selectedApplication.businessPhone}</p>
                </div>

                {/* Business Address */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Business Address</h4>
                  <div className="text-gray-900">
                    <p>{selectedApplication.businessAddress.street}</p>
                    <p>{selectedApplication.businessAddress.city}, {selectedApplication.businessAddress.state} {selectedApplication.businessAddress.zipCode}</p>
                  </div>
                </div>

                {/* Requested Tier */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Requested Tier</h4>
                  <p className="text-gray-900">
                    {(() => {
                      const tier = selectedApplication.requestedTier;
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

                {/* Submitted Date */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Submitted Date</h4>
                  <p className="text-gray-900">{new Date(selectedApplication.submittedDate).toLocaleDateString()}</p>
                </div>

                {/* Review Information */}
                {(selectedApplication.reviewedBy || selectedApplication.notes) && (
                  <>
                    {selectedApplication.reviewedBy && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Reviewed By</h4>
                        <p className="text-gray-900">{selectedApplication.reviewedBy}</p>
                      </div>
                    )}
                    {selectedApplication.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Notes</h4>
                        <p className="text-gray-900 break-words">{selectedApplication.notes}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
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
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Export Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleExportSelected}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4 text-gray-600" />
                </Button>

                {/* Send Invoice Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSendInvoice}
                  className="h-8 w-8 p-0"
                >
                  <Send className="h-4 w-4 text-gray-600" />
                </Button>

                {/* Delete Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-red-700" />
                </Button>

                {/* Update Status Button - Primary Action */}
                <Button
                  onClick={handleUpdateStatus}
                  size="sm"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-3 py-2 h-9 flex items-center gap-1.5"
                >
                  <Settings className="h-3 w-3" />
                  <span className="text-xs font-medium">Update Status</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};