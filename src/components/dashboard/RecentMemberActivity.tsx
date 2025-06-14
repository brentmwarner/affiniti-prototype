import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { MoreVerticalIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EyeIcon } from "lucide-react";

interface ActivityItem {
  date: string;
  businessName: string;
  contactName: string;
  event: string;
  notes: string;
}

const recentActivities: ActivityItem[] = [
  {
    date: "2025-01-14",
    businessName: "Koch LLC",
    contactName: "Timmy Christiansen",
    event: "Renewal processed",
    notes: "Auto-renew via card on file"
  },
  {
    date: "2025-01-14",
    businessName: "Metz - Herzog",
    contactName: "Ollie Runolfsdottir",
    event: "Contact info updated",
    notes: "Added new phone number"
  },
  {
    date: "2025-01-14",
    businessName: "Strosin, Pfannerstill and Gislason",
    contactName: "Mr. Cesar Jaskolski",
    event: "Invoice sent",
    notes: "monserrat44@gmail.com"
  },
  {
    date: "2025-01-13",
    businessName: "O'Reilly, Smitham and O'Connell",
    contactName: "Gerald Ferry",
    event: "Data import completed",
    notes: "12 duplicates flagged"
  },
  {
    date: "2025-01-13",
    businessName: "Lindgren - Davis",
    contactName: "Dr. Dwight Spinka",
    event: "Campaign link clicked",
    notes: "Clicked 'Renew Now' reminder"
  }
];

export const RecentMemberActivity = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl leading-7 font-normal text-gray-900">Recent Member Activity</h2>
      <div className="bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-gray-800 font-medium px-4 py-3">Date</TableHead>
              <TableHead className="text-gray-800 font-medium px-4 py-3">Business Name</TableHead>
              <TableHead className="text-gray-800 font-medium px-4 py-3">Contact Name</TableHead>
              <TableHead className="text-gray-800 font-medium px-4 py-3">Event</TableHead>
              <TableHead className="text-gray-800 font-medium px-4 py-3">Notes</TableHead>
              <TableHead className="text-gray-800 font-medium px-4 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity, index) => (
              <TableRow key={index} className="cursor-pointer hover:bg-gray-50 border-b border-gray-100">
                <TableCell className="text-gray-600 px-4 py-3">
                  {new Date(activity.date).toLocaleDateString('en-US', { 
                    month: '2-digit', 
                    day: '2-digit', 
                    year: 'numeric' 
                  })}
                </TableCell>
                <TableCell className="text-gray-600 px-4 py-3 font-medium">
                  {activity.businessName}
                </TableCell>
                <TableCell className="text-gray-600 px-4 py-3">
                  {activity.contactName}
                </TableCell>
                <TableCell className="text-gray-600 px-4 py-3">
                  {activity.event}
                </TableCell>
                <TableCell className="text-gray-600 px-4 py-3">
                  {activity.notes}
                </TableCell>
                <TableCell className="text-gray-600 px-4 py-3">
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
                      <DropdownMenuItem>
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};