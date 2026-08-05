import { useEffect, useState } from "react";
import {
  loadMemory,
  editMemoryField,
  deleteMemoryField,
  clearMemory,
} from "../services/memory";
import "./MemoryPanel.css";
import {
  FiEdit2,
  FiTrash2,
  FiX,
} from "react-icons/fi";

export default function MemoryPanel({
  isOpen,
  onClose,
}) {
  const [memory, setMemory] = useState({});
  const [editingKey, setEditingKey] = useState("");
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMemory(loadMemory());
    }
  }, [isOpen]);

  function handleDelete(key) {
    const updated = deleteMemoryField(key);
    setMemory(updated);
  }

  function handleSave() {
    const updated = editMemoryField(
      editingKey,
      editingValue
    );
    setMemory(updated);
    setEditingKey("");
    setEditingValue("");
  }

  function handleClear() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all memories?\n\nThis action cannot be undone."
    );
    if (!confirmed) return;

    clearMemory();
    setMemory({});
  }

  return (
    <div
      className={`memory-panel ${
        isOpen ? "open" : ""
      }`}
    >
      <div className="memory-header">
        <h2>🧠 Memory</h2>

        <button onClick={onClose}>
          <FiX />
        </button>
      </div>

      {Object.keys(memory).length === 0 ? (
        <p>No memories stored.</p>
      ) : (
        Object.entries(memory).map(
          ([key, value]) => (
            <div
              key={key}
              className="memory-card"
            >
              <strong>{key}</strong>

              {editingKey === key ? (
                <>
                  <input
                    value={editingValue}
                    onChange={(e) =>
                      setEditingValue(
                        e.target.value
                      )
                    }
                  />

                  <button
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </>
              ) : (
                <p>{value}</p>
              )}

              <div className="memory-actions">
                <button
                  onClick={() => {
                    setEditingKey(key);
                    setEditingValue(value);
                  }}
                >
                  <FiEdit2 />
                </button>

                <button
                  onClick={() =>
                    handleDelete(key)
                  }
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          )
        )
      )}

      {Object.keys(memory).length > 0 && (
        <button
          className="clear-memory"
          onClick={handleClear}
        >
          Clear All Memory
        </button>
      )}
    </div>
  );
}