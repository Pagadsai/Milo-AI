import { runAgent } from "./agentBase";

export async function companyAgent(chat, image = null) {

  return await runAgent({
    chat,
    image,
    domain: "COMPANY",
    shouldSearch: true,
  });

}