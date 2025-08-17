"use client";

import { JourneyEpisode } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

// --- Helper Function to derive chips from episode data ---
const generateChips = (episode: JourneyEpisode): string[] => {
  const chipSet = new Set<string>();

  // From title
  const titleKeywords = [
    "Onboarding",
    "Sleep",
    "Travel",
    "Data",
    "Results",
    "Review",
    "Stress",
    "Optimization",
  ];
  titleKeywords.forEach((keyword) => {
    if (episode.title.toLowerCase().includes(keyword.toLowerCase())) {
      chipSet.add(keyword);
    }
  });

  // From friction points
  episode.friction_points?.forEach((fp) => {
    const type = fp.type.split(" ")[0]; // e.g., "Process Complexity" -> "Process"
    chipSet.add(type);
  });

  // From goal
  if (episode.primary_goal.toLowerCase().includes("apob")) chipSet.add("ApoB");
  if (episode.primary_goal.toLowerCase().includes("blood pressure"))
    chipSet.add("BP");

  return Array.from(chipSet).slice(0, 4); // Return max 4 chips
};

// --- The Timeline Item Component ---
interface TimelineItemProps {
  episode: JourneyEpisode;
  index: number;
  onSelect: (episodeId: number) => void;
}

function TimelineItem({ episode, index, onSelect }: TimelineItemProps) {
  const isLeft = index % 2 === 0;
  const chips = useMemo(() => generateChips(episode), [episode]);
  // const monthYear = new Date(
  // episode.date_range.split(" to ")[0]
  // ).toLocaleString("default", { month: "long", year: "numeric" });

  const cardVariants = {
    hidden: { opacity: 0, x: isLeft ? -100 : 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 50, damping: 15 },
    },
  };

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-x-4">
      {/* Left Card or Spacer */}
      {isLeft ? (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{episode.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {episode.primary_goal}
              </p>
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <Badge key={chip} variant="secondary">
                    {chip}
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => onSelect(episode.episode_number)}
              >
                Open Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div />
      )}

      {/* Center Dot and Line */}
      <div className="flex h-full w-full items-center justify-center">
        <div className="z-10 h-4 w-4 rounded-full bg-primary ring-8 ring-background" />
      </div>

      {/* Right Card or Spacer */}
      {!isLeft ? (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{episode.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {episode.primary_goal}
              </p>
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <Badge key={chip} variant="secondary">
                    {chip}
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => onSelect(episode.episode_number)}
              >
                Open Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div />
      )}
    </div>
  );
}

// --- The Main Timeline Component ---
interface CustomTimelineProps {
  episodes: JourneyEpisode[];
  onSelectItem: (episodeId: number) => void;
}

export function CustomVerticalTimeline({
  episodes,
  onSelectItem,
}: CustomTimelineProps) {
  return (
    <div className="relative space-y-8 py-4">
      {/* The central line */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border" />

      {episodes.map((episode, index) => (
        <TimelineItem
          key={episode.episode_number}
          episode={episode}
          index={index}
          onSelect={onSelectItem}
        />
      ))}
    </div>
  );
}
