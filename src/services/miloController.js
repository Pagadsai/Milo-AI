import { askAI } from "./openrouter";

export function speakText(text) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
}

export function startVoiceRecognition(setInput, setListening) {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported on this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  setListening(true);

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setInput(transcript);
  };

  recognition.onerror = (error) => {
    console.error(error);
    setListening(false);
  };

  recognition.onend = () => {
    setListening(false);
  };
}

export async function sendAIMessage({
  input,
  setInput,
  messages,
  setMessages,
}) {
  if (!input.trim()) return;

  const userMessage = {
    sender: "user",
    text: input,
  };

  const typingMessage = {
    sender: "milo",
    text: "⌨️ Milo is typing...",
  };

  const currentMessages = [
    ...messages,
    userMessage,
    typingMessage,
  ];

  setMessages(currentMessages);

  const prompt = input;

  setInput("");

  try {
    const reply = await askAI(prompt);

    const finalMessages = [...currentMessages];

    finalMessages[finalMessages.length - 1] = {
      sender: "milo",
      text: reply,
    };

    setMessages(finalMessages);

    speakText(reply);
  } catch (error) {
    console.error(error);

    const finalMessages = [...currentMessages];

    finalMessages[finalMessages.length - 1] = {
      sender: "milo",
      text: "❌ Unable to connect to Milo AI.",
    };

    setMessages(finalMessages);
  }
}