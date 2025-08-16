"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CommunicationPatterns } from '@/lib/types';

export function CommunicationChart({ data }: { data: CommunicationPatterns }) {
  const chartData = [
    { name: 'Member Initiated', value: data.member_initiated_interactions },
    { name: 'Team Initiated', value: data.team_initiated_interactions },
    { name: 'Total', value: data.total_interactions },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
        <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" width={120} />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
          contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
        />
        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}