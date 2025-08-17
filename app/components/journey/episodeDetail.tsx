"use client";

import { JourneyEpisode } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Zap,
  Milestone,
  Sparkles,
  CheckCircle,
} from "lucide-react";

interface EpisodeDetailSheetProps {
  episode: JourneyEpisode | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const DetailSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <h4 className="mb-2 font-semibold flex items-center gap-2 text-muted-foreground">
      {icon} {title}
    </h4>
    {children}
  </div>
);

export function EpisodeDetailSheet({
  episode,
  isOpen,
  onOpenChange,
}: EpisodeDetailSheetProps) {
  if (!episode) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-y-auto">
        <SheetHeader className="p-6 pb-4 bg-muted">
          <Badge variant="outline" className="w-fit mb-2">
            Episode #{episode.episode_number}
          </Badge>
          <SheetTitle className="text-2xl">{episode.title}</SheetTitle>
          <SheetDescription>
            {episode.date_range} • {episode.duration_days} days
          </SheetDescription>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm font-semibold">Outcome:</span>
            <Badge>
              <CheckCircle className="h-3 w-3 mr-1.5" />
              {episode.outcome}
            </Badge>
          </div>
        </SheetHeader>
        <div className="p-6 space-y-6">
          <DetailSection
            title="Primary Goal"
            icon={<Zap className="h-4 w-4" />}
          >
            <p className="text-sm">{episode.primary_goal}</p>
          </DetailSection>

          {episode.friction_points.length > 0 && (
            <DetailSection
              title="Friction Points"
              icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
            >
              <ul className="space-y-3 text-sm">
                {episode.friction_points.map((point, index) => (
                  <li
                    key={index}
                    className="border-l-2 border-destructive pl-3"
                  >
                    <strong className="text-foreground">{point.type}:</strong>{" "}
                    {point.description}
                    <div className="text-xs text-primary mt-1">
                      ✓ {point.resolution}
                    </div>
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          <DetailSection
            title="Key Interactions"
            icon={<Milestone className="h-4 w-4" />}
          >
            <ul className="list-disc pl-5 text-sm space-y-1">
              {episode.key_interactions.map((interaction, i) => (
                <li key={i}>
                  <strong>{interaction.actor}:</strong> {interaction.action}
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection
            title="Persona Evolution"
            icon={<Sparkles className="h-4 w-4" />}
          >
            <blockquote className="border-l-2 pl-3 italic text-sm">
              "{episode.persona_evolution.after_state}"
            </blockquote>
          </DetailSection>
        </div>
      </SheetContent>
    </Sheet>
  );
}
