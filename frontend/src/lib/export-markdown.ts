import { NdaForm, renderMarkdown } from "./nda";
import { agreementFilename } from "./download";

const licenseNotice = "License: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/";

export function exportMarkdown(data: NdaForm) {
  return { content: `${renderMarkdown(data)}\n\n${licenseNotice}`, filename: agreementFilename(data, "md") };
}
