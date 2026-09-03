import { describe, expect, it } from "vitest";
import { agreementFilename, safeFilename } from "./download";

describe("download filenames", () => { it("normalizes names", () => expect(safeFilename("Ada Lovelace / Co.")).toBe("ada-lovelace-co")); it("uses a draft fallback", () => expect(agreementFilename({ party1: { name: "" }, party2: { name: "" } }, "pdf")).toBe("mutual-nda-draft.pdf")); it("includes both parties", () => expect(agreementFilename({ party1: { name: "Ada Lovelace" }, party2: { name: "Grace Hopper" } }, "docx")).toBe("mutual-nda-ada-lovelace-grace-hopper.docx")); });
