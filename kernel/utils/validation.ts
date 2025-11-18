/**
 * Generic Validation Utilities
 */

export function ensure(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

export function requireKeys<T extends object>(obj: T, keys: (keyof T)[]) {
  const missing = keys.filter((k) => !(k in obj));
  if (missing.length) throw new Error("Missing keys: " + missing.join(", "));
}

