import { generateResponse } from "./openrouter";

let timer = null;

export function buildSentence(words, callback) {
  clearTimeout(timer);

  if (!words.length) {
    callback("");
    return;
  }

  timer = setTimeout(async () => {
    try {
      const response = await generateResponse([
  {
    sender: "user",
    text: `You are Milo, an AI Sign Language Interpreter.

Your job is to convert recognized sign words into natural spoken English.

Recognized signs:
${words.join(" ")}

Rules:
- Understand the meaning instead of translating word-by-word.
- Fix grammar naturally.
- Add punctuation.
- Do NOT invent facts.
- Do NOT answer the user.
- Return ONLY the interpreted sentence.

Examples:

HELLO I HELP
→ Hello, I need help.

YOU NAME WHAT
→ What's your name?

I GO SCHOOL TOMORROW
→ I'm going to school tomorrow.

I HUNGRY
→ I'm hungry.

PLEASE WATER
→ Could I have some water, please?`
  }
]);

      callback(response.trim());
    } catch {
      callback(words.join(" "));
    }
  }, 1200);
}