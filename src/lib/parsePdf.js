import PDFParser from "pdf2json";

export function parsePdf(buffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(err);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      let text = "";

      for (const page of pdfData.Pages) {
        for (const item of page.Texts) {
          text += decodeURIComponent(item.R[0].T) + " ";
        }
      }

      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}
