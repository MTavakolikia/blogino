"use client";

import { TrendingUp } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig as ChartConfigType,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
    likes: {
        label: "Likes received",
        color: "hsl(var(--chart-1))",
    },
    comments: {
        label: "Comments written",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfigType;

export default function EngagementChart({
    data,
}: {
    data: { month: string; likes: number; comments: number }[];
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your engagement</CardTitle>
                <CardDescription>
                    Monthly likes on your posts and comments you've written, over
                    the last 12 months.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-72 w-full">
                    <AreaChart data={data} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value: string) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Area
                            type="monotone"
                            dataKey="likes"
                            stroke="var(--color-likes)"
                            fill="var(--color-likes)"
                            fillOpacity={0.15}
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="comments"
                            stroke="var(--color-comments)"
                            fill="var(--color-comments)"
                            fillOpacity={0.15}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardContent className="border-t border-border/60 p-5 pt-4">
                <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="font-medium">Engagement overview</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                        Updated live from your activity
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
