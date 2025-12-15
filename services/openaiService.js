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
            max_tokens: 500, // ✅ add this
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
You are a BASEBALL CARD recognition system.

ONLY process BASEBALL cards.

If the image is NOT a baseball card (e.g. Pokémon, soccer, basketball, TCG),
return EXACTLY this JSON and nothing else:

{
  "error": "NOT_BASEBALL_CARD"
}

If it IS a baseball card, return ONLY valid JSON:

{
  "player_name": "",
  "team": "",
  "card_brand": "",
  "set_name": "",
  "card_number": "",
  "year": "",
  "confidence": 0.0
}
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

