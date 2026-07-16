const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function detectIntent(question) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are Milo's Intent Classifier.

Classify the user's message into EXACTLY ONE category.

Return ONLY ONE WORD.

Possible categories:

GENERAL
PROGRAMMING
COMPANY
MEDICAL
SCIENCE
MATH
HISTORY
NEWS
FINANCE
EDUCATION

No explanation.
No punctuation.
Only the category.
              `,
            },
            {
              role: "user",
              content: question,
            },
          ],
          temperature: 0,
        }),
      }
    );

    const data = await response.json();

    return (
      data.choices?.[0]?.message?.content
        ?.trim()
        .toUpperCase() || "GENERAL"
    );
  } catch (err) {
    console.error(err);
    return "GENERAL";
  }
}