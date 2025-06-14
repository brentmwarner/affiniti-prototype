import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { MetricCard } from "../components/dashboard/MetricCard";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  SearchIcon,
  PlusIcon,
  MoreVerticalIcon,
  EyeIcon,
  EditIcon,
  SendIcon,
  DownloadIcon,
  DollarSignIcon,
  CreditCardIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  memberName: string;
  membershipId: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  description: string;
  membershipTier: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'check' | 'cash';
  status: 'completed' | 'pending' | 'failed';
  processedDate: string;
  transactionId: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    memberName: 'Central Pharmacy',
    membershipId: 'MEM-2024-001',
    amount: 499,
    status: 'paid',
    issueDate: '2024-01-01',
    dueDate: '2024-01-31',
    paidDate: '2024-01-15',
    description: 'Annual Pharmacy Membership',
    membershipTier: 'pharmacy',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    memberName: 'John Smith',
    membershipId: 'MEM-2024-002',
    amount: 299,
    status: 'pending',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    description: 'Annual Staff Pharmacist Membership',
    membershipTier: 'staff_pharmacist',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    memberName: 'Wellness Drugs Inc',
    membershipId: 'MEM-2024-003',
    amount: 749,
    status: 'overdue',
    issueDate: '2023-12-01',
    dueDate: '2023-12-31',
    description: 'Annual Corporate Membership',
    membershipTier: 'corporate',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    memberName: 'Sarah Johnson',
    membershipId: 'MEM-2024-004',
    amount: 99,
    status: 'paid',
    issueDate: '2024-01-10',
    dueDate: '2024-02-10',
    paidDate: '2024-01-12',
    description: 'Annual Student Membership',
    membershipTier: 'student',
  },
];

const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    amount: 499,
    method: 'credit_card',
    status: 'completed',
    processedDate: '2024-01-15',
    transactionId: 'TXN-123456789',
  },
  {
    id: '2',
    invoiceId: '4',
    amount: 99,
    method: 'credit_card',
    status: 'completed',
    processedDate: '2024-01-12',
    transactionId: 'TXN-987654321',
  },
];

const getStatusColor = (status: Invoice['status']) => {
  return 'bg-white border border-gray-100 text-gray-800';
};

const getStatusIcon = (status: Invoice['status']) => {
  switch (status) {
    case 'paid':
      return <CheckCircleIcon className="w-3 h-3 mr-2 text-green-700" />;
    case 'pending':
      return <ClockIcon className="w-3 h-3 mr-2 text-yellow-700" />;
    case 'overdue':
      return <AlertCircleIcon className="w-3 h-3 mr-2 text-red-700" />;
    case 'cancelled':
      return <XCircleIcon className="w-3 h-3 mr-2 text-gray-700" />;
    default:
      return <ClockIcon className="w-3 h-3 mr-2 text-gray-700" />;
  }
};

export const Billing = (): JSX.Element => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState("invoices");

  const columns: ColumnDef<Invoice>[] = [
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
      accessorKey: "invoiceNumber",
      header: "Invoice #",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("invoiceNumber")}</div>
      ),
    },
    {
      accessorKey: "memberName",
      header: "Member",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.memberName}</div>
          <div className="text-sm text-gray-500">{row.original.membershipId}</div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium">
          ${(row.getValue("amount") as number).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Invoice['status'];
        return (
          <Badge className={getStatusColor(status)}>
            {getStatusIcon(status)}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "issueDate",
      header: "Issue Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("issueDate")).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("dueDate")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedInvoice(row.original)}>
              <EyeIcon className="h-4 w-4 mr-2" />
              View Invoice
            </DropdownMenuItem>
            <DropdownMenuItem>
              <EditIcon className="h-4 w-4 mr-2" />
              Edit Invoice
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SendIcon className="h-4 w-4 mr-2" />
              Send Reminder
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    return mockInvoices;
  }, []);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
    state: {
      globalFilter,
      rowSelection,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    enableRowSelection: true,
    enableColumnFilters: true,
  });

  const tabs = [
    { 
      id: "invoices", 
      label: "Invoices", 
      count: mockInvoices.length 
    },
    { 
      id: "payments", 
      label: "Payments", 
      count: mockPayments.length 
    },
  ];

  // Calculate statistics
  const totalRevenue = mockInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = mockInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = mockInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <Layout activeNav="Billing">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl leading-8 font-normal text-gray-900">Billing</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            trend={{
              value: 8.2,
              direction: "up"
            }}
            description="+8.2% from last month"
            icon={DollarSignIcon}
          />
          
          <MetricCard
            title="Pending Amount"
            value={`$${pendingAmount.toFixed(2)}`}
            description={`${mockInvoices.filter(i => i.status === 'pending').length} invoices`}
            icon={ClockIcon}
          />
          
          <MetricCard
            title="Overdue Amount"
            value={`$${overdueAmount.toFixed(2)}`}
            description={`${mockInvoices.filter(i => i.status === 'overdue').length} invoices`}
            icon={AlertCircleIcon}
            customColor="red"
          />
          
          <MetricCard
            title="Collection Rate"
            value="94.2%"
            trend={{
              value: 2.1,
              direction: "up"
            }}
            description="+2.1% from last month"
            icon={TrendingUpIcon}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="inline-flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-lg leading-7 transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-gray-800'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className={`
                    ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-900 group-hover:bg-gray-200'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Invoices Tab Content */}
        {activeTab === "invoices" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoices..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(String(event.target.value))}
                  className="pl-9"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Select
                  value={table.getColumn("status")?.getFilterValue() as string || "all"}
                  onValueChange={(value) => 
                    table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Invoices Table */}
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
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('.dropdown, button, input, [role="button"]')) {
                            return;
                          }
                          setSelectedInvoice(row.original);
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
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{' '}
                of {table.getFilteredRowModel().rows.length} entries
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
        )}

        {/* Payments Tab Content */}
        {activeTab === "payments" && (
          <div className="text-center py-12">
            <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment History</h3>
            <p className="text-gray-600 mb-6">View and manage payment transactions</p>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </div>
        )}


        {/* Invoice Detail Side Tray */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="flex-1 bg-black/50 transition-opacity duration-300 ease-out animate-in fade-in-0"
              onClick={() => setSelectedInvoice(null)}
            />
            
            {/* Side Tray */}
            <div className="w-96 h-full bg-white border-l border-gray-200 shadow-2xl overflow-y-auto transform transition-all duration-300 ease-out animate-in slide-in-from-right-0 data-[state=open]:slide-in-from-right-0">
              <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-500">Invoice</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedInvoice(null)}
                    className="text-gray-400 hover:text-gray-600 -mt-1 -mr-2"
                  >
                    ×
                  </Button>
                </div>

                {/* Invoice Number */}
                <div>
                  <h1 className="text-3xl font-normal text-gray-900">{selectedInvoice.invoiceNumber}</h1>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="secondary" size="sm">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="secondary" size="sm">
                    <SendIcon className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                  <Button variant="secondary" size="sm">
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                {/* Member Name */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Bill To</h4>
                  <p className="text-gray-900">{selectedInvoice.memberName}</p>
                  <p className="text-sm text-gray-600">{selectedInvoice.membershipId}</p>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Description</h4>
                  <p className="text-gray-900 break-words">{selectedInvoice.description}</p>
                  <p className="text-sm text-gray-600 capitalize">{selectedInvoice.membershipTier.replace('_', ' ')}</p>
                </div>

                {/* Issue Date */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Issue Date</h4>
                  <p className="text-gray-900">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                </div>

                {/* Due Date */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Due Date</h4>
                  <p className="text-gray-900">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Status</h4>
                  <p className="text-gray-900">{selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}</p>
                </div>

                {/* Amount - Receipt Style */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium text-gray-900">Total Amount</h4>
                    <p className="text-2xl font-bold text-gray-900">${selectedInvoice.amount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Paid Date */}
                {selectedInvoice.paidDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Paid Date</h4>
                    <p className="text-gray-900">{new Date(selectedInvoice.paidDate).toLocaleDateString()}</p>
                  </div>
                )}

                {/* Payment Information */}
                {selectedInvoice.status === 'paid' && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">Payment Method</h4>
                      <p className="text-gray-900">Credit Card</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">Transaction ID</h4>
                      <p className="text-gray-900">TXN-123456789</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};