import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  description?: string;
  icon?: LucideIcon;
  customColor?: "red" | "green" | "blue" | "orange";
}

export function MetricCard({
  title,
  value,
  trend,
  description,
  icon: Icon,
  customColor,
}: MetricCardProps) {
  const TrendIcon = trend?.direction === "up" ? TrendingUp : TrendingDown;
  const trendColorClasses =
    trend?.direction === "up"
      ? {
          badge: "border-none",
          icon: "text-green-700",
          text: "text-green-700",
        }
      : {
          badge: "border-none",
          icon: "text-red-700",
          text: "text-red-700",
        };

  // Function to render value with superscript decimals
  const renderValueWithSuperscript = (val: string | number) => {
    const stringValue = typeof val === "number" ? val.toLocaleString() : val;
    
    // Only apply superscript to monetary values (starting with $)
    if (stringValue.includes('.') && stringValue.startsWith('$')) {
      const [integerPart, decimalPart] = stringValue.split('.');
      return (
        <>
          {integerPart}.
          <sup className="text-lg">{decimalPart}</sup>
        </>
      );
    }
    
    return stringValue;
  };

  return (
    <Card className="overflow-hidden border-0 [background:linear-gradient(180deg,rgba(249,250,251,0)_35%,rgba(243,244,246,0.3)_80%)]" style={{ boxShadow: '0 0 2px 0 #afb2ce8f, 0 1px 4px 0 #0404341a' }}>
      <CardContent className="flex flex-col items-start gap-6 p-6">
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-base text-gray-600 leading-6">{title}</span>
            </div>

            {trend && (
              <Badge
                variant="outline"
                className={`${trendColorClasses.badge} px-2.5 py-0.5 flex items-center gap-1`}
              >
                <TrendIcon className={`w-3 h-3 ${trendColorClasses.icon}`} />
                <span
                  className={`text-sm font-medium ${trendColorClasses.text}`}
                >
                  {trend.value}%
                </span>
              </Badge>
            )}
          </div>

          <h2 className={`text-3xl leading-9 tracking-[-0.75px] font-normal ${
            customColor === "red" ? "text-red-700" : "text-gray-900"
          }`}>
            {renderValueWithSuperscript(value)}
          </h2>
        </div>

        {description && (
          <div className="flex flex-col items-start gap-1.5 w-full">
            <p className="text-sm leading-5 text-gray-400">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}