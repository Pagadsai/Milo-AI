import { useEffect, useRef, useState } from "react";
import {
  FiMic,
  FiSend,
  FiSquare,
  FiPaperclip,
  FiX,
} from "react-icons/fi";
export default function ChatWindow({
  messages,
  draft,
  isThinking,
  onDraftChange,
  onSend,
}) {
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isThinking]);
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);
  function toggleListening() {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError(
        "Voice input is not supported in this browser."
      );
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    setVoiceError("");
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setVoiceError(
        "I couldn't hear that. Please try again."
      );
    };
    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;
      onDraftChange(
        [draft.trim(), transcript]
          .filter(Boolean)
          .join(" ")
      );
    };
    recognition.start();
  }
  function chooseImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedImage(file);
  }
  function submit(event) {
    event.preventDefault();
    onSend(draft, selectedImage);
    setSelectedImage(null);
  }
  return (
    <section
      className="chat-panel"
      aria-label="Conversation with Milo"
    >
      <div
        className="messages"
        aria-live="polite"
      >
        <div className="day-label">
          Today
        </div>
        {messages.map((message) => (
          <article
            className={`message-row ${message.sender}`}
            key={message.id}
          >
            {message.sender === "milo" && (
              <div
                className="message-avatar"
                aria-hidden="true"
              >
                M
              </div>
            )}
            <div className="message-bubble">
              {message.image && (
                <img
                  src={message.image}
                  alt="Uploaded"
                  className="chat-image"
                />
              )}
              {message.text}
            </div>
          </article>
        ))}
        {isThinking && (
          <article className="message-row milo">
            <div className="message-avatar">
              M
            </div>
            <div
              className="message-bubble typing"
              aria-label="Milo is thinking"
            >
              <span />
              <span />
              <span />
            </div>
          </article>
        )}
        <div ref={bottomRef} />
      </div>
      <form
        className="composer"
        onSubmit={submit}
      >
        {voiceError && (
          <p className="input-note error-note">
            {voiceError}
          </p>
        )}
        {selectedImage && (
          <div className="image-preview">
            🖼 {selectedImage.name}
            <button
              type="button"
              className="remove-image"
              onClick={() =>
                setSelectedImage(null)
              }
            >
              <FiX />
            </button>
          </div>
        )}
        <div className="composer-box">
          <label className="composer-action">
            <FiPaperclip />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={chooseImage}
            />
          </label>
          <textarea
            aria-label="Message Milo"
            value={draft}
            placeholder="Type a message or add detected signs..."
            rows={1}
            onChange={(event) =>
              onDraftChange(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                onSend(draft, selectedImage);
                setSelectedImage(null);
              }
            }}
          />
          <button
            className={`composer-action ${
              isListening
                ? "listening"
                : ""
            }`}
            type="button"
            onClick={toggleListening}
          >
            {isListening ? (
              <FiSquare />
            ) : (
              <FiMic />
            )}
          </button>
          <button
            className="send-button"
            type="submit"
            disabled={
              !draft.trim() || isThinking
            }
          >
            <FiSend />
          </button>
        </div>
        <p className="input-note">
          Press Enter to send · Shift +
          Enter for a new line
        </p>
      </form>
    </section>
  );
}