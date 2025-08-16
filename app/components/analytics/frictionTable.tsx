import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function FrictionTable({ data }: { data: any }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Count</TableHead>
          <TableHead>Resolution Strategy</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.type
          ? Object.entries(data.type).map(([type, count]) => (
              <TableRow key={type}>
                <TableCell className="font-medium">{type}</TableCell>
                <TableCell>{count as number}</TableCell>
                <TableCell>
                  {/* This is a simplified lookup */}
                  {data?.resolution_strategies.find((s: string) =>
                    s.toLowerCase().includes(type.split(" ")[0].toLowerCase())
                  ) || "Flexible Adaptation"}
                </TableCell>
              </TableRow>
            ))
          : ""}
        <TableRow className="bg-muted/40 font-bold">
          <TableCell>Total Friction Points</TableCell>
          <TableCell>{data.total_friction_points}</TableCell>
          <TableCell>
            <Badge>
              {data.resolution_effectiveness?.immediate_resolution} Immediately
              Resolved
            </Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
