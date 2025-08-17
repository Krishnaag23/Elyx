"use client";

import { JourneyEpisode } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  Zap,
  CheckCircle,
  Milestone,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

// Helper to determine the color of the outcome badge
const getOutcomeVariant = (
  outcome: string
): "default" | "secondary" | "destructive" => {
  const lowerOutcome = outcome.toLowerCase();
  if (
    lowerOutcome.includes("achieved") ||
    lowerOutcome.includes("successful") ||
    lowerOutcome.includes("implemented")
  ) {
    return "default";
  }
  if (lowerOutcome.includes("progress")) {
    return "secondary";
  }
  return "destructive";
};

export function EpisodeCard({
  episode,
  index,
}: {
  episode: JourneyEpisode;
  index: number;
}) {
  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="flex flex-col overflow-hidden border-l-4 border-transparent hover:border-primary transition-colors duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardDescription>
                {episode.date_range} • {episode.duration_days} days
              </CardDescription>
              <CardTitle className="text-xl">{episode.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Primary Goal
            </h4>
            <p className="text-sm text-muted-foreground">
              {episode.primary_goal}
            </p>
          </div>

          {episode.friction_points.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" /> Friction Points
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                {episode.friction_points.map((point, index) => (
                  <li key={index}>
                    <strong className="text-foreground/80">
                      {point.type}:
                    </strong>{" "}
                    {point.description}
                    <div className="text-xs text-primary mt-1">
                      ✓ {point.resolution}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger className="text-sm">
                View Details
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div>
                  <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
                    <Milestone className="h-4 w-4 text-muted-foreground" />
                    Key Interactions
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {episode.key_interactions.map((interaction, i) => (
                      <li key={i}>
                        <strong>{interaction.actor}:</strong>{" "}
                        {interaction.action}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    Persona Evolution
                  </h4>
                  <blockquote className="border-l-2 pl-3 italic text-sm text-muted-foreground">
                    "{episode.persona_evolution.after_state}"
                  </blockquote>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="mt-auto bg-muted/20 p-4 border-t">
          <div className="w-full flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground">
              Outcome
            </h4>
            <Badge variant={getOutcomeVariant(episode.outcome)}>
              <CheckCircle className="h-3 w-3 mr-1.5" /> {episode.outcome}
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
