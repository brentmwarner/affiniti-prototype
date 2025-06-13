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
import { Checkbox } from "../components/ui/checkbox";
import { SearchIcon, MoreVerticalIcon, EyeIcon, EditIcon, PhoneIcon, MailIcon, CircleCheck, CircleX, Loader } from "lucide-react";

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
import { mockPharmacyMembers } from "../data/generateMockData";

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


const getTierColor = (tier: Member['membershipTier']) => {
  switch (tier) {
    case 'pharmacy':
      return 'bg-blue-100 text-blue-800';
    case 'staff_pharmacist':
      return 'bg-green-100 text-green-800';
    case 'sustaining':
      return 'bg-purple-100 text-purple-800';
    case 'retired':
      return 'bg-orange-100 text-orange-800';
    case 'student':
      return 'bg-yellow-100 text-yellow-800';
    case 'ltc_division':
      return 'bg-teal-100 text-teal-800';
    case 'corporate':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const Members = (): JSX.Element => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [rowSelection, setRowSelection] = useState({});

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
          <Badge className={getTierColor(tier as Member['membershipTier'])}>
            {formatTierName(tier)}
          </Badge>
        );
      },
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
    data: mockPharmacyMembers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    state: {
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  return (
    <Layout activeNav="Members">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-1">Manage your organization's members and their information.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPharmacyMembers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockPharmacyMembers.filter(m => m.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Renewals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {mockPharmacyMembers.filter(m => m.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Annual Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mockPharmacyMembers.filter(m => m.status === 'active').reduce((sum, m) => sum + m.membershipPrice, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <div className="space-y-4">
          {/* Search and Selection Actions */}
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
            
            {Object.keys(rowSelection).length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {Object.keys(rowSelection).length} selected
                </span>
                <Button variant="outline" size="sm">
                  Export Selected
                </Button>
                <Button variant="outline" size="sm">
                  Send Invoice
                </Button>
                <Button variant="outline" size="sm">
                  Update Status
                </Button>
                <Button variant="destructive" size="sm">
                  Delete Selected
                </Button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-gray-200">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-gray-800 font-medium">
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
                        <TableCell key={cell.id} className="text-gray-600">
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
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedMember.status)}>
                        {selectedMember.status === 'active' && <CircleCheck className="w-3 h-3 mr-2 text-green-700" />}
                        {selectedMember.status === 'churned' && <CircleX className="w-3 h-3 mr-2 text-red-700" />}
                        {(selectedMember.status === 'pending' || selectedMember.status === 'inactive') && <Loader className="w-3 h-3 mr-2 text-gray-800" />}
                        {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Membership Tier</label>
                    <div className="mt-1">
                      <Badge className={getTierColor(selectedMember.membershipTier)}>
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
                  <Button variant="secondary" className="flex-1">Send Invoice</Button>
                  <Button variant="secondary" className="flex-1">Contact Member</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};