import { useEffect, useState } from "react";

const STORAGE_KEY =
  "eztechmovie-streamlist";

function StreamList() {
  const [items, setItems] = useState(() => {
    try {
      const savedItems =
        localStorage.getItem(STORAGE_KEY);

      return savedItems
        ? JSON.parse(savedItems)
        : [];
    } catch (error) {
      console.error(
        "Unable to load StreamList:",
        error
      );

      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] =
    useState(null);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );
  }, [items]);

  const resetForm = () => {
    setTitle("");
    setNotes("");
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanNotes = notes.trim();

    if (!cleanTitle) {
      return;
    }

    if (editingId) {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: cleanTitle,
                notes: cleanNotes,
              }
            : item
        )
      );

      resetForm();
      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      title: cleanTitle,
      notes: cleanNotes,
      completed: false,
      createdAt:
        new Date().toLocaleString(),
    };

    setItems((currentItems) => [
      newItem,
      ...currentItems,
    ]);

    resetForm();
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setNotes(item.notes || "");
    setEditingId(item.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== id
      )
    );

    if (editingId === id) {
      resetForm();
    }
  };

  const handleToggleComplete = (id) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              completed:
                !item.completed,
            }
          : item
      )
    );
  };

  const clearCompleted = () => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => !item.completed
      )
    );
  };

  const clearAll = () => {
    setItems([]);
    resetForm();
  };

  const completedCount = items.filter(
    (item) => item.completed
  ).length;

  return (
    <section className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">
            EZTechMovie
          </p>

          <h2>
            My StreamList
          </h2>

          <p>
            Save movies you want to
            watch, update your list, and
            keep your selections stored
            on this device.
          </p>
        </div>

        <div className="stat-card">
          <strong>
            {items.length}
          </strong>

          <span>
            Total Items
          </span>
        </div>

        <div className="stat-card">
          <strong>
            {completedCount}
          </strong>

          <span>
            Completed
          </span>
        </div>
      </div>

      <div className="panel">
        <h3>
          {editingId
            ? "Edit StreamList Item"
            : "Add to StreamList"}
        </h3>

        <form
          className="stream-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="title">
              Movie or Event Title
            </label>

            <input
              id="title"
              type="text"
              placeholder="Enter a movie title"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              placeholder="Add notes"
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="primary-button"
              type="submit"
            >
              {editingId
                ? "Save Changes"
                : "Add Item"}
            </button>

            {editingId && (
              <button
                className="secondary-button"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="section-heading">
        <div>
          <h3>
            Saved StreamList
          </h3>

          <p>
            Your entries are saved with
            Local Storage.
          </p>
        </div>

        {items.length > 0 && (
          <div className="list-tools">
            <button
              className="secondary-button"
              onClick={clearCompleted}
            >
              Clear Completed
            </button>

            <button
              className="danger-button"
              onClick={clearAll}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>
            Your StreamList is empty
          </h3>

          <p>
            Add your first movie above or
            search TMDB from the Movies
            page.
          </p>
        </div>
      ) : (
        <div className="stream-grid">
          {items.map((item) => (
            <article
              className={
                item.completed
                  ? "stream-card completed"
                  : "stream-card"
              }
              key={item.id}
            >
              <div className="card-top">
                <div>
                  <span className="status">
                    {item.completed
                      ? "Completed"
                      : "Saved"}
                  </span>

                  <h3>
                    {item.title}
                  </h3>
                </div>

                <button
                  className="complete-button"
                  onClick={() =>
                    handleToggleComplete(
                      item.id
                    )
                  }
                >
                  {item.completed
                    ? "Undo"
                    : "Complete"}
                </button>
              </div>

              {item.notes && (
                <p className="notes">
                  {item.notes}
                </p>
              )}

              <p className="created-date">
                Added: {item.createdAt}
              </p>

              <div className="card-actions">
                <button
                  className="secondary-button"
                  onClick={() =>
                    handleEdit(item)
                  }
                >
                  Edit
                </button>

                <button
                  className="danger-button"
                  onClick={() =>
                    handleDelete(
                      item.id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default StreamList;