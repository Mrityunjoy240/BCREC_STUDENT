import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardNav } from "./dashboard-nav";
import { primaryNavItems } from "./nav-items";

function renderNav() {
  return renderToStaticMarkup(<DashboardNav currentPath="/app" />);
}

describe("DashboardNav", () => {
  it("renders the brand and every P0 navigation label", () => {
    const html = renderNav();
    expect(html).toContain("BCREC Student Life Platform");
    for (const item of primaryNavItems) {
      const escaped = item.label.replace(/&/g, "&amp;");
      expect(html).toContain(escaped);
    }
  });

  it("marks /app (Home) as the active destination", () => {
    const html = renderNav();
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('href="/app"');
  });

  it("renders planned destinations as non-interactive items, not dead links", () => {
    const html = renderNav();
    const planned = primaryNavItems.filter((item) => item.href === null);
    expect(planned.length).toBeGreaterThan(0);
    for (const item of planned) {
      expect(html).not.toContain(`href="/app/${item.label.toLowerCase()}`);
      expect(html).toContain("Planned");
    }
    expect(html).not.toContain("Help &amp; Mentor");
    expect(html).not.toContain("Career &amp; Projects");
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(hrefs)).toEqual(new Set(["/app"]));
  });

  it("uses an accessible native disclosure for the mobile menu", () => {
    const html = renderNav();
    expect(html).toContain("<details");
    expect(html).toContain("<summary");
    expect(html).toContain("Menu");
    const navCount = (html.match(/<nav/g) ?? []).length;
    expect(navCount).toBe(2);
    expect((html.match(/aria-label="Main navigation"/g) ?? []).length).toBe(2);
  });
});
