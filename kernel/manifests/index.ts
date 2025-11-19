/**
 * Manifest Loader
 *
 * Provides typed access to all manifests.
 */

import baseManifest from "./base.manifest.json";

export const manifests = { base: baseManifest };

export type KernelManifest = typeof baseManifest;

export function getManifest() {
  return manifests.base;
}
