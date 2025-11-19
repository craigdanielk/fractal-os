

/**
 * FractalOS Healthcheck Script
 *
 * Performs a lightweight, deterministic set of checks on the
 * local FractalOS environment. This script contains no business logic,
 * makes no external network calls, and only reports local status.
 */

import fs from "fs";
import path from "path";

/* ------------------------------
   Helpers
-------------------------------*/

function fileExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function dirExists(dirPath: string): boolean {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

/* ------------------------------
   Healthcheck Logic
-------------------------------*/

export function runHealthcheck() {
  const root = process.cwd();

  const checks = [
    {
      name: "Kernel Present",
      pass: dirExists(path.join(root, "kernel"))
    },
    {
      name: "Cockpit Present",
      pass: dirExists(path.join(root, "cockpit"))
    },
    {
      name: "API Layer Present",
      pass: dirExists(path.join(root, "api"))
    },
    {
      name: "Modules Present",
      pass: dirExists(path.join(root, "modules"))
    },
    {
      name: "Manifest Loaded",
      pass: fileExists(path.join(root, "kernel/manifests/base.manifest.json"))
    }
  ];

  console.log("FractalOS Healthcheck\n");

  checks.forEach((check) => {
    console.log(`${check.pass ? "✔" : "✘"} ${check.name}`);
  });

  console.log("\nHealthcheck Complete.\n");
}

// Run automatically when invoked directly
if (require.main === module) {
  runHealthcheck();
}