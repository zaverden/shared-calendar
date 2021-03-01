// @ts-check
const {
  promises: { writeFile, readFile, copyFile },
} = require("fs");
const md5 = require("md5-file");

const [, , ...args] = process.argv;
const argsSet = new Set(args);
const watch = argsSet.has("--watch");
const dev = argsSet.has("--dev");

async function processOutFile(filename) {
  if (watch) {
    return filename;
  }
  const hash = await md5(`../public/${filename}`);
  await copyFile(`../public/${filename}`, `../public/${hash}.${filename}`);
  return `${hash}.${filename}`;
}

function onRebuild() {
  console.log(new Date(), "Rebuild completed.");
}

(async () => {
  await require("esbuild").build({
    entryPoints: ["src/entry.tsx"],
    outdir: "../public",
    platform: "browser",
    target: "es2020",
    format: "esm",
    loader: {
      ".ts": "ts",
      ".tsx": "tsx",
      ".css": "css",
    },
    bundle: true,
    minify: !dev,
    watch: watch ? { onRebuild } : false,
    define: {
      "process.env.NODE_ENV": dev ? '"development"' : '"production"',
    },
  });
  const outJsFileName = await processOutFile("entry.js");
  const outCssFileName = await processOutFile("entry.css");
  let html = await readFile("src/index.html", { encoding: "utf8" });
  html = html
    .replace("%JS-FILE-NAME%", outJsFileName)
    .replace("%CSS-FILE-NAME%", outCssFileName);
  await writeFile("../public/index.html", html, { encoding: "utf8" });
})();
