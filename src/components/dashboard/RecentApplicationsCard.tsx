import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ChevronRight, Loader } from "lucide-react";

interface Application {
  id: string;
  name: string;
  organization: string;
  membershipType: "Premium Member" | "Regular Member" | "Standard Member";
  timeAgo: string;
  status: "Pending";
}

const applications: Application[] = [
  {
    id: "1",
    name: "Emily Carter",
    organization: "Seaside Wellness Center",
    membershipType: "Premium Member",
    timeAgo: "1 hour ago",
    status: "Pending"
  },
  {
    id: "2", 
    name: "Michael Thompson",
    organization: "Forest Grove Clinic",
    membershipType: "Regular Member",
    timeAgo: "30 minutes ago",
    status: "Pending"
  },
  {
    id: "3",
    name: "Sarah Johnson", 
    organization: "City Health Hub",
    membershipType: "Premium Member",
    timeAgo: "15 minutes ago",
    status: "Pending"
  },
  {
    id: "4",
    name: "David Brown",
    organization: "Lakeside Medical",
    membershipType: "Standard Member", 
    timeAgo: "5 minutes ago",
    status: "Pending"
  }
];

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export function RecentApplicationsCard() {
  return (
    <Card className="border-0 h-full flex flex-col" style={{ boxShadow: '0 0 2px 0 #afb2ce8f, 0 1px 4px 0 #0404341a' }}>
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Recent Applications</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex flex-col flex-1">
        <div className="space-y-4 flex-1">
          {applications.map((application) => (
            <div key={application.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 bg-zinc-100">
                  <AvatarFallback className="text-zinc-600 text-sm font-medium">
                    {getInitials(application.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{application.name}</h4>
                    <Badge className="bg-white border border-gray-100 text-gray-800">
                      <Loader className="w-3 h-3 mr-2 text-gray-800" />
                      {application.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {application.organization} - {application.membershipType}
                  </div>
                  <div className="text-xs text-gray-400">
                    {application.timeAgo}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 flex justify-end flex-shrink-0">
          <div className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}