import { detectIntent } from "./intent";
import { isTeachingRequest } from "./teacher";
import { developerAgent } from "./developerAgent";
import { generalAgent } from "./generalAgent";
import { companyAgent } from "./companyAgent";

import {
  buildConversationMemory,
  getLatestQuestion,
  getPreviousTopic,
} from "./memory";

export async function askMilo(chat, image = null) {
  const conversation = chat.messages;

  const memory = buildConversationMemory(conversation);

  const latestQuestion = getLatestQuestion(conversation);
  const previousTopic = getPreviousTopic(conversation);

  console.log("Latest Question:", latestQuestion);
  console.log("Previous Topic:", previousTopic);

  const intent = await detectIntent(latestQuestion);

  const teaching = isTeachingRequest(latestQuestion);

  console.log("Intent:", intent);
  console.log("Teaching Mode:", teaching);

  if (teaching) {
    return await generalAgent(chat, image);
  }
  switch(intent){
    case "PROGRAMMING":
        return await developerAgent(chat,image);
    case "COMPANY":
        return await companyAgent(chat,image);
    default:
        return await generalAgent(chat,image);
  }
}