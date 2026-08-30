import { describe, expect, it, vi, beforeEach } from "vitest";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import StreamList from "../pages/StreamList.jsx";

async function addItem(user, title) {
  await user.type(screen.getByLabelText("Movie or show title"), title);
  await user.click(screen.getByRole("button", { name: /add/i }));
}

describe("StreamList", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("adds an item and persists it to localStorage", async () => {
    const user = userEvent.setup();
    render(<StreamList />);

    await addItem(user, "Inception");

    expect(
      screen.getByText("Inception was added to your StreamList.")
    ).toBeInTheDocument();
    expect(
      JSON.parse(localStorage.getItem("streamlistItems"))
    ).toEqual([
      expect.objectContaining({ title: "Inception", completed: false }),
    ]);
  });

  it("rejects empty input", async () => {
    const user = userEvent.setup();
    render(<StreamList />);

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(
      screen.getByText("Please enter a movie or show.")
    ).toBeInTheDocument();
  });

  it("rejects duplicate titles case-insensitively", async () => {
    const user = userEvent.setup();
    render(<StreamList />);

    await addItem(user, "Inception");
    await addItem(user, "inception");

    expect(
      screen.getByText("inception is already in your StreamList.")
    ).toBeInTheDocument();
    expect(screen.getAllByText("Inception").length).toBe(1);
  });

  it("deletes an item", async () => {
    const user = userEvent.setup();
    render(<StreamList />);

    await addItem(user, "Up");
    await user.click(screen.getByRole("button", { name: /delete up/i }));

    expect(screen.getByText("Item deleted.")).toBeInTheDocument();
    expect(screen.queryByText("Up")).not.toBeInTheDocument();
    expect(localStorage.getItem("streamlistItems")).toBe("[]");
  });

  it("completes and clears completed items", async () => {
    const user = userEvent.setup();
    render(<StreamList />);

    await addItem(user, "Up");
    await user.click(
      screen.getByRole("button", { name: /mark up complete/i })
    );
    expect(screen.getByText("Item status updated.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clear completed/i }));
    expect(screen.getByText("No titles to display.")).toBeInTheDocument();
  });

  it("saves an edit and blocks duplicate edits", async () => {
    const user = userEvent.setup();
    render(<StreamList />);

    await addItem(user, "Up");
    await addItem(user, "Cars");

    await user.click(screen.getByRole("button", { name: /edit up/i }));
    await user.clear(screen.getByLabelText("Edit Up"));
    await user.type(screen.getByLabelText("Edit Up"), "Cars");
    await user.click(screen.getByRole("button", { name: /save up/i }));

    expect(
      screen.getByText("Cars is already in your StreamList.")
    ).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Edit Up"));
    await user.type(screen.getByLabelText("Edit Up"), "WALL-E");
    await user.click(screen.getByRole("button", { name: /save up/i }));

    expect(screen.getByText("Item updated.")).toBeInTheDocument();
    expect(screen.getByText("WALL-E")).toBeInTheDocument();
  });

  it("ignores a corrupted localStorage payload", () => {
    localStorage.setItem("streamlistItems", JSON.stringify({ broken: true }));

    render(<StreamList />);

    expect(screen.getByText("No titles to display.")).toBeInTheDocument();
  });
});
