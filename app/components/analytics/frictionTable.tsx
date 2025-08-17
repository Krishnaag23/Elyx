"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

// Define a more specific type for clarity
interface FrictionPoint {
  type: string;
  description: string;
  resolution: string;
}

// A simple utility to get a color based on the friction type
const getBadgeVariant = (
  type: string
): "default" | "destructive" | "secondary" | "outline" => {
  if (type.toLowerCase().includes("complexity")) return "destructive";
  if (type.toLowerCase().includes("time")) return "secondary";
  if (type.toLowerCase().includes("scheduling")) return "outline";
  return "default";
};

export function FrictionTable({ data }: { data: FrictionPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No friction points were identified in this journey. Great work!
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Resolution</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((friction, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="hover:bg-muted/50"
            >
              <TableCell className="font-medium">
                <Badge variant={getBadgeVariant(friction.type)}>
                  {friction.type}
                </Badge>
              </TableCell>
              <TableCell>{friction.description}</TableCell>
              <TableCell className="text-primary">
                <div className="flex items-start">
                  <Lightbulb className="mr-2 h-4 w-4 flex-shrink-0 mt-1" />
                  <span>{friction.resolution}</span>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
