function StreamItemRow({
  item,
  isEditing,
  editText,
  onEditTextChange,
  onSaveEdit,
  onCancelEdit,
  onComplete,
  onEdit,
  onDelete,
}) {
  if (isEditing) {
    return (
      <li className="stream-item">
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
            onChange={(event) => onEditTextChange(event.target.value)}
            autoFocus
          />

          <button
            type="button"
            className="icon-button save"
            onClick={onSaveEdit}
            aria-label={`Save ${item.title}`}
            title="Save"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              save
            </span>
          </button>

          <button
            type="button"
            className="icon-button"
            onClick={onCancelEdit}
            aria-label="Cancel editing"
            title="Cancel"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={item.completed ? "stream-item completed" : "stream-item"}>
      <div className="item-title">
        <button
          type="button"
          className="complete-button"
          onClick={onComplete}
          aria-label={
            item.completed
              ? `Mark ${item.title} incomplete`
              : `Mark ${item.title} complete`
          }
          title={item.completed ? "Mark incomplete" : "Mark complete"}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {item.completed ? "check_circle" : "radio_button_unchecked"}
          </span>
        </button>

        <span>{item.title}</span>
      </div>

      <div className="item-actions">
        <button
          type="button"
          className="icon-button"
          onClick={onEdit}
          aria-label={`Edit ${item.title}`}
          title="Edit"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            edit
          </span>
        </button>

        <button
          type="button"
          className="icon-button delete"
          onClick={onDelete}
          aria-label={`Delete ${item.title}`}
          title="Delete"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            delete
          </span>
        </button>
      </div>
    </li>
  );
}

export default StreamItemRow;
