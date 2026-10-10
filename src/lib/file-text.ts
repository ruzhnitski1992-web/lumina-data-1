import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { unzipSync, strFromU8 } from "fflate";
export async function extractFileText(file: File) {
  if (file.size > 20 * 1024 * 1024) throw new Error("El archivo supera 20 MB.");
  const ext = file.name.split(".").at(-1)?.toLowerCase();
  let text = "";
  if (ext === "txt") text = await file.text();
  else if (ext === "docx") {
    const entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
    const xml = entries["word/document.xml"];
    if (!xml) throw new Error("Documento Word no válido.");
    text =
      new DOMParser().parseFromString(strFromU8(xml), "application/xml").documentElement
        .textContent ?? "";
  } else if (ext === "pdf") {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
    }
    text = pages.join("\n");
  } else throw new Error("Solo se admiten .txt, .pdf y .docx.");
  if (!text.trim())
    throw new Error(
      "No hay texto extraíble. Los documentos escaneados necesitan OCR antes de subirlos.",
    );
  if (text.length > 120000)
    throw new Error(
      "El documento supera 120.000 caracteres. Divide el documento antes de analizarlo.",
    );
  return text;
}
