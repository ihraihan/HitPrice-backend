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

        console.log("Detected MIME:", mimeType);
        console.log("Base64 length:", base64Image.length);

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
You are a professional sports card recognition system.

Extract visible baseball card data and return ONLY valid JSON:

{
  "player": "",
  "year": "",
  "brand": "",
  "set_name": "",
  "card_number": "",
  "variation": "",
  "grade": "",
  "confidence": 0.0
}
`
                        }
                    ]
                }
            ]
        });

        const content = response.choices[0].message.content;
        console.log("OpenAI RAW:", content);

        return JSON.parse(content);

    } catch (error) {
        console.error("OPENAI FULL ERROR:", error);
        throw new Error("OpenAI Vision failed");
    }
}
