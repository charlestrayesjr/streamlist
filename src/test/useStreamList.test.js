import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  isDuplicateTitle,
  generateId,
  loadItems,
} from "../hooks/useStreamList.js";

describe("isDuplicateTitle", () => {
  const items = [
    { id: "a", title: "Inception", completed: false },
    { id: "b", title: "Cars", completed: true },
  ];

  it("finds duplicates case-insensitively", () => {
    expect(isDuplicateTitle(items, "inception")).toBe(true);
    expect(isDuplicateTitle(items, "CARS")).toBe(true);
  });

  it("excludes the given id", () => {
    expect(isDuplicateTitle(items, "Inception", "a")).toBe(false);
  });

  it("returns false for new titles", () => {
    expect(isDuplicateTitle(items, "Up")).toBe(false);
  });
});

describe("generateId", () => {
  it("returns unique ids not present in existing items", () => {
    const items = [{ id: "x", title: "A", completed: false }];
    const id = generateId(items);

    expect(id).toBeTruthy();
    expect(items.some((item) => item.id === id)).toBe(false);
  });

  it("falls back to a string id without crypto.randomUUID", () => {
    vi.stubGlobal("crypto", {});

    expect(typeof generateId([])).toBe("string");

    vi.unstubAllGlobals();
  });
});

describe("loadItems", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns an empty array when nothing is stored", () => {
    expect(loadItems()).toEqual([]);
  });

  it("returns stored valid items", () => {
    const items = [{ id: "a", title: "Up", completed: false }];
    localStorage.setItem("streamlistItems", JSON.stringify(items));

    expect(loadItems()).toEqual(items);
  });

  it("returns an empty array for non-array payloads", () => {
    localStorage.setItem("streamlistItems", JSON.stringify({ id: 1 }));

    expect(loadItems()).toEqual([]);
  });

  it("returns an empty array when items are malformed", () => {
    localStorage.setItem(
      "streamlistItems",
      JSON.stringify([{ id: 1, title: 5, completed: "yes" }])
    );

    expect(loadItems()).toEqual([]);
  });

  it("returns an empty array on invalid JSON", () => {
    localStorage.setItem("streamlistItems", "{not json");
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(loadItems()).toEqual([]);
  });
});
