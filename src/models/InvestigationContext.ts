import { KnownFacts, MissingFields, EvidenceItem } from './InvestigationState';

export type PlannerStatus = 'initializing' | 'retrieving_cases' | 'analyzing_patterns' | 'generating_questions' | 'ready';

export interface InvestigationContext {
  caseId: string;
  
  // Sourced directly from InvestigationState
  knownFacts: KnownFacts;
  missingFields: MissingFields;
  confidenceScores: any; // We can use 'any' or exact type depending on strictness
  uploadedEvidence: EvidenceItem[];
  questionHistory: string[];
  answerHistory: Record<string, string>;
  
  // Future Orchestration Fields
  retrievedCases: any[];
  patterns: any[];
  questionQueue: string[];
  confidenceHistory: any[];
  
  // Lifecycle
  plannerStatus: PlannerStatus;
  timestamps: {
    initializedAt: string;
    lastActionAt: string;
  };
}
