import {
  runAgent,
  runStreamingAgent,
} from "./agentBase";

export async function generalAgent(chat, image = null) {

  return await runAgent({
    chat,
    image,
    domain: "GENERAL",
    shouldSearch: true,
  });

}
export async function streamingGeneralAgent(
  chat,
  image = null,
  onToken
) {
  return await runStreamingAgent({
    chat,
    image,
    domain: "GENERAL",
    shouldSearch: true,
    onToken,
  });
}