import { describe, expect, it } from "vitest";
import { initialNda, renderMarkdown, validateNda } from "./nda";

describe("Mutual NDA model", () => {
  it("provides useful defaults", () => { expect(initialNda.mndaTerm).toBe("one-year"); expect(initialNda.confidentialityTerm).toBe("one-year"); expect(initialNda.purpose).toContain("business relationship"); });
  it("reports every required empty field", () => { const errors = validateNda({ ...initialNda, purpose: "", effectiveDate: "", governingLaw: "", jurisdiction: "", party1: { name: "", title: "", company: "", address: "" }, party2: { name: "", title: "", company: "", address: "" } }); expect(Object.keys(errors)).toHaveLength(12); });
  it("interpolates parties and preserves standard terms and attribution", () => { const data = { ...initialNda, party1: { name: "Ada Lovelace", title: "Director", company: "Analytical Engines", address: "ada@example.com" }, party2: { name: "Grace Hopper", title: "Founder", company: "Compilers Inc", address: "grace@example.com" } }; const output = renderMarkdown(data); expect(output).toContain("Analytical Engines"); expect(output).toContain("Compilers Inc"); expect(output).toContain("## Standard Terms"); expect(output).toContain("CC BY 4.0"); });
});
