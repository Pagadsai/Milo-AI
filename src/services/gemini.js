import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("API KEY:", import.meta.env.VITE_GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export async function askGemini(prompt) {
  try {
    const result = await model.generateContent(prompt);
    console.log(result);
    return result.response.text();
  } catch (error) {
    console.error("GEMINI ERROR:", error);
    throw error;
  }
}