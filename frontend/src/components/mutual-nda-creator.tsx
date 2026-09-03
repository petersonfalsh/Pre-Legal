"use client";
import { useState } from "react";
import MutualNdaForm from "./mutual-nda-form";
import MutualNdaPreview from "./mutual-nda-preview";
import { downloadBlob } from "../lib/download";
import { exportDocx } from "../lib/export-docx";
import { exportMarkdown } from "../lib/export-markdown";
import { exportPdf } from "../lib/export-pdf";
import { initialNda, NdaErrors, NdaForm, validateNda } from "../lib/nda";

export default function MutualNdaCreator() {
  const [data, setData] = useState(initialNda); const [errors, setErrors] = useState<NdaErrors>({}); const [tab, setTab] = useState<"preview" | "terms">("preview"); const [busy, setBusy] = useState(false);
  const update = <K extends keyof NdaForm>(key: K, value: NdaForm[K]) => { setData((d) => ({ ...d, [key]: value })); setErrors((e) => ({ ...e, [key]: undefined })); };
  const updateParty = (who: "party1" | "party2", key: keyof NdaForm["party1"], value: string) => { setData((d) => ({ ...d, [who]: { ...d[who], [key]: value } })); setErrors((e) => ({ ...e, [`${who}.${key}`]: undefined })); };
  const runExport = async (kind: "md" | "docx" | "pdf") => { const nextErrors = validateNda(data); if (Object.keys(nextErrors).length > 0) { setErrors(nextErrors); return; } if (busy) return; setBusy(true); try { if (kind === "md") { const result = exportMarkdown(data); downloadBlob(new Blob([result.content], { type: "text/markdown" }), result.filename); } if (kind === "docx") { const result = await exportDocx(data); downloadBlob(result.blob, result.filename); } if (kind === "pdf") { const result = await exportPdf(data); downloadBlob(result.blob, result.filename); } } finally { setBusy(false); } };
  return <main className="app-shell"><header className="topbar"><div><p className="eyebrow">PRE-LEGAL · DOCUMENT BUILDER</p><h1>Mutual NDA Creator</h1></div><span className="status-pill">Private workspace</span></header><section className="intro"><div><p className="eyebrow">COMMON PAPER STANDARD · VERSION 1.0</p><h2>Build a mutual non-disclosure agreement.</h2><p>Enter the deal details and download a polished agreement when you’re ready.</p></div><div className="license-note">Free to use under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a></div></section><div className="workspace"><div><MutualNdaForm data={data} errors={errors} update={update} updateParty={updateParty} /><div className="form-actions card-actions"><button className="primary" type="button" disabled={busy} onClick={() => runExport("docx")}>{busy ? "Preparing…" : "Download DOCX"}</button><button className="secondary" type="button" disabled={busy} onClick={() => runExport("pdf")}>Download PDF</button><button className="text-button" type="button" disabled={busy} onClick={() => runExport("md")}>Markdown</button></div>{Object.keys(errors).length > 0 && <p className="validation-summary" role="alert">Complete the highlighted fields before downloading.</p>}</div><MutualNdaPreview data={data} tab={tab} setTab={setTab} /></div><footer>Common Paper Mutual Non-Disclosure Agreement Version 1.0 · <a href="https://commonpaper.com/standards/mutual-nda/1.0" target="_blank">View source standard</a></footer></main>;
}
