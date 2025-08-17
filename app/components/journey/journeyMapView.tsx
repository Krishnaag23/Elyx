"use client";

import { useState } from 'react';
import { JourneyEpisode } from '@/lib/types';
import { CustomVerticalTimeline } from './journeyTimeline';
import { EpisodeDetailSheet } from './episodeDetail';
import { Skeleton } from '@/components/ui/skeleton';

interface JourneyMapViewProps {
    episodes: JourneyEpisode[];
}

export function JourneyMapView({ episodes }: JourneyMapViewProps) {
    const [selectedEpisode, setSelectedEpisode] = useState<JourneyEpisode | null>(null);

    const handleSelectEpisode = (episodeId: number) => {
        const episode = episodes.find(ep => ep.episode_number === episodeId);
        if (episode) {
            setSelectedEpisode(episode);
        }
    };

    const handleSheetOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setSelectedEpisode(null);
        }
    }

    return (
        <>
            {episodes.length > 0 ? (
                // <-- CHANGE HERE
                <CustomVerticalTimeline episodes={episodes} onSelectItem={handleSelectEpisode} />
            ) : (
                <div className="space-y-4">
                    <Skeleton className="w-full h-24" />
                    <Skeleton className="w-full h-24" />
                    <Skeleton className="w-full h-24" />
                </div>
            )}

            <EpisodeDetailSheet 
                episode={selectedEpisode}
                isOpen={!!selectedEpisode}
                onOpenChange={handleSheetOpenChange}
            />
        </>
    )
}