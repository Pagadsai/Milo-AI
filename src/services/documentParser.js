import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import JSZip from "jszip";
import * as XLSX from "xlsx";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export async function extractDocumentText(file) {
  if (!file) return "";

  const extension = file.name
    .split(".")
    .pop()
    .toLowerCase();

  switch (extension) {
    case "txt":
      return await file.text();

    case "pdf":
      return await extractPDF(file);

    case "docx":
      return await extractDOCX(file);

    case "pptx":
      return await extractPPTX(file);

    case "xlsx":
    case "xls":
      return await extractExcel(file);

    case "csv":
      return await file.text();

    default:
      return "";
  }
}

/* --- PDF --- */

async function extractPDF(file) {
  const buffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: buffer,
  }).promise;

  let output = "";

  for (let page = 1; page <= pdf.numPages; page++) {
    const p = await pdf.getPage(page);

    const content = await p.getTextContent();

    output += `\n\n===== PAGE ${page} =====\n\n`;

    output += content.items
      .map((item) => item.str)
      .join(" ");
  }

  return output;
}

/* --- DOCX --- */

async function extractDOCX(file) {
  const buffer = await file.arrayBuffer();

  const result = await mammoth.extractRawText({
    arrayBuffer: buffer,
  });

  return result.value;
}

/* --- PPTX --- */

async function extractPPTX(file) {
  const buffer = await file.arrayBuffer();

  const zip = await JSZip.loadAsync(buffer);

  const slideNames = Object.keys(zip.files)
    .filter((name) =>
      /^ppt\/slides\/slide\d+\.xml$/.test(name)
    )
    .sort((a, b) => {
      const aNum = Number(a.match(/\d+/)[0]);
      const bNum = Number(b.match(/\d+/)[0]);
      return aNum - bNum;
    });

  let output = "";

  for (let i = 0; i < slideNames.length; i++) {
    const xml = await zip.file(slideNames[i]).async("text");

    const matches = [...xml.matchAll(/<a:t>(.*?)<\/a:t>/g)];

    const slideText = matches
      .map((m) =>
        m[1]
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
      )
      .join(" ");

    output += `\n\n===== SLIDE ${i + 1} =====\n\n`;

    output += slideText;
  }

  return output;
}

/* --- EXCEL --- */

async function extractExcel(file) {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  let output = "";
  workbook.SheetNames.forEach((sheetName) => {
    output += `\n\n===== SHEET: ${sheetName} =====\n\n`;

    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      blankrows: false,
    });

    rows.forEach((row) => {
      output += row.join(" | ") + "\n";
    });
  });

  return output;
}