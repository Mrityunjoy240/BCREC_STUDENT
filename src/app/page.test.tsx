import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "./page";

vi.mock("next/server", () => ({
  connection: vi.fn().mockResolvedValue(undefined),
}));

afterEach(() => {
  delete process.env.APP_DATA_MODE;
});

async function renderHome() {
  const element = await HomePage();
  return renderToStaticMarkup(element);
}

describe("HomePage", () => {
  it("always shows the academic-data-not-connected notice and the Durgapur location", async () => {
    const modes = ["demo", "production", "DEMO", undefined] as const;
    for (const mode of modes) {
      if (mode === undefined) {
        delete process.env.APP_DATA_MODE;
      } else {
        process.env.APP_DATA_MODE = mode;
      }
      const html = await renderHome();
      expect(html).toContain("Academic data is not connected yet");
      expect(html).toContain("BCREC · Durgapur");
    }
  });

  it("shows the demo banner only when APP_DATA_MODE is explicitly demo", async () => {
    process.env.APP_DATA_MODE = "demo";
    expect(await renderHome()).toContain("Demo environment");

    process.env.APP_DATA_MODE = "production";
    expect(await renderHome()).not.toContain("Demo environment");

    delete process.env.APP_DATA_MODE;
    expect(await renderHome()).not.toContain("Demo environment");

    process.env.APP_DATA_MODE = "";
    expect(await renderHome()).not.toContain("Demo environment");

    process.env.APP_DATA_MODE = "DEMO";
    expect(await renderHome()).not.toContain("Demo environment");
  });
});
