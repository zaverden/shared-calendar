const glob = require("tiny-glob");
const {
  promises: { unlink },
} = require("fs");

const [, , arg] = process.argv;

(async () => {
  const jsPaths = await glob("src/**/*.{js,js.map}");
  Promise.all(jsPaths.map((p) => unlink(p)));
  const tsPaths = await glob("src/**/*.ts");
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
