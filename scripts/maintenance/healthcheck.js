import fs from "fs";
import path from "path";

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function dir(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}

function check(name, ok) {
  console.log(`${ok ? "✔" : "✘"} ${name}`);
}

console.log("FractalOS Healthcheck\n");

const root = process.cwd();

check("kernel/", dir(path.join(root, "kernel")));
check("cockpit/", dir(path.join(root, "cockpit")));
check("api/", dir(path.join(root, "api")));
check("modules/", dir(path.join(root, "modules")));
check("manifest", exists(path.join(root, "kernel/manifests/base.manifest.json")));

console.log("\nDone\n");