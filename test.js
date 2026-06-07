import { PDFParse } from "pdf-parse";

async function run() {
  const parser = new PDFParse({ url: "https://bitcoin.org/bitcoin.pdf" });

  const result = await parser.getText();
  console.log(result.text);
}

run();
