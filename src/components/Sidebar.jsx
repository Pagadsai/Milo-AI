import { useState } from "react";
import rabbitLogo from "../assets/rabbit-logo.png";
import {
  FiEdit2,
  FiMessageSquare,
  FiPlus,
  FiTrash2,
  FiX,
  FiSearch,
  FiArchive,
} from "react-icons/fi";
import { FaThumbtack } from "react-icons/fa6";
export default function Sidebar({
  chats,
  activeId,
  isOpen,
  onClose,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onPin,
  onArchive,
}) {
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  function beginRename(chat) {
    setEditingId(chat.id);
    setTitle(chat.title);
  }

  function finishRename() {
    if (editingId) {
      onRename(editingId, title);
    }
    setEditingId(null);
  }

  const filteredChats = chats
    .filter((chat) => !chat.archived)
    .filter((chat) =>
      chat.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned === b.pinned) return 0;
      return a.pinned ? -1 : 1;
    });

  return (
    <>
      {isOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close conversations"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-heading">
          <button
            className="sidebar-brand"
            type="button"
            onClick={onNew}
          >
            <img
              src={rabbitLogo}
              alt="Milo"
              className="rabbit-logo"
            />

            <span className="brand-name">
              Milo
            </span>
          </button>

          <button
            className="icon-button sidebar-close"
            aria-label="Close conversations"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <div className="sidebar-search">
          <FiSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="new-chat-button"
          type="button"
          onClick={onNew}
        >
          <FiPlus />
          New conversation
        </button>

        <nav
          className="conversation-list"
          aria-label="Saved conversations"
        >
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`conversation-item ${
                chat.id === activeId ? "active" : ""
              } ${chat.pinned ? "pinned-chat" : ""}`}
            >
              <button
                className="conversation-main"
                type="button"
                onClick={() => onSelect(chat.id)}
              >
                <FiMessageSquare />

                {editingId === chat.id ? (
                  <input
                    autoFocus
                    value={title}
                    aria-label="Conversation title"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    onBlur={finishRename}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        finishRename();
                      }

                      if (e.key === "Escape") {
                        setEditingId(null);
                      }
                    }}
                  />
                ) : (
                  <span>{chat.title}</span>
                )}
              </button>

              <div className="conversation-actions">

                <button
                  type="button"
                  title={chat.pinned ? "Unpin" : "Pin"}
                  onClick={() => onPin(chat.id)}
                >
                  <FaThumbtack
                    color={chat.pinned ? "#ffca58" : "#8fa3b8"}
                  />
                </button>

                <button
                  type="button"
                  title={chat.archived ? "Restore" : "Archive"}
                  onClick={() => onArchive(chat.id)}
                >
                  <FiArchive />
                </button>

                <button
                  type="button"
                  aria-label={`Rename ${chat.title}`}
                  onClick={() => beginRename(chat)}
                >
                  <FiEdit2 />
                </button>

                <button
                  type="button"
                  aria-label={`Delete ${chat.title}`}
                  onClick={() => onDelete(chat.id)}
                >
                  <FiTrash2 />
                </button>

              </div>
             </div>
          ))}
        </nav>
        <hr className="sidebar-divider" />
        <button
          className="archive-toggle"
          onClick={() => setShowArchived(!showArchived)}
        >
          📦 Archived
        </button>
        {showArchived && (
          <nav className="conversation-list">
            {chats
              .filter((chat) => chat.archived)
              .map((chat) => (
                <div
                  key={chat.id}
                  className={`conversation-item ${
                    chat.id === activeId ? "active" : ""
                  }`}
                >
                  <button
                    className="conversation-main"
                    onClick={() => onSelect(chat.id)}
                  >
                    <FiMessageSquare />
                    <span>{chat.title}</span>
                  </button>

                  <div className="conversation-actions">
                    <button
                      title="Restore"
                      onClick={() => onArchive(chat.id)}
                    >
                      <FiArchive />
                    </button>
                  </div>
                </div>
              ))}
          </nav>
        )}
        <div className="sidebar-footer">
          <div className="status-dot" />

          <div>
            <strong>Milo is ready</strong>

            <span>
              Camera processing stays on this device
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}