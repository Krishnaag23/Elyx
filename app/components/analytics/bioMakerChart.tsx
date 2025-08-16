"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', ApoB: 125, hsCRP: 3.1 },
  { name: 'Feb', ApoB: 122, hsCRP: 2.9 },
  { name: 'Mar', ApoB: 118, hsCRP: 2.5 },
  { name: 'Apr', ApoB: 115, hsCRP: 2.0 },
  { name: 'May', ApoB: 110, hsCRP: 1.5 },
  { name: 'Jun', ApoB: 106, hsCRP: 1.1 },
];

export function BiomarkerChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
        <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
          }}
        />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="ApoB" stroke="hsl(var(--primary))" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" dataKey="hsCRP" stroke="hsl(var(--accent))" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}