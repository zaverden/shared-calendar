// @ts-check
const {
  promises: { writeFile, readFile, rename },
} = require("fs");
const md5 = require("md5-file");

const [, , ...args] = process.argv;
const argsSet = new Set(args);
const watch = argsSet.has("--watch");
const dev = argsSet.has("--dev");

async function processOutFile() {
  if (watch) {
    return "entry.js";
  }
  const hash = await md5("../public/entry.js");
  await rename("../public/entry.js", `../public/entry.${hash}.js`);
  return `entry.${hash}.js`;
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
    },
    bundle: true,
    sourcemap: "inline",
    minify: true,
    watch: watch ? { onRebuild } : false,
    define: {
      "process.env.NODE_ENV": dev ? '"development"' : '"production"',
    },
  });
  const outFileName = await processOutFile();
  let html = await readFile("src/index.html", { encoding: "utf8" });
  html = html.replace("%JS-FILE-NAME%", outFileName);
  await writeFile("../public/index.html", html, { encoding: "utf8" });
})();
