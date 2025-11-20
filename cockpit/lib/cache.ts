const memory = new Map<string, any>();

const TTL_MS = 1000 * 60 * 2; // 2 minutes

export function cacheSet(key: string, value: any) {
  memory.set(key, { value, expires: Date.now() + TTL_MS });
}

export function cacheGet(key: string) {
  const item = memory.get(key);
  if (!item) return null;
  if (Date.now() > item.expires) {
    memory.delete(key);
    return null;
  }
  return item.value;
}

export function cacheInvalidate(prefix: string) {
  for (const key of memory.keys()) {
    if (key.startsWith(prefix)) memory.delete(key);
  }
}

