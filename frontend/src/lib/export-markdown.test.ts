import { describe, expect, it } from "vitest";
import { initialNda } from "./nda";
import { exportMarkdown } from "./export-markdown";

describe("Markdown export", () => {
  it("returns the complete agreement and a party-based filename", () => {
    const data = {
      ...initialNda,
      party1: { name: "Ada Lovelace", title: "Director", company: "Analytical Engines", address: "ada@example.com" },
      party2: { name: "Grace Hopper", title: "Founder", company: "Compilers Inc", address: "grace@example.com" },
    };

    const result = exportMarkdown(data);

    expect(result.filename).toBe("mutual-nda-ada-lovelace-grace-hopper.md");
    expect(result.content).toContain("Ada Lovelace");
    expect(result.content).toContain("Grace Hopper");
    expect(result.content).toContain("## Standard Terms");
    expect(result.content).toContain("Common Paper Mutual Non-Disclosure Agreement Version 1.0");
    expect(result.content).toContain("https://creativecommons.org/licenses/by/4.0/");
  });
});
