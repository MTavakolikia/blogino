"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface LineChartProps {
    title: string;
    description?: string;
    data: any[];
    config: ChartConfig;
    xAxisKey: string;
    lines: { dataKey: string; color: string }[];
    footerText?: string;
}

const LineChartComponent: React.FC<LineChartProps> = ({
    title,
    description,
    data,
    config,
    xAxisKey,
    lines,
    footerText,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <ChartContainer config={config}>
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={xAxisKey}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        {lines.map((line, index) => (
                            <Line
                                key={index}
                                dataKey={line.dataKey}
                                type="monotone"
                                stroke={line.color}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ChartContainer>
            </CardContent>
            {footerText && (
                <CardFooter>
                    <div className="flex w-full items-start gap-2 text-sm">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 font-medium leading-none">
                                {footerText} <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                Showing total visitors for the last 6 months
                            </div>
                        </div>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};

export default LineChartComponent;
