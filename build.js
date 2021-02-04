const glob = require("tiny-glob");
const {
  promises: { unlink },
} = require("fs");

const [, , arg] = process.argv;

(async () => {
  const jsPaths = await listFiles("{js,js.map}");
  Promise.all(jsPaths.map((p) => unlink(p)));
  const tsPaths = await listFiles("ts");
  await require("esbuild").build({
    entryPoints: tsPaths,
    outdir: "src",
    platform: "node",
    target: "node10.9.0",
    format: "cjs",
    sourcemap: true,
    sourcesContent: true,
    watch: arg === "--watch",
  });
})();

/** @param {string} ext */
async function listFiles(ext) {
  const allPaths = await glob(`src/**/*.${ext}`);
  const modulesPaths = await glob(`src/**/node_modules/**/*.${ext}`);
  const modulesPathsSet = new Set(modulesPaths);
  return allPaths.filter((p) => !modulesPathsSet.has(p));
}
