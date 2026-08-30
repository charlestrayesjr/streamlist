function isDuplicateTitle(items, title, excludeId = null) {
  const cleanTitle = title.toLowerCase();

  return items.some(
    (item) =>
      item.id !== excludeId &&
      item.title.toLowerCase() === cleanTitle
  );
}

function generateId(existingItems) {
  let newId;

  do {
    newId =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  } while (existingItems.some((item) => item.id === newId));

  return newId;
}

function isValidItem(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    (typeof value.id === "string" ||
      typeof value.id === "number") &&
    typeof value.title === "string" &&
    typeof value.completed === "boolean"
  );
}

function loadItems() {
  try {
    const savedItems = localStorage.getItem("streamlistItems");

    if (!savedItems) {
      return [];
    }

    const parsed = JSON.parse(savedItems);

    if (!Array.isArray(parsed) || !parsed.every(isValidItem)) {
      console.error(
        "Stored StreamList data has an unexpected shape; starting with an empty list."
      );

      return [];
    }

    return parsed;
  } catch (error) {
    console.error("Unable to load StreamList data:", error);

    return [];
  }
}

export { isDuplicateTitle, generateId, loadItems };

import { useEffect, useState } from "react";

function useStreamList() {
  const [streamItems, setStreamItems] = useState(loadItems);
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
      console.error("Unable to save StreamList data:", error);
    }
  }, [streamItems]);

  const handleSubmit = (rawInput) => {
    const cleanInput = rawInput.trim();

    if (cleanInput === "") {
      setMessage("Please enter a movie or show.");
      return false;
    }

    if (isDuplicateTitle(streamItems, cleanInput)) {
      setMessage(`${cleanInput} is already in your StreamList.`);
      return false;
    }

    const newItem = {
      id: generateId(streamItems),
      title: cleanInput,
      completed: false,
    };

    setStreamItems((currentItems) => [...currentItems, newItem]);
    setMessage(`${cleanInput} was added to your StreamList.`);
    return true;
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
        item.id === id ? { ...item, completed: !item.completed } : item
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
      return false;
    }

    if (isDuplicateTitle(streamItems, cleanEdit, id)) {
      setMessage(`${cleanEdit} is already in your StreamList.`);
      return false;
    }

    setStreamItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, title: cleanEdit } : item
      )
    );

    setEditingId(null);
    setEditText("");
    setMessage("Item updated.");
    return true;
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

  const remainingCount = streamItems.length - completedCount;

  return {
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
  };
}

export default useStreamList;
