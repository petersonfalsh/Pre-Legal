export type Party = { name: string; title: string; company: string; address: string };
export type NdaForm = {
  purpose: string; effectiveDate: string;
  mndaTerm: "one-year" | "until-terminated";
  confidentialityTerm: "one-year" | "perpetuity";
  governingLaw: string; jurisdiction: string; party1: Party; party2: Party;
};

export const initialNda: NdaForm = {
  purpose: "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: new Date().toISOString().slice(0, 10), mndaTerm: "one-year",
  confidentialityTerm: "one-year", governingLaw: "Delaware",
  jurisdiction: "courts located in New Castle, Delaware",
  party1: { name: "", title: "", company: "", address: "" },
  party2: { name: "", title: "", company: "", address: "" },
};

export const standardTerms = [
  ["Introduction", "This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page) (\"MNDA\") allows each party (\"Disclosing Party\") to disclose information in connection with the Purpose which the Disclosing Party identifies as confidential or which should reasonably be understood as confidential (\"Confidential Information\"). Confidential Information includes technical or business information, product designs or roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and know-how."],
  ["Use and Protection of Confidential Information", "The Receiving Party shall use Confidential Information solely for the Purpose; not disclose it to third parties without prior written approval except to representatives with a reasonable need to know who are bound by confidentiality obligations no less protective than this MNDA; and protect it using at least the same protections used for its own similar information, but no less than a reasonable standard of care."],
  ["Exceptions", "The obligations do not apply to information demonstrably public through no fault of the Receiving Party, rightfully known without restrictions, obtained from a third party without restrictions, or independently developed without using Confidential Information."],
  ["Disclosures Required by Law", "The Receiving Party may disclose Confidential Information when required by law, regulation, subpoena, or court order, providing reasonable advance notice where legally permitted and cooperating with efforts to obtain confidential treatment."],
  ["Term and Termination", "This MNDA commences on the Effective Date and expires at the end of the MNDA Term. Either party may terminate it upon written notice. Confidentiality obligations survive for the Term of Confidentiality."],
  ["Return or Destruction", "Upon expiration, termination, or earlier written request, the Receiving Party will cease using Confidential Information and promptly destroy or return it. Retained backups remain subject to this MNDA."],
  ["Proprietary Rights", "The Disclosing Party retains all intellectual property and other rights in its Confidential Information; disclosure grants no license under those rights."],
  ["Disclaimer", "ALL CONFIDENTIAL INFORMATION IS PROVIDED “AS IS,” WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY, AND FITNESS FOR A PARTICULAR PURPOSE."],
  ["Governing Law and Jurisdiction", "This MNDA is governed by the laws of the State of Governing Law. Legal proceedings must be instituted in the courts located in Jurisdiction, to whose exclusive jurisdiction each party submits."],
  ["Equitable Relief", "A breach may cause irreparable harm for which monetary damages are insufficient. The Disclosing Party may seek appropriate equitable relief, including an injunction, in addition to other remedies."],
  ["General", "Neither party is obligated to disclose Confidential Information or proceed with a transaction. Assignment, waivers, severability, entire-agreement, amendment, notice, and counterpart provisions apply as set out in the Common Paper Mutual NDA Standard Terms Version 1.0."],
] as const;

export function dateLabel(value: string) {
  return value ? new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(`${value}T00:00:00`)) : "[Effective date]";
}

export function renderMarkdown(data: NdaForm) {
  const term = data.mndaTerm === "one-year" ? "Expires 1 year from the Effective Date" : "Continues until terminated";
  const confidentiality = data.confidentialityTerm === "one-year" ? "1 year from Effective Date (trade secrets remain protected while legally considered trade secrets)" : "In perpetuity";
  const replace = (text: string) => text.replaceAll("Purpose", data.purpose || "Purpose").replaceAll("Effective Date", dateLabel(data.effectiveDate)).replaceAll("MNDA Term", term).replaceAll("Term of Confidentiality", confidentiality).replaceAll("Governing Law", data.governingLaw || "Governing Law").replaceAll("Jurisdiction", data.jurisdiction || "Jurisdiction");
  return `# Mutual Non-Disclosure Agreement\n\n## Cover Page\n\n**Purpose:** ${data.purpose || "[Purpose]"}\n\n**Effective Date:** ${dateLabel(data.effectiveDate)}\n\n**MNDA Term:** ${term}\n\n**Term of Confidentiality:** ${confidentiality}\n\n**Governing Law:** ${data.governingLaw || "[Governing law]"}\n\n**Jurisdiction:** ${data.jurisdiction || "[Jurisdiction]"}\n\n| | Party 1 | Party 2 |\n|---|---|---|\n| Name | ${data.party1.name || "[Name]"} | ${data.party2.name || "[Name]"} |\n| Title | ${data.party1.title || "[Title]"} | ${data.party2.title || "[Title]"} |\n| Company | ${data.party1.company || "[Company]"} | ${data.party2.company || "[Company]"} |\n| Notice address | ${data.party1.address || "[Address]"} | ${data.party2.address || "[Address]"} |\n\n## Standard Terms\n\n${standardTerms.map(([heading, text], i) => `${i + 1}. **${heading}.** ${replace(text)}`).join("\n\n")}\n\nCommon Paper Mutual Non-Disclosure Agreement Version 1.0, free to use under CC BY 4.0.`;
}
