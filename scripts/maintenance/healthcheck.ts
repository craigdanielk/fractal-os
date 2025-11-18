// Converted to pure JS-compatible ESM so Node can run without ts-node
import fs from "fs";
import path from "path";

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function dirExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

export function runHealthcheck() {
  const root = process.cwd();
  const checks = [
    { name: "Kernel Present", pass: dirExists(path.join(root, "kernel")) },
    { name: "Cockpit Present", pass: dirExists(path.join(root, "cockpit")) },
    { name: "API Layer Present", pass: dirExists(path.join(root, "api")) },
    { name: "Modules Present", pass: dirExists(path.join(root, "modules")) },
    { name: "Manifest Loaded", pass: fileExists(path.join(root, "kernel/manifests/base.manifest.json")) }
  ];

  console.log("FractalOS Healthcheck\n");
  checks.forEach(c => console.log(`${c.pass ? "✔" : "✘"} ${c.name}`));
  console.log("\nHealthcheck Complete.\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runHealthcheck();
}