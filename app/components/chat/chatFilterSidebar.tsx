import { JourneyEvent } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo } from "react";

interface Props {
  allMessages: JourneyEvent[];
  filters: { query: string; sender: string; role: string };
  onFilterChange: (filters: any) => void;
  statsData: JourneyEvent[];
}

export function ChatFilterSidebar({ allMessages, filters, onFilterChange, statsData }: Props) {
  const uniqueSenders = useMemo(() => Array.from(new Set(allMessages.map(m => m.sender))).sort(), [allMessages]);
  const uniqueRoles = useMemo(() => Array.from(new Set(allMessages.map(m => m.senderRole))).sort(), [allMessages]);

  const handleFieldChange = (field: string, value: string) => {
    onFilterChange((prev: any) => ({ ...prev, [field]: value === "___all___" ? "" : value }));
  };
  
  return (
    <aside className="hidden w-80 flex-col border-r p-4 space-y-4 lg:flex">
      <Card>
        <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search messages..." value={filters.query} onChange={e => handleFieldChange('query', e.target.value)} />
          <Select value={filters.sender} onValueChange={value => handleFieldChange('sender', value)}>
            <SelectTrigger><SelectValue placeholder="All Senders" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Senders</SelectItem>
              {uniqueSenders.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.role} onValueChange={value => handleFieldChange('role', value)}>
            <SelectTrigger><SelectValue placeholder="All Roles" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Roles</SelectItem>
              {uniqueRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm"><strong>{statsData.length}</strong> messages shown</div>
        </CardContent>
      </Card>
    </aside>
  );
}