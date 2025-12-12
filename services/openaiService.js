import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Analyze card using OpenAI Vision (BASE64 input)
export async function analyzeImageBase64(base64Image) {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o",
            temperature: 0,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        },
                        {
                            type: "text",
                            text: `
You are a sports card recognition system.
Extract the **exact card details** and return ONLY JSON:

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

        const rawText = response.choices[0].message.content;
        console.log("RAW OPENAI RESPONSE:", rawText);

        return JSON.parse(rawText);

    } catch (err) {
        console.error("OpenAI Vision Error:", err);
        throw new Error("OpenAI Vision failed");
    }
}
