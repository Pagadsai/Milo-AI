import { improveSearchQuery } from "./openrouter";

export async function rewriteQuery(messages) {
  const conversation = messages
    .slice(-10)
    .map((m) => `${m.sender}: ${m.text}`)
    .join("\n");

  return await improveSearchQuery(`
You are Milo's Search Query Rewriter.

Your job is to rewrite the user's latest question into the BEST possible web search query.

Rules:

- Use the previous conversation for context.
- Resolve pronouns like:
  - it
  - they
  - he
  - she
  - this
  - that
- Fix spelling mistakes.
- Expand abbreviations.
- Include company names if missing.
- Include programming language names if needed.
- Return ONLY the rewritten search query.

Conversation:

${conversation}
`);
}