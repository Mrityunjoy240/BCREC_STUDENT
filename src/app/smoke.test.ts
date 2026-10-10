import { describe, expect, it } from "vitest";

describe("bootstrap smoke test", () => {
  it("runs the configured test runner", () => {
    expect(1 + 1).toBe(2);
  });
});
