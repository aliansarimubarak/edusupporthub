// Helper to resolve a file path like "/uploads/assignmentdone/xxx.pdf"
// into a full URL like "http://localhost:5000/uploads/assignmentdone/xxx.pdf"

export const fileUrl = (path?: string | null): string => {
  if (!path) return "";

  // If it's already an absolute URL, just return it
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Backend base URL (API host)
  const base =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Ensure we don't get http://...//uploads
  if (path.startsWith("/")) {
    return `${base}${path}`;
  }
  return `${base}/${path}`;
};
