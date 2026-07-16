export function buildConversationMemory(messages) {
  return messages
    .slice(-15)
    .map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));
}

export function getRecentMessages(messages, count = 6) {
  return messages.slice(-count);
}

export function getLatestQuestion(messages) {
  const userMessages = messages.filter(
    (m) => m.sender === "user"
  );

  if (!userMessages.length) {
    return "";
  }

  return userMessages[userMessages.length - 1].text;
}

export function getPreviousTopic(messages) {
  const userMessages = messages.filter(
    (m) => m.sender === "user"
  );

  if (userMessages.length < 2) {
    return "";
  }

  return userMessages[userMessages.length - 2].text;
}

export function getLastAssistantReply(messages) {
  const assistantMessages = messages.filter(
    (m) => m.sender === "milo"
  );

  if (!assistantMessages.length) {
    return "";
  }

  return assistantMessages[assistantMessages.length - 1].text;
}

export function getLastUserMessage(messages) {
  const userMessages = messages.filter(
    (m) => m.sender === "user"
  );

  if (!userMessages.length) {
    return "";
  }

  return userMessages[userMessages.length - 1].text;
}

export function getCurrentTopic(messages) {
  const last = getLastUserMessage(messages);

  if (!last) return "";

  return last
    .replace(/[?.!,]/g, "")
    .trim()
    .toLowerCase();
}