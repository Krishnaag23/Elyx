// Base Types
export interface MemberProfile {
  name: string;
  role: string;
  initial_health_concerns: string[];
  constraints: {
    time_availability: string;
    lifestyle: string;
    preferences: string;
  };
  biomarkers_tracked: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  responsibilities: string[];
}

export interface TeamComposition {
  concierge_team: TeamMember[];
  medical_team: TeamMember[];
  specialists: TeamMember[];
}

export interface Interaction {
  timestamp: string;
  actor: string;
  action: string;
}

export interface FrictionPoint {
  type: string;
  description: string;
  resolution: string;
}

export interface PersonaAnalysis {
  before_state: string;
  after_state: string;
}

export interface JourneyEpisode {
  episode_number: number;
  title: string;
  date_range: string;
  duration_days: number;
  primary_goal: string;
  triggered_by: string;
  key_interactions: Interaction[];
  friction_points: FrictionPoint[];
  outcome: string;
  metrics: {
    response_time_minutes?: number;
    time_to_resolution_days?: number;
    key_improvement?: string;
    key_improvements?: {
      [key: string]: string | number;
    };
    [key: string]: any; // For other dynamic metrics
  };
  persona_evolution: PersonaAnalysis;
}

export interface CommunicationFrequency {
  daily_average: number;
  peak_periods: string[];
  quiet_periods: string[];
}

export interface CommunicationPatterns {
  average_response_time_minutes: number;
  total_interactions: number;
  member_initiated_interactions: number;
  team_initiated_interactions: number;
  communication_frequency: CommunicationFrequency;
  interaction_types: {
    [key: string]: number;
  };
}

export interface FrictionCategories {
  [category: string]: number;
}

export interface ResolutionEffectiveness {
  immediate_resolution: number;
  required_iteration: number;
  ongoing_management: number;
}

export interface FrictionAnalysis {
  total_friction_points: number;
  categories: FrictionCategories;
  resolution_effectiveness: ResolutionEffectiveness;
  resolution_strategies: string[];
}

export interface BiomarkerImprovement {
  baseline?: string;
  current?: string;
  improvement_percent?: number | string;
  clinical_significance?: string;
  deep_sleep_increase_percent?: number;
  consistency_improvement?: string;
  resting_heart_rate_reduction_bpm?: number;
  hrv_trend?: string;
}

export interface BiomarkerImprovements {
  blood_pressure: BiomarkerImprovement;
  apoB: BiomarkerImprovement;
  sleep_quality: BiomarkerImprovement;
  cardiovascular_fitness: BiomarkerImprovement;
}

export interface BehavioralChanges {
  exercise_consistency: string;
  nutrition_adherence: string;
  sleep_hygiene: string;
  stress_management: string;
}

export interface ProgramEfficiency {
  time_constraint_respect: string;
  travel_adaptability: string;
  plateau_management: string;
}

export interface OutcomeMetrics {
  biomarker_improvements: BiomarkerImprovements;
  behavioral_changes: BehavioralChanges;
  program_efficiency: ProgramEfficiency;
}

export interface EngagementIndicators {
  proactive_communications: number;
  knowledge_seeking_behaviors: number;
  self_monitoring_adoption: string;
  plan_adherence_rate: string;
}

export interface MemberSatisfactionIndicators {
  explicit_satisfaction_statements: string[];
  engagement_indicators: EngagementIndicators;
  trust_building_evidence: string[];
}

export interface CoordinationEffectiveness {
  cross_team_handoffs: string;
  information_sharing: string;
  scheduling_management: string;
}

export interface ExpertiseDemonstration {
  evidence_based_recommendations: string;
  personalized_adaptations: string;
  progressive_complexity: string;
}

export interface MemberDevelopment {
  education_provided: string;
  autonomy_building: string;
  sustainable_habit_formation: string;
}

export interface TeamPerformanceAnalysis {
  coordination_effectiveness: CoordinationEffectiveness;
  expertise_demonstration: ExpertiseDemonstration;
  member_development: MemberDevelopment;
}

export interface ProgramEvolutionInsights {
  successful_adaptations: string[];
  key_turning_points: string[];
  sustainability_factors: string[];
}

export interface PredictiveAnalysis {
  success_probability: string;
  risk_factors: string[];
  mitigation_strategies: string[];
  growth_opportunities: string[];
}

// Main Interface
export interface HealthJourneyAnalysis {
  member_profile: MemberProfile;
  team_composition: TeamComposition;
  journey_episodes: JourneyEpisode[];
  communication_patterns: CommunicationPatterns;
  friction_analysis: FrictionAnalysis;
  outcome_metrics: OutcomeMetrics;
  member_satisfaction_indicators: MemberSatisfactionIndicators;
  team_performance_analysis: TeamPerformanceAnalysis;
  program_evolution_insights: ProgramEvolutionInsights;
  predictive_analysis: PredictiveAnalysis;
}

// Utility types for common patterns
export type ResponseTimeMetrics = {
  average_minutes: number;
  min_minutes: number;
  max_minutes: number;
  median_minutes: number;
};

export type HealthMetricTrend = {
  baseline_value: number | string;
  current_value: number | string;
  trend_direction: "improving" | "declining" | "stable";
  percentage_change?: number;
  clinical_significance: "high" | "medium" | "low" | "none";
};

export type EpisodeMetrics = {
  response_time_minutes?: number;
  time_to_resolution_days?: number;
  satisfaction_score?: number;
  friction_count?: number;
  outcome_success?: boolean;
  member_engagement_level?: "high" | "medium" | "low";
  [key: string]: any;
};

// Extended JourneyEpisode interface with more specific metrics typing
export interface ExtendedJourneyEpisode
  extends Omit<JourneyEpisode, "metrics"> {
  metrics: EpisodeMetrics;
}

// Analysis Result Types
export type JourneySuccessFactors = {
  primary_factors: string[];
  secondary_factors: string[];
  critical_moments: string[];
};

export type RiskAssessment = {
  current_risk_level: "low" | "medium" | "high";
  risk_factors: string[];
  mitigation_timeline: string;
};

// Export the complete analysis type
export type CompleteHealthJourneyAnalysis = HealthJourneyAnalysis;

export interface JourneyEvent {
  eventId: string;
  timeStamp: string;
  sender: string;
  senderRole: string;
  message: string;
  _dt?: Date;
}
