const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function generateResponse(
  conversation,
  image = null,
  webResults = "",
  documents = []
){
  try {
    const formattedMessages = conversation.map((msg, index) => {
      const isLastUser =
        msg.sender === "user" &&
        index === conversation.length - 1;

      const isImage =
        image &&
        typeof image === "string" &&
        image.startsWith("data:image");

      if (isImage && isLastUser) {
        return {
          role: "user",
          content: [
            {
              type: "text",
              text: msg.text,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        };
      }

      return {
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      };
    });
    let documentContext = "";
    if (documents.length) {
      documentContext =
        documents
          .map(
            (doc) => `
    Document Name:
    ${doc.name}
    Document Content:
    ${doc.text}
    `
          )
          .join("\n\n----------------------\n\n");
    }
    console.log("===== DOCUMENT CONTEXT =====");
    console.log(documentContext);
    console.log("============================");
    const response = await fetch(API_URL, { 
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },

      body: JSON.stringify({
        model: "openai/gpt-4o-mini",

        temperature: 0.2,

        messages: [
          {
            role: "system",
            content: `
        You are Milo, an intelligent AI tutor.

        Your highest priority is factual accuracy.

        Never invent facts.

        Never invent names.

        Never invent CEOs.

        Never invent founders.

        Never invent dates.

        Never guess.

        When web search results are available:

        1. Read ALL search results completely.
        2. Compare information across all sources.
        3. Prefer information repeated by multiple reliable sources.
        4. Prefer official company websites over all other sources.
        5. Prefer official documentation over blogs.
        6. Prefer government and university websites when applicable.
        7. If two reliable sources disagree, do not guess.
        8. Answer naturally.
        9. Never mention that you searched the web.
        10. Never mention confidence scores.
        11. Never mention source rankings.
        12. The user should feel like you already know the answer.

        Web Search Results:

        ${webResults}

        Uploaded Documents:

        ${documentContext}

        Rules for uploaded documents:

        - If uploaded documents are available, use them as your primary source.
        - Answer questions using the uploaded document whenever possible.
        - If the answer is not found in the uploaded document, use your general knowledge or web results.
        - Never invent information that is not present in the uploaded document.
        `,
          },
          ...formattedMessages,
        ],
      }),
    });

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("OpenRouter Response:", data);

    if (!response.ok) {
      console.error("Full Error:", data);
      if (data.error) {
        console.error("Error Message:", data.error.message);
        console.error("Error Code:", data.error.code);
        console.error("Metadata:", data.error.metadata);
      }
      return data.error?.message || "API Error";
    }

    return (
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response."
    );
  } catch (err) {
    console.error(err);
    return "Something went wrong.";
  }
}
export async function improveSearchQuery(query) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: `
You rewrite user questions into the best possible search engine query.

Rules:

- Correct spelling mistakes.
- Correct grammar.
- Expand abbreviations.
- Resolve context.
- Understand follow-up questions.
- Return ONLY the rewritten search query.
- Do NOT answer the question.
`,
          },
          {
            role: "user",
            content: query,
          },
        ],
      }),
    });

    const data = await response.json();

    return (
      data?.choices?.[0]?.message?.content?.trim() ||
      query
    );
  } catch (err) {
    console.error(err);
    return query;
  }
}