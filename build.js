const glob = require("tiny-glob");
const {
  promises: { unlink },
} = require("fs");

const [, , arg] = process.argv;

(async () => {
  const tsPaths = await glob("src-ts/**/index.ts");
  await require("esbuild").build({
    entryPoints: tsPaths,
    outdir: "src",
    outbase: "src-ts",
    platform: "node",
    target: "node10.9.0",
    format: "cjs",
    bundle: true,
    sourcemap: true,
    sourcesContent: true,
    minify: true,
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
