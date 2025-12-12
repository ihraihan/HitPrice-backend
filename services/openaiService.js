import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeImage(base64Image) {
    try {
        const dataUri = base64Image.startsWith("data:")
            ? base64Image
            : `data:image/jpeg;base64,${base64Image}`;

        const response = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_image",
                            image_url: {
                                url: dataUri
                            }
                        },
                        {
                            type: "text",
                            text: `
Extract baseball card details. Return ONLY JSON with fields:
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
        console.log("OpenAI raw:", raw);

        return JSON.parse(raw);

    } catch (error) {
        console.error("OpenAI Vision Error:", error);
        throw new Error("OpenAI Vision failed");
    }
}
