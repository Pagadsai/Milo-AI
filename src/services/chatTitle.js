const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function generateChatTitle(message) {
  try {
    const res = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          temperature: 0,
          messages: [
            {
              role: "system",
              content: `
Generate a short conversation title.

Rules:
- 2 to 4 words only.
- Don't use quotation marks.
- Don't repeat the user's sentence.
- Make it sound like a ChatGPT conversation title.

Examples:
Explain React Hooks -> React Hooks
Explain me about esports -> Esports Overview
Who is Elon Musk -> Elon Musk
Fix my React error -> React Debugging
Hello -> Greetings
`
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await res.json();

    return data.choices[0].message.content.trim();

  } catch {

    return "New Conversation";

  }
}