import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import LearnPage from "./page";

vi.mock("next/server", () => ({
  connection: vi.fn().mockResolvedValue(undefined),
}));

afterEach(() => {
  delete process.env.APP_DATA_MODE;
});

async function renderLearn() {
  const element = await LearnPage();
  return renderToStaticMarkup(element);
}

describe("LearnPage", () => {
  it("renders the Learning Workspace title and all workspace sections", async () => {
    const html = await renderLearn();
    expect(html).toContain("Learning Workspace");
    expect(html).toContain("Study Materials");
    expect(html).toContain("Study chat");
    expect(html).toContain("Practice");
  });

  it("shows honest empty states without fabricated data or dead links", async () => {
    const html = await renderLearn();
    expect(html).toContain("No study materials yet");
    expect(html).toContain("Study chat is not implemented yet");
    expect(html).toContain("Quizzes and flashcards are not implemented yet");
    expect(html).toContain("nothing below is simulated");
    expect(html).not.toContain("Create tasks");
    expect(html).not.toMatch(/\d+\s?%/);
    expect(html).not.toContain("Attendance:");
    expect(html).not.toMatch(/marks?[:\s]+\d/i);
    // No dead links into unimplemented sub-routes
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs).toEqual([]);
  });

  it("shows the demo banner only when APP_DATA_MODE is exactly demo", async () => {
    process.env.APP_DATA_MODE = "demo";
    expect(await renderLearn()).toContain("Demo environment");

    process.env.APP_DATA_MODE = "production";
    expect(await renderLearn()).not.toContain("Demo environment");

    delete process.env.APP_DATA_MODE;
    expect(await renderLearn()).not.toContain("Demo environment");

    process.env.APP_DATA_MODE = "DEMO";
    expect(await renderLearn()).not.toContain("Demo environment");
  });

  it("keeps the early-development notice visible in every mode", async () => {
    const modes = ["demo", "production", "DEMO", undefined] as const;
    for (const mode of modes) {
      if (mode === undefined) {
        delete process.env.APP_DATA_MODE;
      } else {
        process.env.APP_DATA_MODE = mode;
      }
      const html = await renderLearn();
      expect(html).toContain("in early development");
    }
  });
});
