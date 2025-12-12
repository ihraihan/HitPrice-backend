import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeImageFromUrl(imageUrl) {
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
                                url: imageUrl
                            }
                        },
                        {
                            type: "text",
                            text: `
Analyze this baseball card and return ONLY JSON:
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
`
                        }
                    ]
                }
            ]
        });

        const raw = response.choices[0].message.content;
        console.log("VISION RAW RESPONSE:", raw);

        return JSON.parse(raw);

    } catch (error) {
        console.error("OpenAI Vision Error:", error);
        throw new Error("OpenAI Vision failed");
    }
}
