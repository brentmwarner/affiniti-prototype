import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChevronRight } from "lucide-react";

interface Location {
  id: string;
  state: string;
  percentage: number;
  flagUrl: string;
}

const locations: Location[] = [
  {
    id: "1",
    state: "California", 
    percentage: 45.7,
    flagUrl: "https://flagcdn.com/w80/us-ca.png"
  },
  {
    id: "2",
    state: "Georgia",
    percentage: 27.2, 
    flagUrl: "https://flagcdn.com/w80/us-ga.png"
  },
  {
    id: "3",
    state: "Florida",
    percentage: 15.2,
    flagUrl: "https://flagcdn.com/w80/us-fl.png"
  },
  {
    id: "4", 
    state: "New Jersey",
    percentage: 10.6,
    flagUrl: "https://flagcdn.com/w80/us-nj.png"
  },
  {
    id: "5",
    state: "New York",
    percentage: 6.21,
    flagUrl: "https://flagcdn.com/w80/us-ny.png"
  }
];

const getProgressColor = (percentage: number) => {
  return "bg-indigo-500";
};

export function TopMemberLocationsCard() {
  return (
    <Card className="border-0 h-full flex flex-col" style={{ boxShadow: '0 0 2px 0 #afb2ce8f, 0 1px 4px 0 #0404341a' }}>
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Top Member Locations</CardTitle>
          <p className="text-sm text-gray-500">Majority of your members are coming from these 5 states</p>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex flex-col flex-1 min-h-0">
        <div className="flex flex-col justify-between flex-1 overflow-hidden">
          {locations.map((location) => (
            <div key={location.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={location.flagUrl} 
                      alt={`${location.state} flag`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a colored circle if flag fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs text-blue-600 font-medium">
                        {location.state.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">{location.state}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{location.percentage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(location.percentage)}`}
                  style={{ width: `${Math.min(location.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 flex justify-end flex-shrink-0">
          <div className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
            <span>View Full Report</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}