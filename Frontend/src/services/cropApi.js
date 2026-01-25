const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export async function analyzeCrop(formData) {
  const res = await fetch(`${BASE_URL}/api/crop/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to analyze crop");
  }

  return res.json();
}