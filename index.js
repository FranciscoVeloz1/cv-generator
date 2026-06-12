const { mdToPdf } = require("md-to-pdf");
const path = require("path");
const fs = require("fs");

const CV_DIR = path.resolve(__dirname, ".", "cv-md-files");
const RESULTS_DIR = path.resolve(__dirname, ".", "results");

async function convert() {
  const files = fs.readdirSync(CV_DIR).filter((file) => file.endsWith(".md"));

  if (files.length === 0) {
    console.log("No markdown files found in cv-md-files/");
    process.exit(1);
  }

  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  for (const file of files) {
    const inputPath = path.join(CV_DIR, file);
    const outputName = file.replace(/\.md$/, ".pdf");
    const outputPath = path.join(RESULTS_DIR, outputName);

    console.log(`Converting: ${file} -> results/${outputName}`);

    const pdf = await mdToPdf(
      { path: inputPath },
      {
        stylesheet: [],
        css: `
        body {
          font-family: "Helvetica Neue", Arial, sans-serif;
          font-size: 9pt;
          line-height: 1.3;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 { font-size: 18pt; margin-bottom: 3px; color: #1a1a1a; }
        h2 { font-size: 12pt; border-bottom: 1px solid #ccc; padding-bottom: 3px; color: #1a1a1a; }
        h3 { font-size: 10pt; margin-bottom: 2px; }
        ul { margin: 4px 0; padding-left: 20px; }
        li { margin-bottom: 2px; }
        hr { border: none; border-top: 1px solid #ddd; margin: 12px 0; }
        strong { color: #1a1a1a; }
      `,
        pdf_options: {
          format: "A4",
          margin: {
            top: "12mm",
            bottom: "12mm",
            left: "12mm",
            right: "12mm",
          },
          printBackground: true,
        },
      },
    );

    if (pdf) {
      fs.writeFileSync(outputPath, pdf.content);
      console.log(`Done: results/${outputName}`);
    }
  }

  console.log("\nAll conversions complete.");
}

convert().catch((err) => {
  console.error("Conversion failed:", err.message);
  process.exit(1);
});
