import { promises as fs } from "fs";
import path from "path";
import { JourneyEvent, HealthJourneyAnalysis } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Download,
  MessageSquare,
  Users,
  AlertTriangle,
  Smile,
  BrainCircuit,
  TrendingUp,
  Clock,
  ThumbsUp,
  GitCommitHorizontal,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

import { FrictionTable } from "../components/analytics/frictionTable";
import { CommunicationChart } from "../components/analytics/communicationChart";

// Helper component for list items
const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <CheckCircle className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-primary" />
    <span>{children}</span>
  </li>
);

// Helper component for info cards
const InfoCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) => {
  const Icon = icon;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default async function AnalyticsPage() {
  // Fetch and process data on the server
  const msgPath = path.join(process.cwd(), "public/journey_log.json");
  const epPath = path.join(process.cwd(), "public/episode.json");
  const msgData = await fs.readFile(msgPath, "utf-8");
  const epData = await fs.readFile(epPath, "utf-8");
  const messages: JourneyEvent[] = JSON.parse(msgData);
  const episodeData: HealthJourneyAnalysis = JSON.parse(epData);

  const {
    member_profile,
    team_composition,
    journey_episodes,
    communication_patterns,
    friction_analysis,
    outcome_metrics,
    member_satisfaction_indicators,
    team_performance_analysis,
    program_evolution_insights,
    predictive_analysis,
  } = episodeData;

  const allFrictionPoints =
    journey_episodes?.flatMap((ep) => ep.friction_points || []).filter(Boolean) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {member_profile.name}'s Journey Analytics
          </h1>
          <p className="text-muted-foreground">
            Analyze trends, track metrics, and generate journey summaries.
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Generate PDF Report
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Journey Timeline</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="friction">Friction</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              title="Total Messages"
              value={messages.length}
              icon={MessageSquare}
            />
            <InfoCard
              title="Journey Episodes"
              value={journey_episodes?.length || 0}
              icon={GitCommitHorizontal}
            />
            <InfoCard
              title="Friction Points"
              value={friction_analysis.total_friction_points}
              icon={AlertTriangle}
            />
            <InfoCard
              title="Avg. Response Time"
              value={`${communication_patterns.average_response_time_minutes} min`}
              icon={Clock}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>{member_profile.name}'s Profile</CardTitle>
                <CardDescription>
                  Initial concerns, constraints, and goals.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Initial Health Concerns</h4>
                  <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                    {member_profile.initial_health_concerns.map((concern) => (
                      <li key={concern}>{concern}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Constraints & Preferences</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Time:</strong> {member_profile.constraints.time_availability} <br />
                    <strong>Lifestyle:</strong> {member_profile.constraints.lifestyle} <br />
                    <strong>Preferences:</strong> {member_profile.constraints.preferences}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Biomarkers Tracked</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {member_profile.biomarkers_tracked.map((marker) => (
                      <Badge key={marker} variant="secondary">
                        {marker}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Team Composition</CardTitle>
                <CardDescription>
                  The dedicated team supporting {member_profile.name}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(team_composition).map(([teamType, members]) => (
                  <div key={teamType}>
                    <h4 className="font-semibold capitalize">{teamType.replace('_', ' ')}</h4>
                    <div className="mt-2 space-y-2">
                      {members.map((member: any) => (
                        <div key={member.name} className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name} <span className="text-sm text-muted-foreground">- {member.role}</span></p>
                            <p className="text-xs text-muted-foreground">{member.responsibilities.join(', ')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* JOURNEY TIMELINE TAB */}
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Journey Timeline</CardTitle>
              <CardDescription>
                A chronological breakdown of all episodes in {member_profile.name}'s journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {journey_episodes?.map((episode) => (
                  <AccordionItem value={`item-${episode.episode_number}`} key={episode.episode_number}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-4 text-left">
                        <Badge variant="outline">{`Ep. ${episode.episode_number}`}</Badge>
                        <span className="font-semibold">{episode.title}</span>
                        <span className="text-sm text-muted-foreground hidden md:inline">({episode.date_range})</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pl-4 border-l-2 ml-4">
                      <p><strong>Goal:</strong> {episode.primary_goal}</p>
                      <p><strong>Outcome:</strong> <Badge>{episode.outcome}</Badge></p>
                      <div>
                        <strong>Key Interactions:</strong>
                        <ul className="mt-2 list-disc list-inside text-sm">
                          {episode.key_interactions.map((interaction, i) => (
                            <li key={i}><strong>{interaction.actor}:</strong> {interaction.action}</li>
                          ))}
                        </ul>
                      </div>
                      {episode.friction_points && episode.friction_points.length > 0 && (
                        <div>
                          <strong>Friction Points:</strong>
                          <ul className="mt-2 list-disc list-inside text-sm">
                            {episode.friction_points.map((friction, i) => (
                              <li key={i}><strong className="text-destructive">{friction.type}:</strong> {friction.description} <span className="text-primary">Resolution: {friction.resolution}</span></li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div>
                        <strong>Persona Evolution:</strong>
                        <p className="text-sm text-muted-foreground italic">"{episode.persona_evolution.after_state}"</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* OUTCOMES TAB */}
        <TabsContent value="outcomes" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Biomarker Improvements</CardTitle>
              <CardDescription>
                Measurable changes in key health markers.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(outcome_metrics.biomarker_improvements).map(([key, value]) => (
                 <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize flex items-center">{key.replace('_', ' ')} <TrendingUp className="ml-2 h-5 w-5 text-green-500"/></CardTitle>
                  </CardHeader>
                   <CardContent>
                     {value.baseline && <p className="text-sm"><strong>From:</strong> {value.baseline}</p>}
                     {value.current && <p className="text-sm"><strong>To:</strong> {value.current}</p>}
                     {value.improvement_percent && <p className="font-bold text-green-600 text-xl">{value.improvement_percent}% Improvement</p>}
                     {value.deep_sleep_increase_percent && <p className="font-bold text-green-600 text-xl">{value.deep_sleep_increase_percent}% Increase</p>}
                     {value.apoB?.improvement_percent && <p className="font-bold text-green-600 text-xl">{value.apoB.improvement_percent}% Reduction</p>}
                     {value.resting_heart_rate_reduction_bpm && <p className="font-bold text-green-600 text-xl">{value.resting_heart_rate_reduction_bpm} BPM Drop</p>}
                   </CardContent>
                 </Card>
              ))}
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                  <CardTitle>Behavioral Changes</CardTitle>
                  <CardDescription>Adopted habits and lifestyle modifications.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {Object.entries(outcome_metrics.behavioral_changes).map(([key, value]) => (
                    <ListItem key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value}</ListItem>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                  <CardTitle>Program Efficiency</CardTitle>
                  <CardDescription>How the program adapted to member's life.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {Object.entries(outcome_metrics.program_efficiency).map(([key, value]) => (
                    <ListItem key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value}</ListItem>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* COMMUNICATION TAB */}
        <TabsContent value="communication" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Patterns</CardTitle>
              <CardDescription>
                Visualizing the flow of conversation between {member_profile.name} and the team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommunicationChart data={communication_patterns} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* FRICTION TAB */}
        <TabsContent value="friction" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
             <InfoCard title="Total Friction Points" value={friction_analysis.total_friction_points} icon={AlertTriangle}/>
             <Card>
               <CardHeader><CardTitle>Friction Categories</CardTitle></CardHeader>
               <CardContent>
                 {Object.entries(friction_analysis.categories).map(([key, value]) => (
                   <div key={key} className="flex justify-between text-sm"><span>{key}</span> <strong>{value}</strong></div>
                 ))}
               </CardContent>
             </Card>
             <Card>
               <CardHeader><CardTitle>Resolution Effectiveness</CardTitle></CardHeader>
               <CardContent>
                 {Object.entries(friction_analysis.resolution_effectiveness).map(([key, value]) => (
                   <div key={key} className="flex justify-between text-sm capitalize"><span>{key.replace(/_/g, ' ')}</span> <strong>{value}</strong></div>
                 ))}
               </CardContent>
             </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Friction Point Details</CardTitle>
              <CardDescription>
                Identifying and resolving obstacles in the member journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FrictionTable data={allFrictionPoints} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SATISFACTION TAB */}
        <TabsContent value="satisfaction" className="mt-4 grid gap-4 md:grid-cols-2">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center"><Smile className="mr-2 h-5 w-5"/> Explicit Satisfaction</CardTitle>
               <CardDescription>Direct positive feedback from the member.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               {member_satisfaction_indicators.explicit_satisfaction_statements.map((statement, i) => (
                 <blockquote key={i} className="border-l-4 pl-4 italic">"{statement}"</blockquote>
               ))}
             </CardContent>
           </Card>
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center"><ThumbsUp className="mr-2 h-5 w-5"/> Engagement Indicators</CardTitle>
               <CardDescription>Metrics showing member's active participation.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-2 text-sm">
                <p><strong>Proactive Communications:</strong> {member_satisfaction_indicators.engagement_indicators.proactive_communications}</p>
                <p><strong>Knowledge Seeking:</strong> {member_satisfaction_indicators.engagement_indicators.knowledge_seeking_behaviors} instances</p>
                <p><strong>Adherence Rate (Est.):</strong> {member_satisfaction_indicators.engagement_indicators.plan_adherence_rate}</p>
             </CardContent>
           </Card>
        </TabsContent>

        {/* INSIGHTS TAB */}
        <TabsContent value="insights" className="mt-4 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5"/>Team Performance</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {Object.values(team_performance_analysis.coordination_effectiveness).map(v => <ListItem key={v}>{v}</ListItem>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5"/>Program Evolution</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                    {program_evolution_insights.successful_adaptations.map(v => <ListItem key={v}>{v}</ListItem>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center"><BrainCircuit className="mr-2 h-5 w-5"/>Predictive Analysis</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Success Probability</h4>
                  <p className="text-2xl font-bold text-primary">{predictive_analysis.success_probability}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Risk Factors</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {predictive_analysis.risk_factors.map(risk => <Badge key={risk} variant="destructive">{risk}</Badge>)}
                  </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}