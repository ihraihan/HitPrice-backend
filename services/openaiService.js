import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function detectMimeType(base64) {
    if (base64.startsWith("/9j/")) return "image/jpeg";
    if (base64.startsWith("iVBOR")) return "image/png";
    return "image/jpeg"; // fallback
}

export async function analyzeImageBase64(base64Image) {
    try {
        const mimeType = detectMimeType(base64Image);

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`
                            }
                        },
                        {
                            type: "text",
                            text: `
  Extract baseball card details.
  Return ONLY valid JSON. No explanation.
  `
                        }
                    ]
                }
            ]
        });

        const raw = response.choices[0].message.content;
        console.log("OpenAI RAW:", raw);

        // ✅ FIX
        const cleaned = raw
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);

    } catch (error) {
        console.error("OPENAI ERROR:", error);
        throw new Error("OpenAI Vision failed");
    }
}

