import { useState } from "react";
import {
  FiEdit2,
  FiMessageSquare,
  FiPlus,
  FiTrash2,
  FiX,
  FiSearch,
} from "react-icons/fi";

export default function Sidebar({
  chats,
  activeId,
  isOpen,
  onClose,
  onSelect,
  onNew,
  onDelete,
  onRename,
}) {
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

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

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {isOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close conversations"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-heading">
          <button
            className="sidebar-brand"
            type="button"
            onClick={onNew}
          >
            <img
              src="/rabbit-logo.png"
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
              }`}
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