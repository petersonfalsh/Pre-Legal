import { pdf, Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { NdaForm, renderMarkdown } from "./nda";
import { agreementFilename } from "./download";

const licenseNotice = "License: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/";
const styles = StyleSheet.create({ page: { padding: 42, fontSize: 10 }, title: { fontSize: 22, marginBottom: 16 }, heading: { fontSize: 13, marginTop: 12, marginBottom: 4 }, text: { lineHeight: 1.45, marginBottom: 7 }, table: { marginTop: 8, marginBottom: 12 }, row: { flexDirection: "row" }, cell: { width: "33%", borderWidth: 0.5, padding: 4 } });

function PdfDocument({ data }: { data: NdaForm }) {
  const lines = `${renderMarkdown(data)}\n\n${licenseNotice}`.split("\n");
  return <Document><Page size="LETTER" style={styles.page} wrap>
    {lines.map((line, index) => {
      if (line.startsWith("# ")) return <Text key={index} style={styles.title}>{line.slice(2)}</Text>;
      if (line.startsWith("## ")) return <Text key={index} style={styles.heading}>{line.slice(3)}</Text>;
      if (line.startsWith("|")) return null;
      if (line.trim()) return <Text key={index} style={styles.text}>{line.replaceAll("**", "")}</Text>;
      return <View key={index} style={{ height: 3 }} />;
    })}
    <View style={styles.table}>
      {[["", "Party 1", "Party 2"], ["Name", data.party1.name, data.party2.name], ["Title", data.party1.title, data.party2.title], ["Company", data.party1.company, data.party2.company], ["Notice address", data.party1.address, data.party2.address]].map((row, rowIndex) => <View key={rowIndex} style={styles.row}>{row.map((cell, cellIndex) => <Text key={cellIndex} style={styles.cell}>{cell}</Text>)}</View>)}
    </View>
  </Page></Document>;
}

export async function exportPdf(data: NdaForm) {
  return { blob: await pdf(<PdfDocument data={data} />).toBlob(), filename: agreementFilename(data, "pdf") };
}
