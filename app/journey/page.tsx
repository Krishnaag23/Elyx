import { promises as fs } from "fs";
import path from "path";
import { HealthJourneyAnalysis } from "@/lib/types";
import { JourneyMapView } from "../components/journey/journeyMapView";

export default async function JourneyPage() {
  const filePath = path.join(process.cwd(), "public/episode.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const analysisData: HealthJourneyAnalysis = JSON.parse(jsonData);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Interactive Journey Map
        </h1>
        <p className="text-muted-foreground">
          An interactive Gantt chart of key episodes. Click any episode to see
          details.
        </p>
      </div>

      {/* Pass the data to our client component wrapper */}
      <div className="flex-grow">
        <JourneyMapView episodes={analysisData.journey_episodes || []} />
      </div>
    </div>
  );
}
