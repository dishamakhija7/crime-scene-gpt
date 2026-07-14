import { getInvestigationState, updateInvestigationState } from './investigationStateService';
import { callGroqWithStructuredOutput } from './groqService';
import { getCaseById } from './firestore';

const schema = {
  type: "OBJECT",
  properties: {
    knownFacts: { 
      type: "OBJECT", 
      description: "Structured object of known facts. Keys should be fields like weather, roadType, collisionType, vehicleCount, vehicleTypes, lighting, roadCondition, impactPoint, timeOfDay, location. Values should be the inferred fact."
    },
    missingFields: { 
      type: "OBJECT", 
      description: "Structured object of required reconstruction fields (e.g. vehicleSpeed, lanePosition, visibility, trafficSignal, driverAction, vehicleDirection). Values must be one of: 'missing', 'answered', 'inferred', 'unknown'."
    },
    confidenceScores: { 
      type: "OBJECT",
      description: "Confidence (0-100) per extracted field, e.g. { 'weather': 95, 'collisionType': 88 }"
    },
    reasoning: { 
      type: "OBJECT",
      description: "Short explanation for every inferred field, e.g. { 'weather': 'Identified from witness statement' }. Do not hallucinate. If evidence is insufficient, mark field as unknown."
    }
  },
  required: [
    "knownFacts",
    "missingFields",
    "confidenceScores",
    "reasoning"
  ]
};

export const analyzeEvidence = async (caseId) => {
  if (!caseId) throw new Error("No case ID provided for analysis.");

  try {
    // 1. Mark agent as running
    await updateInvestigationState(caseId, {
      status: 'investigating',
      agentStatus: { 'EvidenceAnalysisAgent': 'running' }
    });

    // 2. Fetch the current investigation state and initial case data
    const state = await getInvestigationState(caseId);
    const caseData = await getCaseById(caseId);

    // 3. Prepare the prompt and context
    let contextPrompt = `You are an expert forensic accident investigator AI. Analyze ALL available evidence for Case ID: ${caseId} to determine known facts and missing information.\n\n`;
    
    contextPrompt += `=== SOURCE 1: Structured Case Details (VERIFIED) ===\n`;
    if (caseData) {
      contextPrompt += `Treat the following structured case details entered by the investigator as VERIFIED information:\n`;
      contextPrompt += JSON.stringify(caseData, null, 2) + `\n\n`;
    } else {
      contextPrompt += `No structured case data found.\n\n`;
    }

    contextPrompt += `=== SOURCE 2: Uploaded Evidence (SUPPORTING) ===\n`;
    if (state.uploadedEvidence && state.uploadedEvidence.length > 0) {
      contextPrompt += `Treat witness statements and uploaded evidence as additional sources that can confirm, enrich, complete, or correct obvious inconsistencies.\n`;
      state.uploadedEvidence.forEach((ev, idx) => {
        contextPrompt += `Evidence ${idx + 1}: ${ev.type} - ${ev.originalName || 'Unnamed'}\n`;
        if (ev.url) {
          contextPrompt += `URL: ${ev.url}\n`;
        }
        if (ev.timestamp) {
          contextPrompt += `Timestamp: ${ev.timestamp}\n`;
        }
      });
    } else {
      contextPrompt += `No evidence uploaded yet.\n`;
    }

    contextPrompt += `\n=== NEW DECISION RULES ===
1. You must intelligently merge information from ALL available sources.
2. Structured Case Details (Source 1) are VERIFIED. Do not mark fields provided there as missing.
3. Uploaded Evidence (Source 2) supplements Source 1.
4. Only set a field in 'missingFields' to "missing" if it cannot be determined from ANY available source.
5. If multiple sources disagree, priority is: 1. Structured Case Data, 2. Uploaded image/video, 3. Witness statement, 4. Metadata.
6. If confidence is low due to conflict, store reasoning explaining the conflict.

Extract structured information into knownFacts and missingFields. For every inferred fact, provide a confidence score (0-100) and a short reasoning explanation. Return ONLY the JSON structure matching the schema.`;

    // 4. Call Groq
    const result = await callGroqWithStructuredOutput({
      prompt: contextPrompt,
      schema: schema,
      model: 'llama-3.3-70b-versatile'
    });

    // 5. Update InvestigationState
    // Extract perField confidence scores and calculate an overall average
    const perFieldScores = result.confidenceScores || {};
    const scoresArray = Object.values(perFieldScores).filter(v => typeof v === 'number');
    const overallScore = scoresArray.length > 0 ? scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length : 0;

    await updateInvestigationState(caseId, {
      knownFacts: result.knownFacts || {},
      missingFields: result.missingFields || {},
      confidenceScores: {
        overall: overallScore,
        evidenceQuality: overallScore, // Placeholder until a specific quality metric is calculated
        patternMatch: 0,
        perField: perFieldScores
      },
      reasoning: result.reasoning || {},
      agentStatus: { 'EvidenceAnalysisAgent': 'completed' },
      // Leave status as investigating so the next agent can pick it up
    });

    return result;
  } catch (error) {
    console.error("Evidence Analysis Agent error:", error);
    
    // Mark agent as failed
    await updateInvestigationState(caseId, {
      agentStatus: { 'EvidenceAnalysisAgent': 'failed' }
    });
    
    throw error;
  }
};
