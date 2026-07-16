import { runAgent } from "./agentBase";
import { detectDeveloperIntent } from "./developerRouter";

export async function developerAgent(chat, image = null) {

  const latestQuestion =
    chat.messages[chat.messages.length - 1].text;

  const devIntent =
    await detectDeveloperIntent(latestQuestion);

  console.log("Developer Intent:", devIntent);

  return await runAgent({
    chat,
    image,
    domain: "PROGRAMMING",
    shouldSearch: true,
  });
}