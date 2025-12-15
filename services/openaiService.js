import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function detectMimeType(base64) {
    if (base64.startsWith("/9j/")) return "image/jpeg";
    if (base64.startsWith("iVBOR")) return "image/png";
    return "image/jpeg";
}

export async function analyzeImageBase64(base64Image) {
    try {
        const mimeType = detectMimeType(base64Image);

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0,
            max_tokens: 600,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`,
                            },
                        },
                        {
                            type: "text",
                            text: `
You are a PROFESSIONAL BASEBALL CARD IDENTIFICATION SYSTEM.

RULES (STRICT):
- ONLY analyze BASEBALL cards.
- If the image is NOT a baseball card (Pokémon, soccer, basketball, packs, boxes, art),
  return EXACTLY:

{
  "error": "NOT_BASEBALL_CARD"
}

DO NOT GUESS.
DO NOT USE POPULARITY.
ONLY USE WHAT IS VISIBLY PRESENT IN THE IMAGE.

STEP 1 — Confirm baseball card:
- Player in MLB uniform
- Baseball branding (Topps, Panini, Bowman, etc.)
- Player name visible or inferable

STEP 2 — Extract VISUAL FEATURES (do NOT assume):
- Border color
- Chrome / Refractor / Prism / Gold / Holo
- Anniversary logos (e.g. 35th Anniversary)
- Team logo
- Year printed
- Card number printed
- Any visible badge, stamp, or logo

STEP 3 — Identify the EXACT VARIANT
- If variant cannot be confidently determined, leave fields EMPTY.
- NEVER substitute with another variant.

RETURN ONLY VALID JSON:

{
  "player_name": "",
  "team": "",
  "card_brand": "",
  "set_name": "",
  "card_number": "",
  "year": "",
  "variant": "",
  "visual_markers": [
    "border_color",
    "anniversary_logo",
    "refractor_type"
  ],
  "confidence": 0.0
}

Confidence rules:
- 0.90+ = exact match
- 0.70–0.89 = strong visual match
- <0.70 = uncertain
`
                        },
                    ],
                },
            ],
        });

        const raw = response.choices[0].message.content;
        console.log("OpenAI RAW:", raw);

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

// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// function detectMimeType(base64) {
//     if (base64.startsWith("/9j/")) return "image/jpeg";
//     if (base64.startsWith("iVBOR")) return "image/png";
//     return "image/jpeg"; // fallback
// }

// export async function analyzeImageBase64(base64Image) {
//     try {
//         const mimeType = detectMimeType(base64Image);

//         const response = await openai.chat.completions.create({
//             model: "gpt-4o",
//             temperature: 0,
//             max_tokens: 500, // ✅ add this
//             messages: [
//                 {
//                     role: "user",
//                     content: [
//                         {
//                             type: "image_url",
//                             image_url: {
//                                 url: `data:${mimeType};base64,${base64Image}`
//                             }
//                         },
//                         {
//                             type: "text",
//                             text: `
// You are a BASEBALL CARD recognition system.

// ONLY process BASEBALL cards.

// If the image is NOT a baseball card (e.g. Pokémon, soccer, basketball, TCG),
// return EXACTLY this JSON and nothing else:

// {
//   "error": "NOT_BASEBALL_CARD"
// }

// If it IS a baseball card, return ONLY valid JSON:

// {
//   "player_name": "",
//   "team": "",
//   "card_brand": "",
//   "set_name": "",
//   "card_number": "",
//   "year": "",
//   "confidence": 0.0
// }
// `
//                         }
//                     ]
//                 }
//             ]
//         });

//         const raw = response.choices[0].message.content;
//         console.log("OpenAI RAW:", raw);

//         // ✅ FIX
//         const cleaned = raw
//             .replace(/```json/g, "")
//             .replace(/```/g, "")
//             .trim();

//         return JSON.parse(cleaned);

//     } catch (error) {
//         console.error("OPENAI ERROR:", error);
//         throw new Error("OpenAI Vision failed");
//     }
// }

