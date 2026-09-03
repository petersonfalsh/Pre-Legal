import { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import { NdaForm, renderMarkdown } from "./nda";
import { agreementFilename } from "./download";

const licenseNotice = "License: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/";

export async function exportDocx(data: NdaForm) {
  const lines = `${renderMarkdown(data)}\n\n${licenseNotice}`.split("\n");
  const children = lines.flatMap((line) => {
    if (line.startsWith("|")) return [];
    if (line.startsWith("# ")) return [new Paragraph({ text: line.slice(2), heading: HeadingLevel.TITLE })];
    if (line.startsWith("## ")) return [new Paragraph({ text: line.slice(3), heading: HeadingLevel.HEADING_1 })];
    if (line.trim()) return [new Paragraph({ children: [new TextRun(line.replaceAll("**", ""))] })];
    return [new Paragraph({ text: "" })];
  });
  const partyTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      ["", "Party 1", "Party 2"],
      ["Name", data.party1.name, data.party2.name],
      ["Title", data.party1.title, data.party2.title],
      ["Company", data.party1.company, data.party2.company],
      ["Notice address", data.party1.address, data.party2.address],
    ].map((row) => new TableRow({ children: row.map((cell) => new TableCell({ children: [new Paragraph({ text: cell })] })) })),
  });
  children.splice(2, 0, partyTable as unknown as Paragraph);
  return { blob: await Packer.toBlob(new Document({ sections: [{ children }] })), filename: agreementFilename(data, "docx") };
}
