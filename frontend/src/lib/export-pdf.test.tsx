import { describe, expect, it } from "vitest";
import { initialNda } from "./nda";
import { exportPdf } from "./export-pdf";

describe("PDF export", () => {
  it("returns a non-empty PDF with a party-based filename", async () => {
    const data = {
      ...initialNda,
      party1: { name: "Ada Lovelace", title: "Director", company: "Analytical Engines", address: "ada@example.com" },
      party2: { name: "Grace Hopper", title: "Founder", company: "Compilers Inc", address: "grace@example.com" },
    };

    const result = await exportPdf(data);
    const bytes = new Uint8Array(await result.blob.arrayBuffer());

    expect(result.filename).toBe("mutual-nda-ada-lovelace-grace-hopper.pdf");
    expect(result.blob.type).toBe("application/pdf");
    expect(bytes.length).toBeGreaterThan(100);
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
  });
});
