import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom does not implement requestSubmit, which React 19's
// synthetic submit events rely on during tests.
if (
  typeof HTMLFormElement !== "undefined" &&
  !HTMLFormElement.prototype.requestSubmit
) {
  HTMLFormElement.prototype.requestSubmit = function requestSubmit() {
    this.dispatchEvent(
      new SubmitEvent("submit", {
        bubbles: true,
        cancelable: true,
      })
    );
  };
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
