import { useEffect, useState } from "react";

function StreamList() {
  const [userInput, setUserInput] = useState("");

  const [streamItems, setStreamItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem("streamlistItems");

      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error(
        "Unable to load StreamList data:",
        error
      );

      return [];
    }
  });

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(
        "streamlistItems",
        JSON.stringify(streamItems)
      );
    } catch (error) {
      console.error(
        "Unable to save StreamList data:",
        error
      );
    }
  }, [streamItems]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanInput = userInput.trim();

    if (cleanInput === "") {
      setMessage("Please enter a movie or show.");
      return;
    }

    const duplicate = streamItems.some(
      (item) =>
        item.title.toLowerCase() ===
        cleanInput.toLowerCase()
    );

    if (duplicate) {
      setMessage(
        `${cleanInput} is already in your StreamList.`
      );
      return;
    }

    const newItem = {
      id: Date.now(),
      title: cleanInput,
      completed: false,
    };

    setStreamItems((currentItems) => [
      ...currentItems,
      newItem,
    ]);

    setUserInput("");

    setMessage(
      `${cleanInput} was added to your StreamList.`
    );
  };

  const handleDelete = (id) => {
    setStreamItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );

    setMessage("Item deleted.");
  };

  const handleComplete = (id) => {
    setStreamItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
            }
          : item
      )
    );

    setMessage("Item status updated.");
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditText(item.title);
    setMessage("");
  };

  const saveEdit = (id) => {
    const cleanEdit = editText.trim();

    if (cleanEdit === "") {
      setMessage("The title cannot be empty.");
      return;
    }

    const duplicate = streamItems.some(
      (item) =>
        item.id !== id &&
        item.title.toLowerCase() ===
          cleanEdit.toLowerCase()
    );

    if (duplicate) {
      setMessage(
        `${cleanEdit} is already in your StreamList.`
      );
      return;
    }

    setStreamItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              title: cleanEdit,
            }
          : item
      )
    );

    setEditingId(null);
    setEditText("");
    setMessage("Item updated.");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setMessage("Editing canceled.");
  };

  const clearCompleted = () => {
    setStreamItems((currentItems) =>
      currentItems.filter((item) => !item.completed)
    );

    setMessage("Completed items cleared.");
  };

  const filteredItems = streamItems.filter((item) => {
    if (filter === "active") {
      return !item.completed;
    }

    if (filter === "completed") {
      return item.completed;
    }

    return true;
  });

  const completedCount = streamItems.filter(
    (item) => item.completed
  ).length;

  const remainingCount =
    streamItems.length - completedCount;

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">
          MY STREAMING LIST
        </p>

        <h2>
          Keep track of what you want to watch.
        </h2>

        <p className="intro">
          Add movies and shows, then edit, complete,
          or remove them. Your list is stored locally
          and remains available after the page is
          refreshed.
        </p>

        <form
          className="stream-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="stream-input">
            Movie or show title
          </label>

          <div className="input-group">
            <input
              id="stream-input"
              type="text"
              value={userInput}
              onChange={(event) =>
                setUserInput(event.target.value)
              }
              placeholder="Enter a movie or show"
              autoComplete="off"
            />

            <button type="submit">
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
              >
                add
              </span>

              Add
            </button>
          </div>
        </form>

        {message && (
          <p
            className="status-message"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <div className="list-summary">
          <div>
            <strong>{streamItems.length}</strong>
            <span>Total</span>
          </div>

          <div>
            <strong>{completedCount}</strong>
            <span>Completed</span>
          </div>

          <div>
            <strong>{remainingCount}</strong>
            <span>Remaining</span>
          </div>
        </div>

        <div
          className="filter-bar"
          aria-label="StreamList filters"
        >
          <button
            type="button"
            className={
              filter === "all"
                ? "filter-active"
                : ""
            }
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            type="button"
            className={
              filter === "active"
                ? "filter-active"
                : ""
            }
            onClick={() => setFilter("active")}
          >
            Active
          </button>

          <button
            type="button"
            className={
              filter === "completed"
                ? "filter-active"
                : ""
            }
            onClick={() =>
              setFilter("completed")
            }
          >
            Completed
          </button>
        </div>

        <section className="stream-list-section">
          <div className="list-heading">
            <h3>Your StreamList</h3>

            {completedCount > 0 && (
              <button
                className="clear-button"
                type="button"
                onClick={clearCompleted}
              >
                Clear Completed
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="empty-list">
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
              >
                movie
              </span>

              <p>No titles to display.</p>
            </div>
          ) : (
            <ul className="stream-list">
              {filteredItems.map((item) => (
                <li
                  key={item.id}
                  className={
                    item.completed
                      ? "stream-item completed"
                      : "stream-item"
                  }
                >
                  {editingId === item.id ? (
                    <div className="edit-area">
                      <label
                        className="visually-hidden"
                        htmlFor={`edit-${item.id}`}
                      >
                        Edit {item.title}
                      </label>

                      <input
                        id={`edit-${item.id}`}
                        type="text"
                        value={editText}
                        onChange={(event) =>
                          setEditText(
                            event.target.value
                          )
                        }
                        autoFocus
                      />

                      <button
                        type="button"
                        className="icon-button save"
                        onClick={() =>
                          saveEdit(item.id)
                        }
                        aria-label={`Save ${item.title}`}
                        title="Save"
                      >
                        <span
                          className="material-symbols-outlined"
                          aria-hidden="true"
                        >
                          save
                        </span>
                      </button>

                      <button
                        type="button"
                        className="icon-button"
                        onClick={cancelEdit}
                        aria-label="Cancel editing"
                        title="Cancel"
                      >
                        <span
                          className="material-symbols-outlined"
                          aria-hidden="true"
                        >
                          close
                        </span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="item-title">
                        <button
                          type="button"
                          className="complete-button"
                          onClick={() =>
                            handleComplete(item.id)
                          }
                          aria-label={
                            item.completed
                              ? `Mark ${item.title} incomplete`
                              : `Mark ${item.title} complete`
                          }
                          title={
                            item.completed
                              ? "Mark incomplete"
                              : "Mark complete"
                          }
                        >
                          <span
                            className="material-symbols-outlined"
                            aria-hidden="true"
                          >
                            {item.completed
                              ? "check_circle"
                              : "radio_button_unchecked"}
                          </span>
                        </button>

                        <span>{item.title}</span>
                      </div>

                      <div className="item-actions">
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() =>
                            startEditing(item)
                          }
                          aria-label={`Edit ${item.title}`}
                          title="Edit"
                        >
                          <span
                            className="material-symbols-outlined"
                            aria-hidden="true"
                          >
                            edit
                          </span>
                        </button>

                        <button
                          type="button"
                          className="icon-button delete"
                          onClick={() =>
                            handleDelete(item.id)
                          }
                          aria-label={`Delete ${item.title}`}
                          title="Delete"
                        >
                          <span
                            className="material-symbols-outlined"
                            aria-hidden="true"
                          >
                            delete
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

export default StreamList;