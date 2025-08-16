import { promises as fs } from 'fs';
import path from 'path';
import { JourneyEpisode } from '@/lib/types';
import { EpisodeCard } from '../components/episodeCard';

export default async function EpisodesPage() {
  const filePath = path.join(process.cwd(), 'public/episode.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  // We only need the episodes array from the larger analysis object
  const { journey_episodes }: { journey_episodes: JourneyEpisode[] } = JSON.parse(jsonData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Journey Episodes</h1>
        <p className="text-muted-foreground">
          A chronological summary of key events and turning points in the journey.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {journey_episodes.map((episode) => (
          <EpisodeCard key={episode.episode_number} episode={episode} />
        ))}
      </div>
    </div>
  );
}