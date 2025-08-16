"use client";

import { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.css"; // import styles

import { JourneyEvent } from "@/lib/types";

interface TimelineItem {
  id: string;
  content: string;
  start: Date;
  className: string;
}

interface JourneyTimelineProps {
  messages: JourneyEvent[];
  onSelectItem: (eventId: string) => void;
}

export function JourneyTimeline({ messages, onSelectItem }: JourneyTimelineProps) {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timelineInstance = useRef<Timeline | null>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    // transform JourneyEvent → TimelineItem
    const items = messages.map(msg => ({
      id: msg.eventId,
      content: msg.message.substring(0, 50) + (msg.message.length > 50 ? "..." : ""),
      start: new Date(msg.timeStamp),
      className: msg.senderRole === "Member" ? "item-member" : "item-team",
    }));

    const dataset = new DataSet(items);

    // create timeline if not already created
    if (!timelineInstance.current) {
      timelineInstance.current = new Timeline(timelineRef.current, dataset, {
        stack: true,
        width: "100%",
        height: "calc(100vh - 10rem)",
        margin: { item: 20 },
        zoomMin: 1000 * 60 * 60 * 24,        // one day
        zoomMax: 1000 * 60 * 60 * 24 * 31*12 // one year
      });

      // add selection handler
      timelineInstance.current.on("select", props => {
        if (props.items.length > 0) {
          onSelectItem(props.items[0] as string);
        }
      });
    } else {
      // if timeline exists, update items
      timelineInstance.current.setItems(dataset);
    }
  }, [messages, onSelectItem]);

  return (
    <>
      <style>{`
        .vis-timeline { border: none; }
        .vis-item {
          border-color: hsl(var(--border));
          background-color: hsl(var(--card));
          color: hsl(var(--card-foreground));
          border-radius: 0.5rem;
        }
        .vis-item.item-member {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        .vis-item.item-team {
          background-color: hsl(var(--muted));
        }
        .vis-time-axis .vis-grid.vis-odd {
          background: hsl(var(--background));
        }
      `}</style>

      {/* The timeline gets mounted into this div */}
      <div ref={timelineRef} />
    </>
  );
}
