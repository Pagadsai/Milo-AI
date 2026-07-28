import { rewriteQuery } from "./queryRewriter";
import { searchKnowledge } from "./searchOrchestrator";
import {
  generateResponse,
  generateStreamingResponse,
} from "./openrouter";

export async function runAgent({
  chat,
  image = null,
  domain = "GENERAL",
  shouldSearch = true,
}) {
  const conversation = chat.messages;
  let webResults = "";
  if (shouldSearch) {
    const query = await rewriteQuery(conversation);
    console.log(`${domain} Search:`, query);
    webResults = await searchKnowledge(
      domain,
      query
    );
  }
  return await generateResponse(
    conversation,
    image,
    webResults,
    chat.documents || []
  );
}
export async function runStreamingAgent({
  chat,
  image = null,
  domain = "GENERAL",
  shouldSearch = true,
  onToken,
}) {
  const conversation = chat.messages;

  let webResults = "";

  if (shouldSearch) {
    const query = await rewriteQuery(conversation);

    console.log(`${domain} Search:`, query);

    webResults = await searchKnowledge(
      domain,
      query
    );
  }

  return await generateStreamingResponse(
    conversation,
    image,
    webResults,
    chat.documents || [],
    onToken
  );
}