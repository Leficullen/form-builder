import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize the API with your key
// make sure to create a .env file in the root directory with VITE_GEMINI_API_KEY=your_key_here
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface MatchResult {
  score: number;
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
}

export async function analyzeMatch(
  name1: string,
  image1Base64: string,
  name2: string,
  image2Base64: string
): Promise<MatchResult> {
  // Mock response if no API key is present (for development safety)
  if (!API_KEY) {
    console.warn("No API Key found. Using mock response.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          score: 85,
          title: "Cosmic Connection",
          description:
            "Your energies align in a spectacular display of harmony. While you both approach life differently, these differences complement each other perfectly like sun and moon.",
          strengths: ["Communication", "Shared Values", "Emotional Support"],
          challenges: ["Different hobbies", "Sleep schedules"],
        });
      }, 2000);
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Use the gemini-1.5-flash model for speed and cost-effectiveness
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. Construct the prompt
    // We ask for JSON output for easier parsing
    const prompt = `
      Analyze the compatibility between ${name1} and ${name2} based on their names and appearance (conceptual).
      Provide a fun, astrological-style compatibility reading.
      
      Return ONLY a JSON object with this structure (no markdown):
      {
        "score": number (1-100),
        "title": "Short romantic title",
        "description": "2-3 sentences description",
        "strengths": ["strength1", "strength2", "strength3"],
        "challenges": ["challenge1", "challenge2"]
      }
    `;

    // 3. Prepare image parts
    // The API expects base64 data without the 'data:image/...' prefix
    const imagePart1 = {
      inlineData: {
        data: image1Base64.split(",")[1],
        mimeType: "image/jpeg", // Assuming JPEG for simplicity, can handle dynamic types if improved
      },
    };

    const imagePart2 = {
      inlineData: {
        data: image2Base64.split(",")[1],
        mimeType: "image/jpeg",
      },
    };

    // 4. Generate content
    const result = await model.generateContent([
      prompt,
      imagePart1,
      imagePart2,
    ]);
    const response = await result.response;
    const text = response.text();

    // 5. Parse JSON
    // Clean up any potential markdown code blocks like ```json ... ```
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText) as MatchResult;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Failed to analyze compatibility. Please try again.");
  }
}
