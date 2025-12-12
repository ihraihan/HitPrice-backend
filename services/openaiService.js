// services/openaiService.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Recommended prompt: ask structured JSON only
const PROMPT = `
You are an assistant that extracts printed information from a photographed baseball card.
Return valid JSON ONLY with keys (player, year, set, card_number, variant, grade, confidence).
If a field is missing, return empty string. Provide confidence 0.0-1.0.
`;

export async function analyzeImage(base64Image) {
    // image as data URI
    const dataUri = `data:image/jpeg;base64,${base64Image}`;

    const resp = await client.chat.completions.create({
        model: "gpt-4o-mini", // or whichever vision-enabled model you have access to
        messages: [
            { role: "user", content: PROMPT },
            { role: "user", content: [{ type: "image_url", image_url: dataUri }] }
        ],
        max_tokens: 800,
        temperature: 0
    });

    const text = resp.choices?.[0]?.message?.content ?? "";
    // parse robustly: sometimes GPT returns extra text — extract JSON block
    const jsonMatch = text.match(/(\{[\s\S]*\})/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    try {
        const parsed = JSON.parse(jsonText);
        // normalize keys
        return {
            player: parsed.player || "",
            year: parsed.year || "",
            set: parsed.set || "",
            card_number: parsed.card_number || parsed.cardNumber || "",
            variant: parsed.variant || "",
            grade: parsed.grade || "",
            confidence: parsed.confidence ?? 0
        };
    } catch (err) {
        throw new Error("Failed to parse OpenAI response: " + " raw: " + text);
    }
}
