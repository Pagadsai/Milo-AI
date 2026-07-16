import { useState } from "react";
import { FiEdit2, FiMessageSquare, FiPlus, FiTrash2, FiX } from "react-icons/fi";

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

  function beginRename(chat) {
    setEditingId(chat.id);
    setTitle(chat.title);
  }

  function finishRename() {
    if (editingId) onRename(editingId, title);
    setEditingId(null);
  }

  return (
    <>
      {isOpen && <button className="sidebar-scrim" aria-label="Close conversations" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-heading">
          <div>
            <span className="eyebrow">Your space</span>
            <h2>Conversations</h2>
          </div>
          <button className="icon-button sidebar-close" aria-label="Close conversations" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <button className="new-chat-button" type="button" onClick={onNew}>
          <FiPlus />
          New conversation
        </button>

        <nav className="conversation-list" aria-label="Saved conversations">
          {chats.map((chat) => (
            <div
              className={`conversation-item ${chat.id === activeId ? "active" : ""}`}
              key={chat.id}
            >
              <button className="conversation-main" type="button" onClick={() => onSelect(chat.id)}>
                <FiMessageSquare />
                {editingId === chat.id ? (
                  <input
                    aria-label="Conversation title"
                    autoFocus
                    value={title}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => setTitle(event.target.value)}
                    onBlur={finishRename}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") finishRename();
                      if (event.key === "Escape") setEditingId(null);
                    }}
                  />
                ) : (
                  <span>{chat.title}</span>
                )}
              </button>

              <div className="conversation-actions">
                <button type="button" aria-label={`Rename ${chat.title}`} onClick={() => beginRename(chat)}>
                  <FiEdit2 />
                </button>
                <button type="button" aria-label={`Delete ${chat.title}`} onClick={() => onDelete(chat.id)}>
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
            <span>Camera processing stays on this device</span>
          </div>
        </div>
      </aside>
    </>
  );
}