import { useState } from "react";

import FilterBar from "../components/FilterBar.jsx";
import ListSummary from "../components/ListSummary.jsx";
import StreamItemRow from "../components/StreamItemRow.jsx";
import useStreamList from "../hooks/useStreamList.js";

function StreamList() {
  const [userInput, setUserInput] = useState("");

  const {
    streamItems,
    filteredItems,
    completedCount,
    remainingCount,
    editingId,
    editText,
    setEditText,
    filter,
    setFilter,
    message,
    handleSubmit,
    handleDelete,
    handleComplete,
    startEditing,
    saveEdit,
    cancelEdit,
    clearCompleted,
  } = useStreamList();

  const onFormSubmit = (event) => {
    event.preventDefault();

    if (handleSubmit(userInput)) {
      setUserInput("");
    }
  };

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
          onSubmit={onFormSubmit}
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

        <ListSummary
          total={streamItems.length}
          completed={completedCount}
          remaining={remainingCount}
        />

        <FilterBar filter={filter} onFilterChange={setFilter} />

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
                <StreamItemRow
                  key={item.id}
                  item={item}
                  isEditing={editingId === item.id}
                  editText={editText}
                  onEditTextChange={setEditText}
                  onSaveEdit={() => saveEdit(item.id)}
                  onCancelEdit={cancelEdit}
                  onComplete={() => handleComplete(item.id)}
                  onEdit={() => startEditing(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

export default StreamList;