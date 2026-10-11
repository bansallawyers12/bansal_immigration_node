export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const value = path.trim();
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }
  if (value.startsWith("img/") || value.startsWith("storage/") || value.startsWith("assets/")) {
    return `/${value}`;
  }
  return `/storage/${value}`;
}
