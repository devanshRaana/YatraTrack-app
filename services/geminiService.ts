
import { GoogleGenAI, Type } from "@google/genai";

// Ensure API_KEY is handled by the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this context, we assume the key is always present.
  console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const activitySuggestionSchema = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      description: 'A list of 3 concise travel activity suggestions.',
      items: {
        type: Type.STRING
      },
    },
  },
  required: ['suggestions']
};

const nearbySuggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        places: {
            type: Type.ARRAY,
            description: "A list of 5 interesting places or events happening nearby.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name of the place or event." },
                    description: { type: Type.STRING, description: "A short, engaging one-sentence description." },
                },
                required: ["name", "description"]
            }
        }
    },
    required: ["places"]
};


export const suggestActivity = async (origin: string, destination: string): Promise<string[]> => {
  if (!API_KEY) return Promise.resolve(['API Key not configured']);

  try {
    const prompt = `Based on a trip in Kerala, India from "${origin}" to "${destination}", suggest 3 likely and concise activities. Examples: "Commuting to work", "Shopping trip", "Visiting relatives", "Leisure travel".`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: activitySuggestionSchema,
        temperature: 0.7,
      },
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);

    if (parsed && Array.isArray(parsed.suggestions)) {
      return parsed.suggestions;
    }

    return [];
  } catch (error) {
    console.error("Error fetching activity suggestions:", error);
    // Return user-friendly error messages or fallback suggestions
    return ["Could not fetch suggestions"];
  }
};

export const getNearbySuggestions = async (latitude: number, longitude: number): Promise<{name: string, description: string}[]> => {
    if (!API_KEY) return Promise.resolve([{ name: 'API Key Error', description: 'API Key not configured.' }]);

    try {
        const prompt = `Based on the current location (latitude: ${latitude}, longitude: ${longitude}) in India, list exactly 5 interesting and diverse places, events, or activities nearby. Provide a short, engaging one-sentence description for each.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: nearbySuggestionsSchema,
                temperature: 0.8,
            },
        });

        const jsonString = response.text;
        const parsed = JSON.parse(jsonString);

        if (parsed && Array.isArray(parsed.places)) {
            return parsed.places;
        }

        return [];
    } catch (error) {
        console.error("Error fetching nearby suggestions:", error);
        return [{ name: "Error", description: "Could not fetch suggestions from the AI." }];
    }
};