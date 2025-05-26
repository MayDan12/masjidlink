// lib/sanitize.ts
export const sanitizeData = (data: any): any => {
  if (data === null || typeof data !== "object") return data;

  // Convert Firestore Timestamp to ISO string
  if (typeof data.toDate === "function") {
    return data.toDate().toISOString();
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  // Handle plain objects
  const result: Record<string, any> = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      result[key] = sanitizeData(data[key]);
    }
  }
  return result;
};
