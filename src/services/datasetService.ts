/**
 * src/services/datasetService.ts
 * 
 * Helper utility for fetching and parsing local Kaggle CSV datasets.
 * Designed to be used by the upcoming RAG Retrieval Agent.
 */

export interface ParsedCSV {
  headers: string[];
  rows: Record<string, string>[];
}

/**
 * Fetches a CSV file from the public/data directory and parses it into JSON objects.
 * 
 * @param {string} filename - The name of the CSV file (e.g. 'india_accidents_20k.csv')
 * @returns {Promise<ParsedCSV>} The parsed headers and rows
 */
export const loadLocalDataset = async (filename: string): Promise<ParsedCSV> => {
  try {
    // We fetch from the /data/ route which maps to the public/data/ directory in Vite
    const response = await fetch(`/data/${filename}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load dataset: ${filename} (Status: ${response.status})`);
    }

    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error(`Error loading dataset ${filename}:`, error);
    throw error;
  }
};

/**
 * Basic native CSV parser that handles quotes properly.
 * 
 * @param {string} text - Raw CSV string
 * @returns {ParsedCSV}
 */
const parseCSV = (text: string): ParsedCSV => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  // Parse headers (assuming first row doesn't have complex quoted commas for simplicity)
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Simple regex to split by comma, ignoring commas inside quotes
    const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    
    if (!matches) continue;

    const rowObj: Record<string, string> = {};
    matches.forEach((val, index) => {
      if (index < headers.length) {
        // Remove enclosing quotes if they exist
        rowObj[headers[index]] = val.replace(/^"|"$/g, '').trim();
      }
    });
    
    // Only push valid rows that parsed correctly
    if (Object.keys(rowObj).length > 0) {
      rows.push(rowObj);
    }
  }

  return { headers, rows };
};
