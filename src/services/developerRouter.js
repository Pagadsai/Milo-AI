const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function detectDeveloperIntent(question) {

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
You are Milo's Developer Router.

Return ONLY ONE WORD.

Possible values:

EXPLAIN
DEBUG
GENERATE
REVIEW
OPTIMIZE

Nothing else.
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
        .toUpperCase() || "EXPLAIN"
    );

  } catch {

    return "EXPLAIN";

  }

}