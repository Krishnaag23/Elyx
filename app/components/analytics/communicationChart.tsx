"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CommunicationPatterns } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

// Enhanced colors for the chart
const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary) / 0.8)",
  "hsl(var(--primary) / 0.6)",
  "hsl(var(--primary) / 0.4)",
  "hsl(var(--muted-foreground))",
  "hsl(var(--muted-foreground) / 0.6)",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export function CommunicationChart({ data }: { data: CommunicationPatterns }) {
  const interactionTypeData = Object.entries(data.interaction_types).map(
    ([name, value]) => ({
      // Prettify the name: status_updates -> Status Updates
      name: name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      value,
    })
  );

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="md:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Interaction Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Pie
                  data={interactionTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {interactionTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Interaction Balance
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {data.member_initiated_interactions}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                Member
              </span>
            </p>
            <p className="text-2xl font-bold">
              {data.team_initiated_interactions}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                Team
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Peak Communication
            </CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-disc pl-4">
              {data.communication_frequency.peak_periods.map((period) => (
                <li key={period}>{period}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
