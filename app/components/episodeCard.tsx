import { JourneyEpisode } from "@/lib/types"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, User, Zap, CheckCircle } from "lucide-react";

export function EpisodeCard({ episode }: { episode: JourneyEpisode }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{episode.title}</CardTitle>
          <Badge variant="outline">#{episode.episode_number}</Badge>
        </div>
        <CardDescription>{episode.date_range}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" /> Primary Goal
          </h4>
          <p className="text-sm text-muted-foreground">{episode.primary_goal}</p>
        </div>
        
        {episode.friction_points.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" /> Friction Points
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {episode.friction_points.map((point, index) => (
                <li key={index}>
                  <strong className="text-foreground/80">{point.type}:</strong> {point.description}
                  <br />
                  <span className="text-xs text-emerald-500">Resolution: {point.resolution}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto bg-muted/40 p-4 border-t">
        <div className="w-full">
           <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Outcome</h4>
           <p className="font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" /> {episode.outcome}
           </p>
        </div>
      </CardFooter>
    </Card>
  );
}