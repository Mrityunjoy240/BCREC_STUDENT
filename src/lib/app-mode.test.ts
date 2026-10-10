import { describe, expect, it } from "vitest";
import { isDemoMode } from "./app-mode";

describe("isDemoMode", () => {
  it("returns true only for an explicit demo value", () => {
    expect(isDemoMode("demo")).toBe(true);
  });

  it("returns false for production", () => {
    expect(isDemoMode("production")).toBe(false);
  });

  it("returns false when the mode is missing or invalid", () => {
    expect(isDemoMode(undefined)).toBe(false);
    expect(isDemoMode("")).toBe(false);
    expect(isDemoMode("DEMO")).toBe(false);
    expect(isDemoMode("staging")).toBe(false);
  });
});
