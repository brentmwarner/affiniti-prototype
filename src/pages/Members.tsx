import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { SearchIcon, FilterIcon, MoreVerticalIcon, EyeIcon, EditIcon, PhoneIcon, MailIcon } from "lucide-react";

import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Member } from "../types/member";

// Mock data for demonstration
const mockMembers: Member[] = [
  {
    id: "1",
    membershipId: "MEM-001",
    businessName: "Smith & Associates",
    contactName: "John Smith",
    businessAddress: {
      street: "123 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    homeAddress: {
      street: "456 Home St",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201"
    },
    businessPhone: "(555) 123-4567",
    personalPhone: "(555) 987-6543",
    email: "john@smithassociates.com",
    status: "active",
    membershipTier: "premium",
    membershipPrice: 1200,
    renewalDate: "2024-12-15",
    joinDate: "2020-01-15",
    lastActivity: "2024-06-10"
  },
  {
    id: "2",
    membershipId: "MEM-002",
    businessName: "Tech Solutions LLC",
    contactName: "Sarah Johnson",
    businessAddress: {
      street: "789 Tech Blvd",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105"
    },
    homeAddress: {
      street: "321 Valley Rd",
      city: "Palo Alto",
      state: "CA",
      zipCode: "94301"
    },
    businessPhone: "(415) 555-0123",
    personalPhone: "(415) 555-0987",
    email: "sarah@techsolutions.com",
    status: "active",
    membershipTier: "enterprise",
    membershipPrice: 2500,
    renewalDate: "2024-11-30",
    joinDate: "2019-03-22",
    lastActivity: "2024-06-12"
  },
  {
    id: "3",
    membershipId: "MEM-003",
    businessName: "Local Bakery",
    contactName: "Mike Chen",
    businessAddress: {
      street: "567 Main St",
      city: "Chicago",
      state: "IL",
      zipCode: "60601"
    },
    homeAddress: {
      street: "890 Oak Ave",
      city: "Evanston",
      state: "IL",
      zipCode: "60202"
    },
    businessPhone: "(312) 555-4567",
    personalPhone: "(312) 555-7890",
    email: "mike@localbakery.com",
    status: "inactive",
    membershipTier: "basic",
    membershipPrice: 600,
    renewalDate: "2024-08-15",
    joinDate: "2021-06-10",
    lastActivity: "2024-05-20"
  },
  {
    id: "4",
    membershipId: "MEM-004",
    businessName: "Design Studio Pro",
    contactName: "Emily Rodriguez",
    businessAddress: {
      street: "246 Creative Way",
      city: "Austin",
      state: "TX",
      zipCode: "78701"
    },
    homeAddress: {
      street: "135 Art Lane",
      city: "Austin",
      state: "TX",
      zipCode: "78704"
    },
    businessPhone: "(512) 555-2468",
    personalPhone: "(512) 555-8642",
    email: "emily@designstudiopro.com",
    status: "pending",
    membershipTier: "premium",
    membershipPrice: 1200,
    renewalDate: "2024-09-30",
    joinDate: "2024-06-01",
    lastActivity: "2024-06-11"
  },
  {
    id: "5",
    membershipId: "MEM-005",
    businessName: "Mountain View Consulting",
    contactName: "David Wilson",
    businessAddress: {
      street: "369 Summit Dr",
      city: "Denver",
      state: "CO",
      zipCode: "80202"
    },
    homeAddress: {
      street: "258 Pine St",
      city: "Boulder",
      state: "CO",
      zipCode: "80301"
    },
    businessPhone: "(303) 555-3691",
    personalPhone: "(303) 555-1472",
    email: "david@mvConsulting.com",
    status: "churned",
    membershipTier: "basic",
    membershipPrice: 600,
    renewalDate: "2024-05-15",
    joinDate: "2022-11-08",
    lastActivity: "2024-04-30"
  }
];

const getStatusColor = (status: Member['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    case 'churned':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTierColor = (tier: Member['membershipTier']) => {
  switch (tier) {
    case 'enterprise':
      return 'bg-purple-100 text-purple-800';
    case 'premium':
      return 'bg-blue-100 text-blue-800';
    case 'basic':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const Members = (): JSX.Element => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "membershipId",
      header: "Member ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("membershipId")}</div>
      ),
    },
    {
      accessorKey: "businessName",
      header: "Business Name",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{row.getValue("businessName")}</div>
          <div className="text-sm text-gray-500 truncate">{row.original.contactName}</div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <MailIcon className="w-3 h-3 text-gray-400" />
            <span className="text-sm truncate max-w-[150px]">{row.getValue("email")}</span>
          </div>
          <div className="flex items-center gap-1">
            <PhoneIcon className="w-3 h-3 text-gray-400" />
            <span className="text-sm">{row.original.businessPhone}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.getValue("status"))}>
          {(row.getValue("status") as string).charAt(0).toUpperCase() + (row.getValue("status") as string).slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: "membershipTier",
      header: "Tier",
      cell: ({ row }) => (
        <Badge className={getTierColor(row.getValue("membershipTier"))}>
          {(row.getValue("membershipTier") as string).charAt(0).toUpperCase() + (row.getValue("membershipTier") as string).slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: "membershipPrice",
      header: "Price",
      cell: ({ row }) => (
        <div className="font-medium">
          ${(row.getValue("membershipPrice") as number).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "renewalDate",
      header: "Renewal Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("renewalDate")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedMember(row.original)}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <EditIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: mockMembers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <Layout activeNav="Members">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Members</h1>
            <p className="text-gray-600 mt-1">Manage your organization's members and their information.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <FilterIcon className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button>
              Add Member
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMembers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockMembers.filter(m => m.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Renewals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {mockMembers.filter(m => m.status === 'inactive').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mockMembers.filter(m => m.status === 'active').reduce((sum, m) => sum + m.membershipPrice, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(String(event.target.value))}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
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
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
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
                        className="h-24 text-center"
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Detail Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
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
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedMember.status)}>
                        {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Membership Tier</label>
                    <div className="mt-1">
                      <Badge className={getTierColor(selectedMember.membershipTier)}>
                        {selectedMember.membershipTier.charAt(0).toUpperCase() + selectedMember.membershipTier.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Annual Price</label>
                    <p className="mt-1 font-medium">${selectedMember.membershipPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="mt-1">{selectedMember.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Business Phone</label>
                      <p className="mt-1">{selectedMember.businessPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Personal Phone</label>
                      <p className="mt-1">{selectedMember.personalPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Addresses</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Business Address</label>
                      <div className="mt-1 text-sm">
                        <p>{selectedMember.businessAddress.street}</p>
                        <p>{selectedMember.businessAddress.city}, {selectedMember.businessAddress.state} {selectedMember.businessAddress.zipCode}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Home Address</label>
                      <div className="mt-1 text-sm">
                        <p>{selectedMember.homeAddress.street}</p>
                        <p>{selectedMember.homeAddress.city}, {selectedMember.homeAddress.state} {selectedMember.homeAddress.zipCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Membership Details */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Membership Details</h3>
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
                  <Button className="flex-1">Edit Member</Button>
                  <Button variant="outline" className="flex-1">Send Invoice</Button>
                  <Button variant="outline" className="flex-1">Contact Member</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};