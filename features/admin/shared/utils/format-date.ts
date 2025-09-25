export function formatDate(timestamp: number | undefined) {
  if (!timestamp) return "—";
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(timestamp));
  } catch {
    return "—";
  }
}
