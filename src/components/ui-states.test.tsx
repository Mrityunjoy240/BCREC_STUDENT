import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { EmptyState, ErrorState, UnavailableState } from "./ui-states";

describe("ui-states", () => {
  it("ErrorState renders a retry button only when onRetry is provided", () => {
    const withRetry = renderToStaticMarkup(
      <ErrorState title="Failed" description="Something went wrong." onRetry={() => {}} />,
    );
    expect(withRetry).toContain("Try again");
    expect(withRetry).toContain('type="button"');

    const withoutRetry = renderToStaticMarkup(
      <ErrorState title="Failed" description="Something went wrong." />,
    );
    expect(withoutRetry).not.toContain("Try again");
    expect(withoutRetry).not.toContain("<button");
  });

  it("UnavailableState labels the not-connected condition in text, not colour alone", () => {
    const html = renderToStaticMarkup(
      <UnavailableState title="No data" description="Source not connected." />,
    );
    expect(html).toContain("Not connected");
    expect(html).toContain("No data");
  });

  it("EmptyState renders an optional working action link only when provided", () => {
    const withoutAction = renderToStaticMarkup(
      <EmptyState title="Nothing here" description="No items yet." />,
    );
    expect(withoutAction).not.toContain("<a");

    const withAction = renderToStaticMarkup(
      <EmptyState
        title="Nothing here"
        description="No items yet."
        action={{ label: "Go", href: "/app" }}
      />,
    );
    expect(withAction).toContain('href="/app"');
    expect(withAction).toContain("Go");
  });
});
