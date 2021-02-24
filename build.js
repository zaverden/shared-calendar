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
    sourcemap: false,
    minify: true,
    watch: arg === "--watch",
  });
})();
