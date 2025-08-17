import { promises as fs } from 'fs';
import path from 'path';
import { JourneyEpisode } from '@/lib/types';
import { EpisodeCard } from '../components/episodeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCommitHorizontal, AlertTriangle, CalendarDays, Rocket } from 'lucide-react';

// A helper component for our summary stats
const InfoCard = ({ title, value, icon, subtext }: { title: string, value: string | number, icon: React.ElementType, subtext: string }) => {
  const Icon = icon;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </CardContent>
    </Card>
  )
}

export default async function EpisodesPage() {
  const filePath = path.join(process.cwd(), 'public/episode.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  const { journey_episodes }: { journey_episodes: JourneyEpisode[] } = JSON.parse(jsonData);

  // --- Calculate Summary Metrics ---
  const totalEpisodes = journey_episodes.length;
  const totalFrictionPoints = journey_episodes.reduce((acc, ep) => acc + (ep.friction_points?.length || 0), 0);
  
  // Calculate total duration
  const firstDateStr = journey_episodes[0].date_range.split(' to ')[0];
  const lastDateStr = journey_episodes[journey_episodes.length - 1].date_range.split(' to ')[1];
  const startDate = new Date(firstDateStr);
  const endDate = new Date(lastDateStr);
  const totalJourneyDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const finalOutcome = journey_episodes[journey_episodes.length - 1].outcome;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Journey Timeline</h1>
        <p className="text-muted-foreground">
          A chronological summary of key events and turning points in the journey.
        </p>
      </div>

      {/* Summary Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InfoCard 
          title="Total Journey Duration" 
          value={`${totalJourneyDays} Days`} 
          icon={CalendarDays}
          subtext={`From ${startDate.toLocaleDateString()}`}
        />
        <InfoCard 
          title="Journey Episodes" 
          value={totalEpisodes} 
          icon={GitCommitHorizontal}
          subtext="Key phases analyzed"
        />
        <InfoCard 
          title="Friction Points Resolved" 
          value={totalFrictionPoints} 
          icon={AlertTriangle}
          subtext="Obstacles overcome"
        />
        <InfoCard 
          title="Final Outcome" 
          value={finalOutcome} 
          icon={Rocket}
          subtext="Latest status achieved"
        />
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 before:absolute before:left-6 before:top-0 before:h-full before:w-px before:bg-border">
        {journey_episodes.map((episode, index) => (
          <div key={episode.episode_number} className="relative pb-8">
            {/* Timeline Dot */}
            <div className="absolute left-[20.5px] top-3 z-10 -translate-x-1/2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                    {episode.episode_number}
                </span>
            </div>
            {/* Episode Card */}
            <div className="pl-8">
              <EpisodeCard episode={episode} index={index} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}