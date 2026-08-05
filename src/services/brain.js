import { detectIntent } from "./intent";
import { isTeachingRequest } from "./teacher";
import { developerAgent } from "./developerAgent";
import {
  generalAgent,
  streamingGeneralAgent,
} from "./generalAgent";
import { companyAgent } from "./companyAgent";
import { extractMemory } from "./memoryExtractor";
import { updateMemory } from "./memory";
import {
  buildConversationMemory,
  getLatestQuestion,
  getPreviousTopic,
} from "./memory";

export async function askMilo(chat, image = null) {
  const conversation = chat.messages;
  const lastUser = [...conversation]
    .reverse()
    .find(msg => msg.sender === "user");

  if (lastUser) {
    const memory = await extractMemory(lastUser.text);
    console.log("Extracted Memory:", memory);
    if (memory && Object.keys(memory).length > 0) {
        updateMemory(memory);
        console.log("Memory Saved:", memory);
    }
  }
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
export async function askMiloStreaming(
  chat,
  image = null,
  onToken
) {
  const conversation = chat.messages;
  const lastUser = [...conversation]
    .reverse()
    .find(msg => msg.sender === "user");
    
  if (lastUser) {
    const memory = extractMemory(lastUser.text);

    if (Object.keys(memory).length > 0) {
      updateMemory(memory);
      console.log("Memory Saved:", memory);
    }
  }
  const latestQuestion = getLatestQuestion(conversation);
  const intent = await detectIntent(latestQuestion);
  const teaching = isTeachingRequest(latestQuestion);
  if (teaching) {
    return streamingGeneralAgent(chat, image, onToken);
  }

  switch (intent) {
    case "PROGRAMMING":
      return generalAgent(chat, image);

    case "COMPANY":
      return generalAgent(chat, image);

    default:
      return streamingGeneralAgent(
        chat,
        image,
        onToken
      );
  }
}