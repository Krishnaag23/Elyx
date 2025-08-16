import { promises as fs } from "fs";
import path from "path";
import { JourneyAnalysis } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ArrowDown, Users, BarChart } from "lucide-react";

// A simple, reusable stat card component
function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// This is an async Server Component, perfect for data fetching.
export default async function OverviewPage() {
  const filePath = path.join(process.cwd(), "public/episode.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const analysis: JourneyAnalysis = JSON.parse(jsonData);

  const { outcome_metrics, communication_patterns } = analysis;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Journey Overview</h1>
        <p className="text-muted-foreground">
          High-level outcomes and engagement metrics for{" "}
          {analysis.member_profile.name}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="ApoB Reduction"
          value={`${outcome_metrics.biomarker_improvements.apoB.improvement_percent}%`}
          description="Significant risk reduction"
          icon={ArrowDown}
        />
        <StatCard
          title="Blood Pressure"
          value={outcome_metrics.biomarker_improvements.blood_pressure.current}
          description={`From ${outcome_metrics.biomarker_improvements.blood_pressure.baseline}`}
          icon={CheckCircle}
        />
        <StatCard
          title="Total Interactions"
          value={String(communication_patterns.total_interactions)}
          description={`${communication_patterns.member_initiated_interactions} initiated by member`}
          icon={Users}
        />
        <StatCard
          title="Avg. Response Time"
          value={`${communication_patterns.average_response_time_minutes.toFixed(
            1
          )} min`}
          description="Team responsiveness metric"
          icon={BarChart}
        />
      </div>

      {/* We can add more components here to display other sections of the JSON */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Turning Points</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {/* This assumes a program_evolution_insights key exists */}
              
              {analysis.program_evolution_insights.key_turning_points.map(
                (point: string, i : number) => (
                  <li key={i}>{point}</li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Success Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {/* This assumes a program_evolution_insights key exists */}
              {analysis.program_evolution_insights.sustainability_factors.map(
                (factor : string, i : number) => (
                  <li key={i}>{factor}</li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
