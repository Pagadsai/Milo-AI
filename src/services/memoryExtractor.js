import { updateMemory } from "./memory";

export function extractMemory(text) {
  const message = text.toLowerCase();

  let memory = {};

  let match =
  message.match(/my name is (.+)/i) ||
  message.match(/^hi i am ([A-Za-z]+)$/i) ||
  message.match(/^hello i am ([A-Za-z]+)$/i) ||
  message.match(/^i am ([A-Za-z]+)$/i) ||
  message.match(/^i'm ([A-Za-z]+)$/i);

  if (match) {
    memory.name = match[1].trim();
  }

  match = message.match(/i am learning (.+)/i);

  if (match) {
    memory.learning = match[1].trim();
  }

  match = message.match(/i live in (.+)/i);

  if (match) {
    memory.city = match[1].trim();
  }

  match = message.match(/my favorite language is (.+)/i);

  if (match) {
    memory.favoriteLanguage = match[1].trim();
  }

  if (Object.keys(memory).length > 0) {
    updateMemory(memory);
  }

  console.log("Extracted Memory:", memory);

  return memory;
}