import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeImage(base64Image) {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o",  // Vision-capable model
            temperature: 0,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_image",
                            image_url: `data:image/jpeg;base64,${base64Image}`
                        },
                        {
                            type: "text",
                            text: `
Analyze this baseball card image and extract detailed information.

Return ONLY valid JSON without commentary.

{
  "player": "",
  "year": "",
  "brand": "",
  "card_number": "",
  "set_name": "",
  "variation": "",
  "grade": "",
  "confidence": 0
}

If something is unclear, leave the field empty but DO NOT guess unrealistically.`
                        }
                    ]
                }
            ]
        });

        // This is the clean JSON extracted from the AI response
        const text = response.choices[0].message.content.trim();

        return JSON.parse(text);

    } catch (error) {
        console.error("OpenAI Vision Error:", error);
        throw new Error("OpenAI Vision failed");
    }
}
