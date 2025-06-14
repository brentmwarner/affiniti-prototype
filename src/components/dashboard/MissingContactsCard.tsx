"use client"

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts"

import { Card, CardContent } from "../ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"

const chartData = [
  { contact: "Email address", missing: 45 },
  { contact: "Phone Number", missing: 27 },
  { contact: "Mailing Address", missing: 12 },
]

const chartConfig = {
  missing: {
    label: "Missing",
    color: "#818cf8", // indigo-400
  },
} satisfies ChartConfig

export function MissingContactsCard() {
  return (
    <Card className="overflow-hidden border-0 h-full [background:linear-gradient(180deg,rgba(249,250,251,0)_35%,rgba(243,244,246,0.3)_80%)]" style={{ boxShadow: '0 0 2px 0 #afb2ce8f, 0 1px 4px 0 #0404341a' }}>
      <CardContent className="flex flex-col items-start gap-6 p-6 h-full">
        <div className="flex flex-col items-start gap-2 w-full">
          <span className="text-base text-gray-600 leading-6">Missing Contacts</span>
        </div>

        <div className="w-full flex-1 flex flex-col">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 0,
                right: 50,
                top: 10,
                bottom: 10,
              }}
            >
              <XAxis type="number" dataKey="missing" hide />
              <YAxis
                dataKey="contact"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-sm text-gray-600"
                width={120}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar 
                dataKey="missing" 
                fill="#818cf8" 
                radius={4}
                barSize={32}
              >
                <LabelList
                  dataKey="missing"
                  position="right"
                  className="fill-gray-500 text-sm font-medium"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
          
          <div className="mt-4 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm leading-5 font-medium text-gray-600">Total Missing Data</span>
              <span className="text-sm leading-5 font-normal text-gray-500">72</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}