import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { cpSync, mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const source = dirname(require.resolve("pdfjs-dist/package.json"));
const target = new URL("../public/pdfjs/", import.meta.url);

mkdirSync(target, { recursive: true });

for (const name of ["cmaps", "standard_fonts", "wasm", "iccs"]) {
  cpSync(join(source, name), new URL(name, target), {
    recursive: true,
  });
}

console.log("Aset PDF.js berhasil disalin.");