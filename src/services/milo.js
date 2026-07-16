import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();

function localReply(message) {
  const text = message.toLowerCase();

  if (/\b(hi|hello|hey)\b/.test(text)) {
    return "Hello! I’m glad you’re here. You can type, use the microphone, or build a message with signs.";
  }
  if (text.includes("your name") || text.includes("who are you")) {
    return "I’m Milo, your sign-language friendly AI companion.";
  }
  if (text.includes("sign language")) {
    return "Start the camera and hold a clear sign for a moment. I currently recognise an open palm, peace, thumbs up, a fist, and OK.";
  }
  if (text.includes("help")) {
    return "I can help through text, voice, and a small starter set of hand signs. What would you like to do?";
  }
  if (text.includes("thank")) {
    return "You’re very welcome.";
  }

  return `I understood: “${message}”. Add a Gemini key to .env for open-ended AI replies; Milo’s chat, voice, and sign tools still work offline.`;
}

export async function getMiloReply(message) {
  if (!apiKey || apiKey === "YOUR_API_KEY") return localReply(message);

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction:
        "You are Milo, a concise, warm AI sign-language companion. Never claim to be ChatGPT. Keep replies accessible and under 120 words unless asked for detail.",
    });
    const result = await model.generateContent(message);
    return result.response.text() || localReply(message);
  } catch (error) {
    console.error("Milo AI request failed", error);
    return `${localReply(message)} The online AI service is unavailable right now.`;
  }
}

export function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.96;
  utterance.pitch = 1.04;
  window.speechSynthesis.speak(utterance);
}
