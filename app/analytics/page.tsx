// app/analytics/page.tsx
import { promises as fs } from "fs";
import path from "path";
import { JourneyEvent, HealthJourneyAnalysis } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BiomarkerChart } from "../components/analytics/bioMakerChart";
import { FrictionTable } from "../components/analytics/frictionTable";
import { CommunicationChart } from "../components/analytics/communicationChart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default async function AnalyticsPage() {
  // Fetch and process data on the server
  const msgPath = path.join(process.cwd(), "public/journey_log.json");
  const epPath = path.join(process.cwd(), "public/episode.json");
  const msgData = await fs.readFile(msgPath, "utf-8");
  const epData = await fs.readFile(epPath, "utf-8");
  const messages: JourneyEvent[] = JSON.parse(msgData);
  const episodes: HealthJourneyAnalysis = JSON.parse(epData);
  
  const memberMessages = messages.filter(
    (m) => m.senderRole === "Member"
  ).length;
  const teamMessages = messages.length - memberMessages;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground">
            Analyze trends, track metrics, and generate journey summaries.
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Generate PDF Report
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="biomarkers">Biomarkers</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="friction">Friction</TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="mt-4 grid gap-4 md:grid-cols-5"
        >
          <Card>
            <CardHeader>
              <CardTitle>Total Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{messages.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Member vs. Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {memberMessages}{" "}
                <span className="text-sm text-muted-foreground">Member</span>
              </p>
              <p className="text-2xl font-bold">
                {teamMessages}{" "}
                <span className="text-sm text-muted-foreground">Team</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Identified Friction Points</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <p className="text-4xl font-bold text-destructive">
                {totalFrictionPoints}
              </p> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biomarkers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Biomarker Trends</CardTitle>
              <CardDescription>
                Mock data showing progress over 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BiomarkerChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-4">
          {/* You could add another chart here for team engagement */}
          <p className="text-muted-foreground">
            Engagement metrics coming soon.
          </p>
        </TabsContent>

        <TabsContent value="communication" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Patterns</CardTitle>
              <CardDescription>
                Visualizing the flow of conversation between Rohan and the Elyx
                team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Pass the relevant data to the client component */}
              <CommunicationChart data={episodes.communication_patterns} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="friction" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Friction Point Analysis</CardTitle>
              <CardDescription>
                Identifying and resolving obstacles in the member journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FrictionTable
                data={episodes.journey_episodes?.map((journey) =>
                  journey.friction_points?.map((friction) => friction)
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
