"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const chartData = [
  { date: "2024-04-01", pharmacy: 150, corporate: 80 },
  { date: "2024-04-02", pharmacy: 162, corporate: 85 },
  { date: "2024-04-03", pharmacy: 158, corporate: 78 },
  { date: "2024-04-04", pharmacy: 175, corporate: 92 },
  { date: "2024-04-05", pharmacy: 180, corporate: 95 },
  { date: "2024-04-06", pharmacy: 185, corporate: 88 },
  { date: "2024-04-07", pharmacy: 172, corporate: 82 },
  { date: "2024-04-08", pharmacy: 195, corporate: 105 },
  { date: "2024-04-09", pharmacy: 165, corporate: 75 },
  { date: "2024-04-10", pharmacy: 178, corporate: 90 },
  { date: "2024-04-11", pharmacy: 188, corporate: 98 },
  { date: "2024-04-12", pharmacy: 182, corporate: 87 },
  { date: "2024-04-13", pharmacy: 192, corporate: 102 },
  { date: "2024-04-14", pharmacy: 168, corporate: 79 },
  { date: "2024-04-15", pharmacy: 155, corporate: 72 },
  { date: "2024-04-16", pharmacy: 170, corporate: 84 },
  { date: "2024-04-17", pharmacy: 198, corporate: 108 },
  { date: "2024-04-18", pharmacy: 205, corporate: 112 },
  { date: "2024-04-19", pharmacy: 175, corporate: 89 },
  { date: "2024-04-20", pharmacy: 160, corporate: 76 },
  { date: "2024-04-21", pharmacy: 172, corporate: 85 },
  { date: "2024-04-22", pharmacy: 165, corporate: 80 },
  { date: "2024-04-23", pharmacy: 185, corporate: 94 },
  { date: "2024-04-24", pharmacy: 210, corporate: 118 },
  { date: "2024-04-25", pharmacy: 195, corporate: 105 },
  { date: "2024-04-26", pharmacy: 130, corporate: 62 },
  { date: "2024-04-27", pharmacy: 220, corporate: 125 },
  { date: "2024-04-28", pharmacy: 168, corporate: 82 },
  { date: "2024-04-29", pharmacy: 188, corporate: 96 },
  { date: "2024-04-30", pharmacy: 225, corporate: 130 },
  { date: "2024-05-01", pharmacy: 175, corporate: 88 },
  { date: "2024-05-02", pharmacy: 198, corporate: 108 },
  { date: "2024-05-03", pharmacy: 182, corporate: 92 },
  { date: "2024-05-04", pharmacy: 215, corporate: 122 },
  { date: "2024-05-05", pharmacy: 235, corporate: 135 },
  { date: "2024-05-06", pharmacy: 248, corporate: 142 },
  { date: "2024-05-07", pharmacy: 205, corporate: 115 },
  { date: "2024-05-08", pharmacy: 165, corporate: 78 },
  { date: "2024-05-09", pharmacy: 178, corporate: 86 },
  { date: "2024-05-10", pharmacy: 195, corporate: 105 },
  { date: "2024-05-11", pharmacy: 188, corporate: 98 },
  { date: "2024-05-12", pharmacy: 172, corporate: 85 },
  { date: "2024-05-13", pharmacy: 158, corporate: 75 },
  { date: "2024-05-14", pharmacy: 252, corporate: 148 },
  { date: "2024-05-15", pharmacy: 238, corporate: 138 },
  { date: "2024-05-16", pharmacy: 210, corporate: 118 },
  { date: "2024-05-17", pharmacy: 265, corporate: 155 },
  { date: "2024-05-18", pharmacy: 195, corporate: 108 },
  { date: "2024-05-19", pharmacy: 172, corporate: 86 },
  { date: "2024-05-20", pharmacy: 165, corporate: 82 },
  { date: "2024-05-21", pharmacy: 125, corporate: 58 },
  { date: "2024-05-22", pharmacy: 115, corporate: 55 },
  { date: "2024-05-23", pharmacy: 185, corporate: 95 },
  { date: "2024-05-24", pharmacy: 175, corporate: 88 },
  { date: "2024-05-25", pharmacy: 168, corporate: 84 },
  { date: "2024-05-26", pharmacy: 155, corporate: 76 },
  { date: "2024-05-27", pharmacy: 245, corporate: 142 },
  { date: "2024-05-28", pharmacy: 172, corporate: 85 },
  { date: "2024-05-29", pharmacy: 148, corporate: 72 },
  { date: "2024-05-30", pharmacy: 205, corporate: 115 },
  { date: "2024-05-31", pharmacy: 175, corporate: 88 },
  { date: "2024-06-01", pharmacy: 168, corporate: 84 },
  { date: "2024-06-02", pharmacy: 235, corporate: 135 },
  { date: "2024-06-03", pharmacy: 138, corporate: 66 },
  { date: "2024-06-04", pharmacy: 225, corporate: 128 },
  { date: "2024-06-05", pharmacy: 145, corporate: 70 },
  { date: "2024-06-06", pharmacy: 182, corporate: 92 },
  { date: "2024-06-07", pharmacy: 195, corporate: 105 },
  { date: "2024-06-08", pharmacy: 208, corporate: 118 },
  { date: "2024-06-09", pharmacy: 258, corporate: 152 },
  { date: "2024-06-10", pharmacy: 172, corporate: 86 },
  { date: "2024-06-11", pharmacy: 155, corporate: 75 },
  { date: "2024-06-12", pharmacy: 268, corporate: 158 },
  { date: "2024-06-13", pharmacy: 148, corporate: 72 },
  { date: "2024-06-14", pharmacy: 238, corporate: 138 },
  { date: "2024-06-15", pharmacy: 198, corporate: 108 },
  { date: "2024-06-16", pharmacy: 215, corporate: 122 },
  { date: "2024-06-17", pharmacy: 275, corporate: 165 },
  { date: "2024-06-18", pharmacy: 140, corporate: 68 },
  { date: "2024-06-19", pharmacy: 195, corporate: 105 },
  { date: "2024-06-20", pharmacy: 248, corporate: 142 },
  { date: "2024-06-21", pharmacy: 175, corporate: 88 },
  { date: "2024-06-22", pharmacy: 188, corporate: 96 },
  { date: "2024-06-23", pharmacy: 285, corporate: 172 },
  { date: "2024-06-24", pharmacy: 168, corporate: 82 },
  { date: "2024-06-25", pharmacy: 172, corporate: 85 },
  { date: "2024-06-26", pharmacy: 242, corporate: 140 },
  { date: "2024-06-27", pharmacy: 265, corporate: 155 },
  { date: "2024-06-28", pharmacy: 178, corporate: 88 },
  { date: "2024-06-29", pharmacy: 155, corporate: 75 },
  { date: "2024-06-30", pharmacy: 258, corporate: 148 },
]

const chartConfig = {
  members: {
    label: "Members",
  },
  pharmacy: {
    label: "Pharmacy Membership",
    color: "hsl(238 75% 65%)",
  },
  corporate: {
    label: "Corporate Membership",
    color: "hsl(188 94% 68%)",
  },
} satisfies ChartConfig

// Custom legend component with circles
const CustomLegend = () => {
  return (
    <div className="flex items-center justify-center gap-4 pt-3">
      <div className="flex items-center gap-1.5">
        <span className="text-xs leading-4 font-normal text-gray-500">Corporate Membership</span>
        <div
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: "hsl(188 94% 68%)" }}
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs leading-4 font-normal text-gray-500">Pharmacy Membership</span>
        <div
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: "hsl(238 75% 65%)" }}
        />
      </div>
    </div>
  )
}

export function MembershipPerformanceChart() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const getFilteredData = () => {
    if (timeRange === "180d") {
      // 6 months: Show 6 monthly data points
      const targetDates = [
        "2024-04-15", "2024-05-01", "2024-05-15", 
        "2024-06-01", "2024-06-15", "2024-06-30"
      ]
      return chartData.filter((item) => targetDates.includes(item.date))
    } else if (timeRange === "90d") {
      // 3 months: Show 6 data points (every 15 days approximately)
      const targetDates = [
        "2024-04-15", "2024-04-30", "2024-05-15", 
        "2024-05-30", "2024-06-15", "2024-06-30"
      ]
      return chartData.filter((item) => targetDates.includes(item.date))
    } else if (timeRange === "30d") {
      // 30 days: Show 6 data points (every 5 days)
      const targetDates = [
        "2024-06-01", "2024-06-06", "2024-06-11", 
        "2024-06-16", "2024-06-25", "2024-06-30"
      ]
      return chartData.filter((item) => targetDates.includes(item.date))
    }
    
    return chartData.slice(-6) // fallback
  }

  const filteredData = getFilteredData()

  return (
    <Card className="pt-0 border-0" style={{ boxShadow: '0 0 2px 0 #afb2ce8f, 0 1px 4px 0 #0404341a' }}>
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Membership Type Performance</CardTitle>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="180d" className="rounded-lg">
              Last 6 months
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer 
          config={chartConfig}
          className="h-[350px] w-full [&_.recharts-cartesian-axis-tick-value]:fill-gray-400"
        >
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                if (timeRange === "180d") {
                  // 6 months: Show month names
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                  })
                } else if (timeRange === "90d") {
                  // 3 months: Show month and day
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                } else {
                  // 30 days: Show month and day
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${value / 1000}K`
                }
                return value.toString()
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillPharmacy" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pharmacy)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pharmacy)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCorporate" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-corporate)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-corporate)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="corporate"
              type="natural"
              fill="url(#fillCorporate)"
              fillOpacity={0.4}
              stroke="var(--color-corporate)"
              stackId="a"
            />
            <Area
              dataKey="pharmacy"
              type="natural"
              fill="url(#fillPharmacy)"
              fillOpacity={0.4}
              stroke="var(--color-pharmacy)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
        <CustomLegend />
      </CardContent>
    </Card>
  )
}