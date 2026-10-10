import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import DashboardPage from "./page";

vi.mock("next/server", () => ({
  connection: vi.fn().mockResolvedValue(undefined),
}));

afterEach(() => {
  delete process.env.APP_DATA_MODE;
});

async function renderDashboard() {
  const element = await DashboardPage();
  return renderToStaticMarkup(element);
}

describe("DashboardPage", () => {
  it("renders the Home title and all dashboard sections", async () => {
    const html = await renderDashboard();
    expect(html).toContain("Home");
    expect(html).toContain("Learning workspace");
    expect(html).toContain("Calendar &amp; upcoming schedule");
    expect(html).toContain("Personal tasks");
    expect(html).toContain("Academic overview");
    expect(html).toContain("Notices");
  });

  it("shows honest unavailable or empty states without fabricated values", async () => {
    const html = await renderDashboard();
    expect(html).toContain("Not connected");
    expect(html).toContain("Official schedule is not connected");
    expect(html).toContain("Academic data is unavailable");
    expect(html).toContain("Official notice source is not connected");
    expect(html).toContain("No personal tasks yet");
    expect(html).toContain("not implemented yet");
    expect(html).not.toMatch(/\d+\s?%/);
    expect(html).not.toContain("Attendance:");
    expect(html).not.toMatch(/marks?[:\s]+\d/i);
  });

  it("shows the demo banner only when APP_DATA_MODE is exactly demo", async () => {
    process.env.APP_DATA_MODE = "demo";
    expect(await renderDashboard()).toContain("Demo environment");

    process.env.APP_DATA_MODE = "production";
    expect(await renderDashboard()).not.toContain("Demo environment");

    delete process.env.APP_DATA_MODE;
    expect(await renderDashboard()).not.toContain("Demo environment");

    process.env.APP_DATA_MODE = "";
    expect(await renderDashboard()).not.toContain("Demo environment");

    process.env.APP_DATA_MODE = "DEMO";
    expect(await renderDashboard()).not.toContain("Demo environment");
  });

  it("keeps the data-not-connected notice visible in every mode", async () => {
    const modes = ["demo", "production", "DEMO", undefined] as const;
    for (const mode of modes) {
      if (mode === undefined) {
        delete process.env.APP_DATA_MODE;
      } else {
        process.env.APP_DATA_MODE = mode;
      }
      const html = await renderDashboard();
      expect(html).toContain("Academic data is not connected");
    }
  });
});
