import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function extractJsonFromText(text) {
    // find first {...} block — robust against extra commentary
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
        return JSON.parse(m[0]);
    } catch (e) {
        return null;
    }
}

export async function analyzeImage(base64Image) {
    try {
        // ensure prefix
        const dataUri = base64Image.startsWith("data:") ? base64Image : `data:image/jpeg;base64,${base64Image}`;

        const response = await client.chat.completions.create({
            model: "gpt-4o",           // use your vision-capable model
            temperature: 0,
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "input_image", image_url: dataUri },
                        {
                            type: "text",
                            text: `
Analyze the baseball card in this image. Return ONLY a single JSON object (no explanation) with these keys:
{
  "player": "",
  "year": "",
  "brand": "",
  "card_number": "",
  "set_name": "",
  "variation": "",
  "grade": "",
  "confidence": 0.0
}
If you can't identify a field, leave it as empty string or 0 for confidence.
`
                        }
                    ]
                }
            ]
        });

        const raw = response.choices?.[0]?.message?.content ?? JSON.stringify(response);
        // log raw response to server logs for debugging
        console.log("OpenAI raw response:", raw.slice ? raw.slice(0, 2000) : raw);

        // Try to parse JSON inside message
        const json = extractJsonFromText(raw);
        if (!json) {
            console.error("Failed to extract JSON from OpenAI response. Raw:", raw);
            throw new Error("OpenAI returned non-JSON response");
        }
        return json;
    } catch (err) {
        console.error("analyzeImage error:", err);
        throw err;
    }
}
