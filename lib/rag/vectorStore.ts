import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { getEmbeddings } from "../llm/google";
import { HealthJourneyAnalysis } from "@/lib/types";

// Import your data files directly
import journeyLogData from "@/public/journey_log.json";
import journeyAnalysisData from "@/public/episode.json";

// Singleton instance to prevent re-initialization on every API call
let vectorStore: MemoryVectorStore | null = null;

// Type for journey log events (matches your actual data structure)
interface JourneyLogEvent {
  eventId: string;
  timeStamp: string;
  sender: string;
  senderRole: string;
  message: string;
}

const createDocumentsFromLog = (log: JourneyLogEvent[]): Document[] => {
  return log
    .map((event) => {
      // Ensure all required fields exist and are strings
      const eventId = event.eventId || "unknown";
      const timeStamp = event.timeStamp || new Date().toISOString();
      const sender = event.sender || "Unknown";
      const senderRole = event.senderRole || "Unknown";
      const message = event.message || "";

      // Create safe page content
      const dateStr = new Date(timeStamp).toDateString();
      const pageContent = `On ${dateStr}, ${sender} (${senderRole}) said: "${message}"`;

      return new Document({
        pageContent: pageContent,
        metadata: {
          source: "journey_log.json",
          eventId,
          sender,
          senderRole,
          timestamp: timeStamp,
        },
      });
    })
    .filter((doc) => doc.pageContent.length > 10); // Filter out very short documents
};

const createDocumentsFromAnalysis = (
  analysis: HealthJourneyAnalysis
): Document[] => {
  const documents: Document[] = [];

  try {
    // Create documents from member profile
    if (analysis.member_profile) {
      const profileContent = `
        Member Profile: ${analysis.member_profile.name || "Unknown"} (${
        analysis.member_profile.role || "Member"
      })
        Health Concerns: ${(
          analysis.member_profile.initial_health_concerns || []
        ).join(", ")}
        Constraints: ${
          analysis.member_profile.constraints?.time_availability || "N/A"
        }, ${analysis.member_profile.constraints?.lifestyle || "N/A"}
        Preferences: ${
          analysis.member_profile.constraints?.preferences || "N/A"
        }
        Tracked Biomarkers: ${(
          analysis.member_profile.biomarkers_tracked || []
        ).join(", ")}
      `
        .trim()
        .replace(/\s+/g, " ");

      if (profileContent.length > 20) {
        documents.push(
          new Document({
            pageContent: profileContent,
            metadata: {
              source: "journey_analysis.json",
              type: "member_profile",
              member_name: analysis.member_profile.name || "Unknown",
              senderRole: "System",
            },
          })
        );
      }
    }

    // Create documents from team composition
    if (analysis.team_composition) {
      const conciergeTeam = (analysis.team_composition.concierge_team || [])
        .map(
          (m) =>
            `${m.name || "Unknown"} (${m.role || "Unknown"}): ${(
              m.responsibilities || []
            ).join(", ")}`
        )
        .join("; ");
      const medicalTeam = (analysis.team_composition.medical_team || [])
        .map(
          (m) =>
            `${m.name || "Unknown"} (${m.role || "Unknown"}): ${(
              m.responsibilities || []
            ).join(", ")}`
        )
        .join("; ");
      const specialists = (analysis.team_composition.specialists || [])
        .map(
          (m) =>
            `${m.name || "Unknown"} (${m.role || "Unknown"}): ${(
              m.responsibilities || []
            ).join(", ")}`
        )
        .join("; ");

      const teamContent = `
        Team Composition:
        Concierge Team: ${conciergeTeam}
        Medical Team: ${medicalTeam}
        Specialists: ${specialists}
      `
        .trim()
        .replace(/\s+/g, " ");

      if (teamContent.length > 20) {
        documents.push(
          new Document({
            pageContent: teamContent,
            metadata: {
              source: "journey_analysis.json",
              type: "team_composition",
              senderRole: "System",
            },
          })
        );
      }
    }

    // Create documents from journey episodes
    if (analysis.journey_episodes && Array.isArray(analysis.journey_episodes)) {
      analysis.journey_episodes.forEach((episode) => {
        try {
          const interactions = (episode.key_interactions || [])
            .map(
              (i) => `${i.actor || "Unknown"}: ${i.action || "Unknown action"}`
            )
            .join("; ");
          const frictions = (episode.friction_points || [])
            .map(
              (f) =>
                `${f.type || "Unknown"}: ${f.description || "Unknown"} (${
                  f.resolution || "Unknown"
                })`
            )
            .join("; ");
          const metrics = episode.metrics
            ? Object.entries(episode.metrics)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")
            : "None";

          const episodeContent = `
            Episode ${episode.episode_number || "Unknown"}: ${
            episode.title || "Untitled"
          } (${episode.date_range || "Unknown dates"}, ${
            episode.duration_days || 0
          } days)
            Goal: ${episode.primary_goal || "Unknown goal"}
            Triggered by: ${episode.triggered_by || "Unknown trigger"}
            Key Interactions: ${interactions || "None"}
            Friction Points: ${frictions || "None"}
            Outcome: ${episode.outcome || "Unknown outcome"}
            Persona Evolution: From "${
              episode.persona_evolution?.before_state || "Unknown"
            }" to "${episode.persona_evolution?.after_state || "Unknown"}"
            Metrics: ${metrics}
          `
            .trim()
            .replace(/\s+/g, " ");

          if (episodeContent.length > 50) {
            documents.push(
              new Document({
                pageContent: episodeContent,
                metadata: {
                  source: "journey_analysis.json",
                  type: "episode_summary",
                  episode_number: episode.episode_number || 0,
                  episode_title: episode.title || "Untitled",
                  primary_goal: episode.primary_goal || "Unknown",
                  duration_days: episode.duration_days || 0,
                  senderRole: "System",
                },
              })
            );
          }
        } catch (episodeError) {
          console.warn(
            `Error processing episode ${episode.episode_number}:`,
            episodeError
          );
        }
      });
    }

    // Create documents from communication patterns
    if (analysis.communication_patterns) {
      const commContent = `
        Communication Patterns:
        Average response time: ${
          analysis.communication_patterns.average_response_time_minutes || 0
        } minutes
        Total interactions: ${
          analysis.communication_patterns.total_interactions || 0
        }
        Member initiated: ${
          analysis.communication_patterns.member_initiated_interactions || 0
        }
        Team initiated: ${
          analysis.communication_patterns.team_initiated_interactions || 0
        }
        Daily average: ${
          analysis.communication_patterns.communication_frequency
            ?.daily_average || 0
        }
        Peak periods: ${(
          analysis.communication_patterns.communication_frequency
            ?.peak_periods || []
        ).join(", ")}
        Interaction types: ${Object.entries(
          analysis.communication_patterns.interaction_types || {}
        )
          .map(([type, count]) => `${type}: ${count}`)
          .join(", ")}
      `
        .trim()
        .replace(/\s+/g, " ");

      if (commContent.length > 20) {
        documents.push(
          new Document({
            pageContent: commContent,
            metadata: {
              source: "journey_analysis.json",
              type: "communication_patterns",
              senderRole: "System",
            },
          })
        );
      }
    }

    // Create documents from friction analysis
    if (analysis.friction_analysis) {
      const frictionContent = `
        Friction Analysis:
        Total friction points: ${
          analysis.friction_analysis.total_friction_points || 0
        }
        Categories: ${Object.entries(
          analysis.friction_analysis.categories || {}
        )
          .map(([cat, count]) => `${cat}: ${count}`)
          .join(", ")}
        Resolution effectiveness: Immediate: ${
          analysis.friction_analysis.resolution_effectiveness
            ?.immediate_resolution || 0
        }, Required iteration: ${
        analysis.friction_analysis.resolution_effectiveness
          ?.required_iteration || 0
      }, Ongoing management: ${
        analysis.friction_analysis.resolution_effectiveness
          ?.ongoing_management || 0
      }
        Resolution strategies: ${(
          analysis.friction_analysis.resolution_strategies || []
        ).join(", ")}
      `
        .trim()
        .replace(/\s+/g, " ");

      if (frictionContent.length > 20) {
        documents.push(
          new Document({
            pageContent: frictionContent,
            metadata: {
              source: "journey_analysis.json",
              type: "friction_analysis",
              senderRole: "System",
            },
          })
        );
      }
    }

    // Create documents from outcome metrics
    if (analysis.outcome_metrics) {
      const outcomeContent = `
        Outcome Metrics:
        Biomarker Improvements: Blood pressure: ${JSON.stringify(
          analysis.outcome_metrics.biomarker_improvements?.blood_pressure || {}
        )}, ApoB: ${JSON.stringify(
        analysis.outcome_metrics.biomarker_improvements?.apoB || {}
      )}, Sleep quality: ${JSON.stringify(
        analysis.outcome_metrics.biomarker_improvements?.sleep_quality || {}
      )}, Cardiovascular fitness: ${JSON.stringify(
        analysis.outcome_metrics.biomarker_improvements
          ?.cardiovascular_fitness || {}
      )}
        Behavioral Changes: Exercise consistency: ${
          analysis.outcome_metrics.behavioral_changes?.exercise_consistency ||
          "N/A"
        }, Nutrition adherence: ${
        analysis.outcome_metrics.behavioral_changes?.nutrition_adherence ||
        "N/A"
      }, Sleep hygiene: ${
        analysis.outcome_metrics.behavioral_changes?.sleep_hygiene || "N/A"
      }, Stress management: ${
        analysis.outcome_metrics.behavioral_changes?.stress_management || "N/A"
      }
        Program Efficiency: Time constraint respect: ${
          analysis.outcome_metrics.program_efficiency
            ?.time_constraint_respect || "N/A"
        }, Travel adaptability: ${
        analysis.outcome_metrics.program_efficiency?.travel_adaptability ||
        "N/A"
      }, Plateau management: ${
        analysis.outcome_metrics.program_efficiency?.plateau_management || "N/A"
      }
      `
        .trim()
        .replace(/\s+/g, " ");

      if (outcomeContent.length > 20) {
        documents.push(
          new Document({
            pageContent: outcomeContent,
            metadata: {
              source: "journey_analysis.json",
              type: "outcome_metrics",
              senderRole: "System",
            },
          })
        );
      }
    }

    // Create documents from satisfaction indicators
    if (analysis.member_satisfaction_indicators) {
      const satisfactionContent = `
        Member Satisfaction Indicators:
        Explicit satisfaction statements: ${(
          analysis.member_satisfaction_indicators
            .explicit_satisfaction_statements || []
        ).join("; ")}
        Engagement indicators: Proactive communications: ${
          analysis.member_satisfaction_indicators.engagement_indicators
            ?.proactive_communications || 0
        }, Knowledge seeking behaviors: ${
        analysis.member_satisfaction_indicators.engagement_indicators
          ?.knowledge_seeking_behaviors || 0
      }, Self-monitoring adoption: ${
        analysis.member_satisfaction_indicators.engagement_indicators
          ?.self_monitoring_adoption || "N/A"
      }, Plan adherence rate: ${
        analysis.member_satisfaction_indicators.engagement_indicators
          ?.plan_adherence_rate || "N/A"
      }
        Trust building evidence: ${(
          analysis.member_satisfaction_indicators.trust_building_evidence || []
        ).join("; ")}
      `
        .trim()
        .replace(/\s+/g, " ");

      if (satisfactionContent.length > 20) {
        documents.push(
          new Document({
            pageContent: satisfactionContent,
            metadata: {
              source: "journey_analysis.json",
              type: "satisfaction_indicators",
              senderRole: "System",
            },
          })
        );
      }
    }
  } catch (error) {
    console.error("Error in createDocumentsFromAnalysis:", error);
  }

  return documents.filter(
    (doc) => doc.pageContent && doc.pageContent.length > 10
  );
};

export const getVectorStore = async (): Promise<MemoryVectorStore> => {
  if (vectorStore) {
    return vectorStore;
  }

  try {
    console.log("Initializing MemoryVectorStore for the first time...");

    // Validate data exists
    if (!journeyLogData || !Array.isArray(journeyLogData)) {
      throw new Error("Journey log data is invalid or missing");
    }

    if (!journeyAnalysisData || typeof journeyAnalysisData !== "object") {
      throw new Error("Journey analysis data is invalid or missing");
    }

    const logDocuments = createDocumentsFromLog(
      journeyLogData as JourneyLogEvent[]
    );
    const analysisDocuments = createDocumentsFromAnalysis(
      journeyAnalysisData as HealthJourneyAnalysis
    );

    const allDocuments = [...logDocuments, ...analysisDocuments];

    console.log(
      `Created ${logDocuments.length} log documents and ${analysisDocuments.length} analysis documents`
    );
    console.log(`Total documents: ${allDocuments.length}`);

    // Validate documents have content
    const validDocuments = allDocuments.filter(
      (doc) => doc.pageContent && doc.pageContent.trim().length > 0
    );

    if (validDocuments.length === 0) {
      throw new Error("No valid documents found to create vector store");
    }

    console.log(`Using ${validDocuments.length} valid documents`);

    console.log("Getting embeddings instance...");
    const embeddings = getEmbeddings();

    if (!embeddings) {
      throw new Error("Failed to get embeddings instance");
    }

    console.log("Creating MemoryVectorStore from documents...");
    const store = await MemoryVectorStore.fromDocuments(
      validDocuments,
      embeddings
    );

    console.log("Vector store initialized successfully.");
    vectorStore = store;
    return vectorStore;
  } catch (error) {
    console.error("Error initializing vector store:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
};

// Helper function to search the vector store
export const searchVectorStore = async (
  query: string,
  k: number = 5
): Promise<Document[]> => {
  const store = await getVectorStore();
  return store.similaritySearch(query, k);
};
