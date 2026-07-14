import Groq from 'groq-sdk';

/**
 * Initializes the Groq API client.
 */
const getGroqClient = () => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.error("Missing VITE_GROQ_API_KEY in environment variables.");
    throw new Error("Missing Groq API Key");
  }
  // dangerouslyAllowBrowser is required for Vite client-side calls
  return new Groq({ apiKey, dangerouslyAllowBrowser: true });
};

/**
 * Calls the Groq API with structured output using JSON mode.
 * 
 * @param {Object} params
 * @param {string} params.prompt - The instruction or prompt for the model.
 * @param {Array<Object>} [params.mediaInputs] - Optional array of media inputs or context (ignored by standard text models).
 * @param {Object} params.schema - The JSON schema structure to enforce.
 * @param {string} [params.model] - The Groq model to use.
 * @returns {Promise<Object>} The parsed structured JSON.
 */
export const callGroqWithStructuredOutput = async ({
  prompt,
  mediaInputs = [],
  schema,
  model = 'llama-3.3-70b-versatile',
  maxRetries = 3
}) => {
  const groq = getGroqClient();
  let attempt = 0;

  // Append schema instructions to ensure the model matches the required structure
  const systemPrompt = `You are an expert AI. You MUST respond in pure JSON.
The JSON must strictly follow this schema:
${JSON.stringify(schema, null, 2)}`;

  // Convert Gemini media inputs to Groq format if any (usually text/image URLs if vision model is used)
  // For llama-3.3-70b, we just extract text or ignore binary media.
  let combinedPrompt = prompt;
  if (mediaInputs && mediaInputs.length > 0) {
    // If the input was simple text strings wrapped in objects, append them.
    // If it's actual binary, Groq's text models will ignore them.
    combinedPrompt += "\n\nAdditional Context Provided:\n" + JSON.stringify(mediaInputs);
  }

  while (attempt <= maxRetries) {
    try {
      const chatCompletionPromise = groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: combinedPrompt }
        ],
        model: model,
        response_format: { type: "json_object" }
      });

      // 15 second timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Groq API request timed out after 15 seconds.")), 15000)
      );

      const response = await Promise.race([chatCompletionPromise, timeoutPromise]);

      const responseText = response.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error("Groq returned an empty response.");
      }

      return JSON.parse(responseText);
    } catch (error) {
      attempt++;

      const errorMessage = error?.message || '';
      const isRateLimitOr503 = error?.status === 503 || error?.status === 429 ||
        errorMessage.includes('503') || errorMessage.includes('429') ||
        errorMessage.includes('UNAVAILABLE') || errorMessage.includes('timed out');

      // If we are out of retries OR the error is not a transient error, fail immediately.
      if (attempt > maxRetries || !isRateLimitOr503) {
        console.error(`Error calling Groq API (Attempt ${attempt}):`, error);
        throw error;
      }

      // Exponential backoff delay (2s, 4s, 8s...)
      const delayMs = 2000 * Math.pow(2, attempt - 1);
      console.warn(`Groq API 503/Timeout. Retrying in ${delayMs}ms... (Attempt ${attempt}/${maxRetries})`);
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
};
