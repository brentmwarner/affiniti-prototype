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
  { date: "2024-04-01", student: 25, pharmacy: 150, corporate: 80 },
  { date: "2024-04-02", student: 28, pharmacy: 162, corporate: 85 },
  { date: "2024-04-03", student: 22, pharmacy: 158, corporate: 78 },
  { date: "2024-04-04", student: 30, pharmacy: 175, corporate: 92 },
  { date: "2024-04-05", student: 35, pharmacy: 180, corporate: 95 },
  { date: "2024-04-06", student: 32, pharmacy: 185, corporate: 88 },
  { date: "2024-04-07", student: 27, pharmacy: 172, corporate: 82 },
  { date: "2024-04-08", student: 38, pharmacy: 195, corporate: 105 },
  { date: "2024-04-09", student: 20, pharmacy: 165, corporate: 75 },
  { date: "2024-04-10", student: 29, pharmacy: 178, corporate: 90 },
  { date: "2024-04-11", student: 34, pharmacy: 188, corporate: 98 },
  { date: "2024-04-12", student: 31, pharmacy: 182, corporate: 87 },
  { date: "2024-04-13", student: 36, pharmacy: 192, corporate: 102 },
  { date: "2024-04-14", student: 24, pharmacy: 168, corporate: 79 },
  { date: "2024-04-15", student: 19, pharmacy: 155, corporate: 72 },
  { date: "2024-04-16", student: 26, pharmacy: 170, corporate: 84 },
  { date: "2024-04-17", student: 40, pharmacy: 198, corporate: 108 },
  { date: "2024-04-18", student: 42, pharmacy: 205, corporate: 112 },
  { date: "2024-04-19", student: 28, pharmacy: 175, corporate: 89 },
  { date: "2024-04-20", student: 21, pharmacy: 160, corporate: 76 },
  { date: "2024-04-21", student: 27, pharmacy: 172, corporate: 85 },
  { date: "2024-04-22", student: 25, pharmacy: 165, corporate: 80 },
  { date: "2024-04-23", student: 33, pharmacy: 185, corporate: 94 },
  { date: "2024-04-24", student: 45, pharmacy: 210, corporate: 118 },
  { date: "2024-04-25", student: 38, pharmacy: 195, corporate: 105 },
  { date: "2024-04-26", student: 17, pharmacy: 145, corporate: 68 },
  { date: "2024-04-27", student: 48, pharmacy: 220, corporate: 125 },
  { date: "2024-04-28", student: 24, pharmacy: 168, corporate: 82 },
  { date: "2024-04-29", student: 35, pharmacy: 188, corporate: 96 },
  { date: "2024-04-30", student: 50, pharmacy: 225, corporate: 130 },
  { date: "2024-05-01", student: 29, pharmacy: 175, corporate: 88 },
  { date: "2024-05-02", student: 39, pharmacy: 198, corporate: 108 },
  { date: "2024-05-03", student: 32, pharmacy: 182, corporate: 92 },
  { date: "2024-05-04", student: 46, pharmacy: 215, corporate: 122 },
  { date: "2024-05-05", student: 52, pharmacy: 235, corporate: 135 },
  { date: "2024-05-06", student: 55, pharmacy: 248, corporate: 142 },
  { date: "2024-05-07", student: 42, pharmacy: 205, corporate: 115 },
  { date: "2024-05-08", student: 23, pharmacy: 165, corporate: 78 },
  { date: "2024-05-09", student: 28, pharmacy: 178, corporate: 86 },
  { date: "2024-05-10", student: 38, pharmacy: 195, corporate: 105 },
  { date: "2024-05-11", student: 35, pharmacy: 188, corporate: 98 },
  { date: "2024-05-12", student: 27, pharmacy: 172, corporate: 85 },
  { date: "2024-05-13", student: 22, pharmacy: 158, corporate: 75 },
  { date: "2024-05-14", student: 58, pharmacy: 252, corporate: 148 },
  { date: "2024-05-15", student: 53, pharmacy: 238, corporate: 138 },
  { date: "2024-05-16", student: 44, pharmacy: 210, corporate: 118 },
  { date: "2024-05-17", student: 62, pharmacy: 265, corporate: 155 },
  { date: "2024-05-18", student: 39, pharmacy: 195, corporate: 108 },
  { date: "2024-05-19", student: 28, pharmacy: 172, corporate: 86 },
  { date: "2024-05-20", student: 25, pharmacy: 165, corporate: 82 },
  { date: "2024-05-21", student: 18, pharmacy: 142, corporate: 68 },
  { date: "2024-05-22", student: 16, pharmacy: 135, corporate: 65 },
  { date: "2024-05-23", student: 34, pharmacy: 185, corporate: 95 },
  { date: "2024-05-24", student: 30, pharmacy: 175, corporate: 88 },
  { date: "2024-05-25", student: 26, pharmacy: 168, corporate: 84 },
  { date: "2024-05-26", student: 21, pharmacy: 155, corporate: 76 },
  { date: "2024-05-27", student: 56, pharmacy: 245, corporate: 142 },
  { date: "2024-05-28", student: 27, pharmacy: 172, corporate: 85 },
  { date: "2024-05-29", student: 19, pharmacy: 148, corporate: 72 },
  { date: "2024-05-30", student: 43, pharmacy: 205, corporate: 115 },
  { date: "2024-05-31", student: 29, pharmacy: 175, corporate: 88 },
  { date: "2024-06-01", student: 26, pharmacy: 168, corporate: 84 },
  { date: "2024-06-02", student: 52, pharmacy: 235, corporate: 135 },
  { date: "2024-06-03", student: 22, pharmacy: 158, corporate: 76 },
  { date: "2024-06-04", student: 48, pharmacy: 225, corporate: 128 },
  { date: "2024-06-05", student: 18, pharmacy: 145, corporate: 70 },
  { date: "2024-06-06", student: 32, pharmacy: 182, corporate: 92 },
  { date: "2024-06-07", student: 38, pharmacy: 195, corporate: 105 },
  { date: "2024-06-08", student: 43, pharmacy: 208, corporate: 118 },
  { date: "2024-06-09", student: 60, pharmacy: 258, corporate: 152 },
  { date: "2024-06-10", student: 28, pharmacy: 172, corporate: 86 },
  { date: "2024-06-11", student: 21, pharmacy: 155, corporate: 75 },
  { date: "2024-06-12", student: 65, pharmacy: 268, corporate: 158 },
  { date: "2024-06-13", student: 19, pharmacy: 148, corporate: 72 },
  { date: "2024-06-14", student: 53, pharmacy: 238, corporate: 138 },
  { date: "2024-06-15", student: 40, pharmacy: 198, corporate: 108 },
  { date: "2024-06-16", student: 46, pharmacy: 215, corporate: 122 },
  { date: "2024-06-17", student: 68, pharmacy: 275, corporate: 165 },
  { date: "2024-06-18", student: 23, pharmacy: 162, corporate: 78 },
  { date: "2024-06-19", student: 38, pharmacy: 195, corporate: 105 },
  { date: "2024-06-20", student: 55, pharmacy: 248, corporate: 142 },
  { date: "2024-06-21", student: 29, pharmacy: 175, corporate: 88 },
  { date: "2024-06-22", student: 34, pharmacy: 188, corporate: 96 },
  { date: "2024-06-23", student: 72, pharmacy: 285, corporate: 172 },
  { date: "2024-06-24", student: 25, pharmacy: 168, corporate: 82 },
  { date: "2024-06-25", student: 27, pharmacy: 172, corporate: 85 },
  { date: "2024-06-26", student: 54, pharmacy: 242, corporate: 140 },
  { date: "2024-06-27", student: 62, pharmacy: 265, corporate: 155 },
  { date: "2024-06-28", student: 30, pharmacy: 178, corporate: 88 },
  { date: "2024-06-29", student: 21, pharmacy: 155, corporate: 75 },
  { date: "2024-06-30", student: 58, pharmacy: 258, corporate: 148 },
]

const chartConfig = {
  members: {
    label: "Members",
  },
  student: {
    label: "Student Membership",
    color: "hsl(12 76% 61%)",
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
    <Card className="pt-0">
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
          className="h-[486px] w-full [&_.recharts-cartesian-axis-tick-value]:fill-gray-400"
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
              <linearGradient id="fillStudent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-student)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-student)"
                  stopOpacity={0.1}
                />
              </linearGradient>
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
              dataKey="student"
              type="natural"
              fill="url(#fillStudent)"
              fillOpacity={0.4}
              stroke="var(--color-student)"
              stackId="a"
            />
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
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}