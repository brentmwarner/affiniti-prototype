"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import { Card, CardContent } from "../ui/card"
import { ChartConfig, ChartContainer } from "../ui/chart"

const chartData = [
  { members: 105, fill: "#818cf8" }, // indigo-400
]

const chartConfig = {
  members: {
    label: "Members",
    color: "#818cf8",
  },
} satisfies ChartConfig

export function PastDueMembersCard() {
  return (
    <Card className="overflow-hidden border-0 h-full [background:linear-gradient(180deg,rgba(249,250,251,0)_35%,rgba(243,244,246,0.3)_80%)]" style={{ boxShadow: '0 0 2px 0 #afb2ce8f, 0 1px 4px 0 #0404341a' }}>
      <CardContent className="flex flex-col items-start gap-6 p-6 h-full">
        <div className="flex flex-col items-start gap-2 w-full">
          <span className="text-base text-gray-600 leading-6">Past Due Members</span>
        </div>

        <div className="w-full flex justify-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[250px] w-[250px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={180}
              innerRadius={80}
              outerRadius={110}
              width={250}
              height={250}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar 
                dataKey="members" 
                background 
                cornerRadius={10}
                fill="#818cf8"
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {chartData[0].members.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Members
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}