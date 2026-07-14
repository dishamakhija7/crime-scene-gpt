import Papa from 'papaparse';

/**
 * Reads and parses a CSV dataset from a given static URL.
 * Example: loadLocalDataset('/datasets/india_accidents_20k.csv')
 * 
 * @param {string} fileUrl - The static HTTP path to the CSV file.
 * @returns {Promise<any[]>} A promise that resolves to an array of objects representing the rows.
 */
export const loadLocalDataset = (fileUrl: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileUrl, {
      download: true, // Crucial: Tells PapaParse to fetch the URL instead of parsing a raw string
      header: true,   // Automatically maps CSV columns to object keys
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically converts numbers/booleans from strings
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          console.warn("CSV Reader encountered some parsing warnings:", results.errors);
        }
        resolve(results.data);
      },
      error: (error) => {
        console.error("Failed to parse CSV file:", error);
        reject(error);
      }
    });
  });
};
