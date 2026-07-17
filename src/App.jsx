import WelcomeScreen from "./components/WelcomeScreen";
import { useEffect, useMemo, useState } from "react";
import { FiMenu } from "react-icons/fi";
import "./App.css";
import { generateChatTitle } from "./services/chatTitle";
import CameraPanel from "./components/CameraPanel";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";

import { speak } from "./services/milo";
import { askMilo } from "./services/brain";
import { generateResponse } from "./services/openrouter";

const STORAGE_KEY = "milo_chats_v2";

function makeId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random()}`
  );
}

function createChat() {
  return {
    id: makeId(),
    title: "New conversation",
    messages: [
      {
        id: makeId(),
        sender: "milo",
        text: "Hi, I'm Milo. Type, speak, or show me a sign and we'll take it from there.",
      },
    ],
  };
}

function loadChats() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "null"
    );

    return Array.isArray(saved) && saved.length
      ? saved
      : [createChat()];
  } catch {
    return [createChat()];
  }
}

export default function App() {
  const [chats, setChats] = useState(loadChats);

  const [activeId, setActiveId] = useState(
    () => loadChats()[0].id
  );

  const [draft, setDraft] = useState("");

  const [signWords, setSignWords] = useState([]);

  const [isThinking, setIsThinking] = useState(false);

  const [autoSpeak, setAutoSpeak] = useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [showWelcome, setShowWelcome] =
    useState(true);

  const activeChat = useMemo(
    () =>
      chats.find(
        (chat) => chat.id === activeId
      ) || chats[0],
    [activeId, chats]
  );

  useEffect(() => {
    const chatsToSave = chats.filter((chat) =>
      chat.messages.some(
        (message) =>
          message.sender === "user"
      )
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(chatsToSave)
    );
  }, [chats]);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    if (params.get("newChat") === "true") {
      startNewChat();

      window.history.replaceState(
        {},
        "",
        "/"
      );
    }
  }, []);

  useEffect(() => {
    const sessionStarted =
      sessionStorage.getItem(
        "milo_session"
      );

    if (!sessionStarted) {
      sessionStorage.setItem(
        "milo_session",
        "true"
      );

      const latestChat = chats[0];

      if (
        latestChat &&
        latestChat.messages.length > 1
      ) {
        const chat = createChat();

        setChats((current) => [
          chat,
          ...current,
        ]);

        setActiveId(chat.id);
      } else if (latestChat) {
        setActiveId(latestChat.id);
      }
    }
  }, []);

  function updateChat(chatId, update) {
    setChats((current) =>
      current.map((chat) =>
        chat.id === chatId
          ? update(chat)
          : chat
      )
    );
  }

  function startNewChat() {
    const chat = createChat();

    setChats((current) => [
      chat,
      ...current,
    ]);

    setActiveId(chat.id);

    setDraft("");

    setSignWords([]);

    setSidebarOpen(false);
  }

  function deleteChat(chatId) {
    setChats((current) => {
      const remaining =
        current.filter(
          (chat) =>
            chat.id !== chatId
        );

      if (remaining.length === 0) {
        const replacement =
          createChat();

        setActiveId(
          replacement.id
        );

        return [replacement];
      }

      if (chatId === activeId) {
        setActiveId(
          remaining[0].id
        );
      }

      return remaining;
    });
  }

  function renameChat(chatId, title) {
    const cleanTitle =
      title.trim();

    if (!cleanTitle) return;

    updateChat(chatId, (chat) => ({
      ...chat,
      title: cleanTitle,
    }));
  }

  function openNewTab() {
    window.open(
      "/?newChat=true",
      "_blank"
    );
  }

  function fileToBase64(file) {
    return new Promise(
      (resolve, reject) => {
        const reader =
          new FileReader();

        reader.onload = () =>
          resolve(reader.result);

        reader.onerror = (
          error
        ) =>
          reject(error);

        reader.readAsDataURL(
          file
        );
      }
    );
  }
  function generateTitle(firstMessage) {
  const text = firstMessage.toLowerCase().trim();

  if (/^(hi|hello|hey|hii|heyy|good morning|good afternoon|good evening)\b/.test(text)) {
    return "👋 Greetings";
  }

  if (text.startsWith("explain ")) {
    return firstMessage.slice(8).trim();
  }

  if (text.startsWith("what is ")) {
    return `About ${firstMessage.slice(8).trim()}`;
  }

  if (text.startsWith("who is ")) {
    return `About ${firstMessage.slice(7).trim()}`;
  }

  if (text.startsWith("how to ")) {
    return `How to ${firstMessage.slice(7).trim()}`;
  }

  return firstMessage.length > 30
    ? firstMessage.slice(0, 30) + "..."
    : firstMessage;
}

    async function sendMessage(rawText, image) {
    const text = rawText.trim();

    if (!text || isThinking) return;

    const targetChatId = activeChat.id;

    const userMessage = {
      id: makeId(),
      sender: "user",
      text,
      image: image
        ? URL.createObjectURL(image)
        : null,
    };
    let title = activeChat.title;
    if (activeChat.messages.length === 1) {
      title = await generateChatTitle(text);
    }
    updateChat(targetChatId, (chat) => ({
      ...chat,
      title,
      messages: [
        ...chat.messages,
        userMessage,
      ],
    }));
    setDraft("");
    setSignWords([]);
    setIsThinking(true);

    try {
      let imageData = null;

      if (image) {
        imageData =
          await fileToBase64(image);
      }

      const conversation = [
        ...activeChat.messages,
        userMessage,
      ];

      const reply = await askMilo(
        {
          messages: conversation,
        },
        imageData
      );

      updateChat(targetChatId, (chat) => ({
        ...chat,
        messages: [
          ...chat.messages,
          {
            id: makeId(),
            sender: "milo",
            text: reply,
          },
        ],
      }));

      if (autoSpeak) {
        speak(reply);
      }
    } catch (err) {
      console.error(err);

      updateChat(targetChatId, (chat) => ({
        ...chat,
        messages: [
          ...chat.messages,
          {
            id: makeId(),
            sender: "milo",
            text:
              "Sorry, something went wrong.",
          },
        ],
      }));
    } finally {
      setIsThinking(false);
    }
  }

  function addDetectedSign(word) {
    setSignWords((current) => [
      ...current.slice(-5),
      word,
    ]);
  }

  async function useDetectedSigns() {
    if (!signWords.length) return;

    const rawSentence =
      signWords.join(" ").toLowerCase();

    try {
      const corrected =
        await generateResponse([
          {
            sender: "user",
            text: `Convert these recognized sign words into a natural English sentence.

Words:
${rawSentence}

Return ONLY the corrected sentence.`,
          },
        ]);

      setDraft((current) =>
        [current.trim(), corrected]
          .filter(Boolean)
          .join(" ")
      );
    } catch {
      setDraft((current) =>
        [current.trim(), rawSentence]
          .filter(Boolean)
          .join(" ")
      );
    }
  }

  if (showWelcome) {
    return (
      <WelcomeScreen
        onFinish={() =>
          setShowWelcome(false)
        }
      />
    );
  }

  return (
        <>
      <div className="app-shell">

        <Sidebar
          chats={chats}
          activeId={activeChat.id}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelect={(id) => {
            setActiveId(id);
            setSidebarOpen(false);
          }}
          onNew={startNewChat}
          onDelete={deleteChat}
          onRename={renameChat}
        />

        <main className="workspace">

          <header className="topbar">

            <div className="brand-row">

              <button
                className="icon-button menu-button"
                type="button"
                aria-label="Open conversations"
                onClick={() => setSidebarOpen(true)}
              >
                <FiMenu />
              </button>

              <button
                className="icon-button"
                type="button"
                onClick={openNewTab}
                title="Open in new tab"
              >
                ↗
              </button>

              <div
                className="milo-mark"
                aria-hidden="true"
              >
                M
              </div>

              <div>
                <h1>Milo</h1>
                <p>
                  AI sign-language companion
                </p>
              </div>

            </div>

            <label className="speak-toggle">

              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) =>
                  setAutoSpeak(
                    e.target.checked
                  )
                }
              />

              <span>
                Read replies aloud
              </span>

            </label>

          </header>

          <div className="content-grid">

            <ChatWindow
              messages={activeChat.messages}
              draft={draft}
              isThinking={isThinking}
              onDraftChange={setDraft}
              onSend={sendMessage}
            />

            <CameraPanel
              signWords={signWords}
              onSignDetected={
                addDetectedSign
              }
              onUseSigns={
                useDetectedSigns
              }
              onClearSigns={() =>
                setSignWords([])
              }
            />

          </div>

        </main>

      </div>
    </>
  );
}