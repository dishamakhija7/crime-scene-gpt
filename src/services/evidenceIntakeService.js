import { getEvidenceByCase } from './evidenceService';
import { getCaseById } from './firestore';
import { callGeminiWithStructuredOutput } from './geminiService';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const schema = {
  type: "OBJECT",
  properties: {
    executiveSummary: { type: "STRING" },
    incidentType: { type: "STRING" },
    vehiclesDetected: { type: "ARRAY", items: { type: "STRING" } },
    peopleDetected: { type: "ARRAY", items: { type: "STRING" } },
    roadLayout: { type: "STRING" },
    trafficSignsSignals: { type: "ARRAY", items: { type: "STRING" } },
    weather: { type: "STRING" },
    lightingConditions: { type: "STRING" },
    timelineClues: { type: "ARRAY", items: { type: "STRING" } },
    objectsDetected: { type: "ARRAY", items: { type: "STRING" } },
    knownFacts: { type: "ARRAY", items: { type: "STRING" } },
    uncertainFacts: { type: "ARRAY", items: { type: "STRING" } },
    missingInformation: { type: "ARRAY", items: { type: "STRING" } },
    observations: { type: "ARRAY", items: { type: "STRING" } },
    confidenceScore: { type: "NUMBER" },
    additionalNotes: { type: "STRING" }
  },
  required: [
    "executiveSummary",
    "incidentType",
    "vehiclesDetected",
    "peopleDetected",
    "roadLayout",
    "weather",
    "lightingConditions",
    "confidenceScore"
  ]
};

export const analyzeEvidence = async (caseId) => {
  if (!caseId) throw new Error("No case ID provided for analysis.");

  try {
    // 1. Fetch the case and its uploaded evidence
    const caseData = await getCaseById(caseId);
    const evidenceList = await getEvidenceByCase(caseId);

    // 2. Prepare the prompt and context
    let contextPrompt = `You are an expert forensic accident investigator AI. Analyze the following evidence for Case ID: ${caseId}.\n\n`;
    
    if (caseData) {
      contextPrompt += `Initial Case Details:\n`;
      contextPrompt += JSON.stringify(caseData, null, 2) + `\n\n`;
    }

    contextPrompt += `Uploaded Evidence Metadata:\n`;
    evidenceList.forEach((ev, idx) => {
      contextPrompt += `Evidence ${idx + 1}: ${ev.type} - ${ev.originalName || 'Unnamed'}\n`;
      if (ev.cloudinaryUrl) {
        contextPrompt += `URL: ${ev.cloudinaryUrl}\n`;
      }
    });

    contextPrompt += `\nBased on this information (and the URLs provided if you can process them), provide a comprehensive structured analysis of the incident. Note: if you cannot directly read the URLs, infer as much as possible from the types and names of the evidence uploaded combined with the initial case details. Do not generate follow-up questions yet. Return ONLY the JSON structure.`;

    // 3. Call Gemini
    const result = await callGeminiWithStructuredOutput({
      prompt: contextPrompt,
      schema: schema,
      model: 'gemini-3.5-flash'
    });

    // 4. Save structured JSON to Firestore under the case document
    const caseRef = doc(db, 'cases', caseId);
    await updateDoc(caseRef, {
      aiAnalysis: result,
      updatedAt: new Date().toISOString()
    });

    return result;
  } catch (error) {
    console.error("Evidence Intake Service error:", error);
    throw error;
  }
};
