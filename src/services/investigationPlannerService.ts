import { getInvestigationState, updateInvestigationState } from './investigationStateService';
import { InvestigationContext } from '../models/InvestigationContext';

/**
 * Orchestrates the AI Investigator pipeline by preparing the necessary
 * contextual snapshot from the current InvestigationState.
 * 
 * @param {string} caseId - The unique identifier of the case.
 * @returns {Promise<InvestigationContext>} The prepared investigation context.
 */
export const startInvestigation = async (caseId: string): Promise<InvestigationContext> => {
  // 1. Load the current state of the investigation
  const state = await getInvestigationState(caseId);

  // 2. Mark the planner as running in the state (optional, but good for lifecycle tracking)
  await updateInvestigationState(caseId, {
    agentStatus: { ...state.agentStatus, 'InvestigationPlanner': 'running' }
  });

  // 3. Prepare the InvestigationContext object
  // We extract exactly what we need for orchestration.
  const context: InvestigationContext = {
    caseId: state.caseId,
    
    // Read extracted data
    knownFacts: state.knownFacts || {},
    missingFields: state.missingFields || {},
    confidenceScores: state.confidenceScores || {},
    uploadedEvidence: state.uploadedEvidence || [],
    
    // Read interaction history
    questionHistory: state.questionHistory || [],
    answerHistory: state.answerHistory || {},
    
    // Placeholders for future phases
    retrievedCases: [],
    patterns: [],
    questionQueue: [],
    confidenceHistory: [],
    
    plannerStatus: 'ready',
    timestamps: {
      initializedAt: new Date().toISOString(),
      lastActionAt: new Date().toISOString()
    }
  };

  // 4. Update the state again to show preparation is done (for now)
  await updateInvestigationState(caseId, {
    agentStatus: { ...state.agentStatus, 'InvestigationPlanner': 'completed' }
  });

  return context;
};
