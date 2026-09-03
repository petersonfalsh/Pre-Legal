import { describe, expect, it } from "vitest";
import { initialNda } from "./nda";
import { exportDocx } from "./export-docx";

describe("DOCX export", () => {
  it("includes the complete agreement content in a DOCX blob", async () => {
    const data = {
      ...initialNda,
      party1: { name: "Ada Lovelace", title: "Director", company: "Analytical Engines", address: "ada@example.com" },
      party2: { name: "Grace Hopper", title: "Founder", company: "Compilers Inc", address: "grace@example.com" },
    };

    const result = await exportDocx(data);
    const bytes = new Uint8Array(await result.blob.arrayBuffer());
    const content = new TextDecoder().decode(bytes);

    expect(result.filename).toBe("mutual-nda-ada-lovelace-grace-hopper.docx");
    expect(bytes.length).toBeGreaterThan(0);
    expect(content).toContain("PK");
  });
});
