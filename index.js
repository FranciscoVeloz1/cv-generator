const path = require("path");
const fs = require("fs");
const os = require("os");

function hasPuppeteerChrome(cacheDir) {
  if (!cacheDir) {
    return false;
  }
  const chromeRoot = path.join(cacheDir, "chrome");
  if (!fs.existsSync(chromeRoot)) {
    return false;
  }
  try {
    return fs.readdirSync(chromeRoot).some((entry) =>
      fs.existsSync(path.join(chromeRoot, entry, "chrome-linux64", "chrome")),
    );
  } catch {
    return false;
  }
}

function resolvePuppeteerCache() {
  const homeCache = path.join(os.homedir(), ".cache", "puppeteer");
  if (hasPuppeteerChrome(process.env.PUPPETEER_CACHE_DIR)) {
    return;
  }
  if (hasPuppeteerChrome(homeCache)) {
    process.env.PUPPETEER_CACHE_DIR = homeCache;
  }
}

resolvePuppeteerCache();

const { mdToPdf } = require("md-to-pdf");

const CV_DIR = path.resolve(__dirname, ".", "cv-md-files");
const RESULTS_DIR = path.resolve(__dirname, ".", "results");

const PDF_OPTIONS = {
  launch_options: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
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
};

function defaultOutputPath(inputPath) {
  if (/\.md$/i.test(inputPath)) {
    return inputPath.replace(/\.md$/i, ".pdf");
  }
  return `${inputPath}.pdf`;
}

async function convertFile(inputPath, outputPath) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Markdown file not found: ${inputPath}`);
  }

  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Converting: ${inputPath} -> ${outputPath}`);

  const pdf = await mdToPdf({ path: inputPath }, PDF_OPTIONS);

  if (!pdf) {
    throw new Error("md-to-pdf returned empty result");
  }

  fs.writeFileSync(outputPath, pdf.content);
  console.log(`Done: ${outputPath}`);
  return outputPath;
}

async function convertDir() {
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
    await convertFile(inputPath, outputPath);
  }

  console.log("\nAll conversions complete.");
}

async function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");

  if (args.length === 0) {
    await convertDir();
    return;
  }

  const inputPath = path.resolve(args[0]);
  const outputPath = args[1] ? path.resolve(args[1]) : defaultOutputPath(inputPath);

  if (outputPath === inputPath) {
    throw new Error("Could not derive PDF path; pass an explicit output path");
  }

  await convertFile(inputPath, outputPath);
}

main().catch((err) => {
  console.error("Conversion failed:", err.message);
  process.exit(1);
});
