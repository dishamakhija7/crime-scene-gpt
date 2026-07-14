import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { InvestigationState, initialInvestigationState } from '../models/InvestigationState';

const COLLECTION_NAME = 'investigationStates';

/**
 * Retrieves the current InvestigationState for a given case.
 * If one does not exist, it creates and returns a fresh initial state.
 * 
 * @param {string} caseId - The unique identifier of the case.
 * @returns {Promise<InvestigationState>} The current investigation state.
 */
export const getInvestigationState = async (caseId: string): Promise<InvestigationState> => {
  const docRef = doc(db, COLLECTION_NAME, caseId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as InvestigationState;
  } else {
    // Initialize a new state if it doesn't exist
    const newState = initialInvestigationState(caseId);
    await setDoc(docRef, newState);
    return newState;
  }
};

/**
 * Updates specific fields in the InvestigationState for a given case.
 * This ensures that agents only overwrite the parts of the state they are responsible for.
 * 
 * @param {string} caseId - The unique identifier of the case.
 * @param {Partial<InvestigationState>} updates - The partial state object containing the fields to update.
 * @returns {Promise<void>}
 */
export const updateInvestigationState = async (
  caseId: string, 
  updates: Partial<InvestigationState>
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, caseId);
  const docSnap = await getDoc(docRef);

  let finalUpdates: Partial<InvestigationState> = updates;

  // Safeguard: If the document somehow does not exist yet, 
  // initialize it before applying the requested updates.
  if (!docSnap.exists()) {
    const initialState = initialInvestigationState(caseId);
    finalUpdates = { ...initialState, ...updates };
  }
  
  // Always automatically update the timestamp when modifying the state
  const stateUpdates = {
    ...finalUpdates,
    'timestamps.updatedAt': new Date().toISOString(),
    'timestamps.lastAgentUpdate': new Date().toISOString()
  };

  // Safest approach: merge fields without failing if the document is missing
  await setDoc(docRef, stateUpdates, { merge: true });
};
