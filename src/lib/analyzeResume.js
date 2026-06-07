import { ai } from "@/lib/gemini";

export async function analyzeResumePdf(fileUrl) {
  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error("Unable to download resume");
  }

  const arrayBuffer = await response.arrayBuffer();

  const base64Pdf = Buffer.from(arrayBuffer).toString("base64");

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    contents: [
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Pdf,
        },
      },

      {
        text: `
          Analyze this resume for ATS compatibility.

          Return ONLY valid JSON.

          {
            "score": number,
            "strengths": ["..."],
            "weaknesses": ["..."],
            "suggestions": ["..."]
          }

          Rules:
          - Score must be between 0 and 100
          - 3-5 strengths
          - 3-5 weaknesses
          - 3-5 suggestions
          - No markdown
          - No explanations outside JSON
          `,
      },
    ],
  });

  return result.text;
}
