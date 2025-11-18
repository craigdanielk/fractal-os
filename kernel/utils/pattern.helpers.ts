/**
 * Pattern Helper Utilities
 */

export function mergeScaffold(a: any, b: any) {
  return {
    directories: [...(a.directories || []), ...(b.directories || [])],
    files: [...(a.files || []), ...(b.files || [])]
  };
}

