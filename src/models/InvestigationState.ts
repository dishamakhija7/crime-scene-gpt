export interface EvidenceItem {
  id: string;
  type: 'image' | 'video' | 'pdf' | 'text' | string;
  url?: string;
  originalName: string;
  timestamp: string;
}

export type AgentState = 'pending' | 'running' | 'completed' | 'failed';
export type InvestigationStatus = 'open' | 'investigating' | 'reconstruction_ready' | 'closed';

export interface RetrievedCase {
  dataset: string;
  caseId: string;
  similarityScore: number;
  metadata?: any;
}

export interface KnownFacts {
  weather?: string;
  roadType?: string;
  collisionType?: string;
  vehicleCount?: number;
  vehicleTypes?: string[];
  lighting?: string;
  roadCondition?: string;
  impactPoint?: string;
  timeOfDay?: string;
  location?: string;
  [key: string]: any; // Extensible
}

export type MissingFieldStatus = 'missing' | 'answered' | 'inferred' | 'unknown';

export interface MissingFields {
  vehicleSpeed?: MissingFieldStatus;
  lanePosition?: MissingFieldStatus;
  visibility?: MissingFieldStatus;
  trafficSignal?: MissingFieldStatus;
  driverAction?: MissingFieldStatus;
  vehicleDirection?: MissingFieldStatus;
  [key: string]: MissingFieldStatus | undefined;
}

export interface InvestigationState {
  caseId: string;
  version: string;
  status: InvestigationStatus;
  agentStatus: Record<string, AgentState>; // Track status by agent name (e.g., 'EvidenceIntakeAgent': 'completed')
  
  // 1. Evidence Collection
  uploadedEvidence: EvidenceItem[];
  
  // 2. Extracted Data (from Agent 1)
  extractedEvidence: any | null; // Represents structured JSON extracted from raw evidence
  knownFacts: KnownFacts;
  
  // 3. Gap Analysis (from Agent 2)
  missingFields: MissingFields;
  priorityMissingFields: string[];
  
  // 4. Case Retrieval & Patterns (from Agent 3)
  retrievedCases: RetrievedCase[];
  patternAnalysis: string | null;
  
  // 5. User Interaction (from Agent 4)
  questionHistory: string[]; // Replaces generatedQuestions to track multiple rounds
  answerHistory: Record<string, string>; // Replaces userAnswers to track multiple rounds
  
  // 6. Evaluation & State
  confidenceScores: {
    overall: number;
    evidenceQuality: number;
    patternMatch: number;
    perField: Record<string, number>; // Field-specific confidence scores
  };
  reasoning: Record<string, string>; // Explainability notes (e.g., why a certain field was inferred)
  reconstructionReady: boolean;
  
  // 7. Metadata
  timestamps: {
    createdAt: string;
    updatedAt: string;
    lastAgentUpdate: string;
  };
}

export const initialInvestigationState = (caseId: string): InvestigationState => ({
  caseId,
  version: "1.0",
  status: "open",
  agentStatus: {},
  uploadedEvidence: [],
  extractedEvidence: null,
  knownFacts: {},
  missingFields: {},
  priorityMissingFields: [],
  retrievedCases: [],
  patternAnalysis: null,
  questionHistory: [],
  answerHistory: {},
  confidenceScores: {
    overall: 0,
    evidenceQuality: 0,
    patternMatch: 0,
    perField: {}
  },
  reasoning: {},
  reconstructionReady: false,
  timestamps: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastAgentUpdate: new Date().toISOString(),
  }
});
