export function safeFilename(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || "draft";
}

export function agreementFilename(data: { party1: { name: string }; party2: { name: string } }, extension: string) {
  const parties = [data.party1.name, data.party2.name].filter(Boolean).map(safeFilename);
  return `${parties.length ? `mutual-nda-${parties.join("-")}` : "mutual-nda-draft"}.${extension}`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
