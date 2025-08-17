"use client";

import { useEffect, useState } from "react";
import { CompleteHealthJourneyAnalysis } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  CheckCircle,
  ArrowDown,
  Users,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// --- Reusable Components ---
const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const HighlightItem = ({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) => (
  <li className="flex items-start gap-3">
    <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
    <span className="text-sm">{text}</span>
  </li>
);

// --- Main Page Component ---
export default function OverviewPage() {
  const [analysis, setAnalysis] =
    useState<CompleteHealthJourneyAnalysis | null>(null);

  useEffect(() => {
    // Fetch data on the client since this is a client component
    const fetchData = async () => {
      const response = await fetch("/episode.json");
      const data = await response.json();
      setAnalysis(data);
    };
    fetchData();
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  if (!analysis) {
    return <DashboardSkeleton />;
  }

  const {
    outcome_metrics,
    communication_patterns,
    member_profile,
    program_evolution_insights,
    predictive_analysis,
  } = analysis;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-muted-foreground">Journey Overview:</span>{" "}
            {member_profile.name}
          </h1>
          <p className="text-muted-foreground">
            A narrative summary of key outcomes, insights, and future outlook.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/journey">
              View Full Timeline <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          title="ApoB Reduction"
          value={`${outcome_metrics.biomarker_improvements.apoB.improvement_percent}%`}
          description="Significant risk reduction"
          icon={ArrowDown}
        />
        <StatCard
          title="Blood Pressure"
          value={
            outcome_metrics.biomarker_improvements.blood_pressure.current || ""
          }
          description={`From ${outcome_metrics.biomarker_improvements.blood_pressure.baseline}`}
          icon={ShieldCheck}
        />
        <StatCard
          title="Total Interactions"
          value={String(communication_patterns.total_interactions)}
          description={`${communication_patterns.member_initiated_interactions} member-initiated`}
          icon={Users}
        />
        <StatCard
          title="Deep Sleep Increase"
          value={`${outcome_metrics.biomarker_improvements.sleep_quality.deep_sleep_increase_percent}%`}
          description="Improved recovery & cognition"
          icon={TrendingUp}
        />
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Left Column: Journey Highlights */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Journey Highlights
            </CardTitle>
            <CardDescription>
              The key moments and factors that defined the path to success.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 font-semibold flex items-center gap-2">
                <Lightbulb className="h-5 w-5" /> Key Turning Points
              </h3>
              <ul className="space-y-3">
                {program_evolution_insights.key_turning_points.map(
                  (point: string, i: number) => (
                    <HighlightItem key={i} icon={CheckCircle} text={point} />
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Sustainability Factors
              </h3>
              <ul className="space-y-3">
                {program_evolution_insights.sustainability_factors.map(
                  (factor: string, i: number) => (
                    <HighlightItem key={i} icon={CheckCircle} text={factor} />
                  )
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Predictive Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Predictive Analysis</CardTitle>
            <CardDescription>
              Future outlook based on current trajectory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Success Probability</h4>
              <p className="text-3xl font-bold text-primary">
                {predictive_analysis.success_probability}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Potential Risk Factors</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {predictive_analysis.risk_factors.map(
                  (risk: string, i: number) => (
                    <Badge key={i} variant="destructive">
                      {risk}
                    </Badge>
                  )
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium">Growth Opportunities</h4>
              <ul className="mt-2 space-y-2">
                {predictive_analysis.growth_opportunities.map(
                  (opp: string, i: number) => (
                    <li key={i} className="text-xs flex items-center gap-2">
                      <TrendingUp className="h-3 w-3" /> {opp}
                    </li>
                  )
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// --- Skeleton Component for Loading State ---
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Skeleton className="h-8 w-80" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-40" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Skeleton className="h-64 w-full lg:col-span-2" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);
