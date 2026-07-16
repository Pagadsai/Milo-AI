import { runAgent } from "./agentBase";

export async function generalAgent(chat, image = null) {

  return await runAgent({
    chat,
    image,
    domain: "GENERAL",
    shouldSearch: true,
  });

}