export async function analyzeCrop(formData) {
  const res = await fetch("http://localhost:5000/api/crop/analyze", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to analyze crop");
  }

  return res.json();
}
