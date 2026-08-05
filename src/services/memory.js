const MEMORY_KEY = "milo_memory";

export function loadMemory() {
  const saved = localStorage.getItem(MEMORY_KEY);

  if (!saved) {
    return {};
  }

  try {
    return JSON.parse(saved);
  } catch {
    return {};
  }
}

export function saveMemory(memory) {
  localStorage.setItem(
    MEMORY_KEY,
    JSON.stringify(memory)
  );
}

export function updateMemory(newData) {
  const current = loadMemory();

  const updated = {
    ...current,
    ...newData,
  };

  saveMemory(updated);

  return updated;
}

export function clearMemory() {
  localStorage.removeItem(MEMORY_KEY);
}
export function getLatestQuestion(conversation) {
  const lastUser = [...conversation]
    .reverse()
    .find(msg => msg.sender === "user");

  return lastUser?.text || "";
}

export function getPreviousTopic(conversation) {
  if (conversation.length < 2) return "";

  const previous = [...conversation]
    .reverse()
    .find(msg => msg.sender === "assistant");

  return previous?.text || "";
}

export function buildConversationMemory(conversation) {
  return conversation
    .slice(-10)
    .map(msg => `${msg.sender}: ${msg.text}`)
    .join("\n");
}
export function deleteMemoryField(field) {
  const memory = loadMemory();
  delete memory[field];
  saveMemory(memory);
  return memory;
}

export function editMemoryField(field, value) {
  const memory = loadMemory()
  memory[field] = value;
  saveMemory(memory);
  return memory;
}