import { analyzeImage } from "../services/openaiService.js";

export const scanCard = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: "Image missing" });
        }

        // 1. Extract card details from OpenAI Vision
        const cardData = await analyzeImage(image);

        // 2. TEMP — No eBay yet (we add later)
        const pricing = {
            message: "Pricing not enabled yet",
            low: null,
            mid: null,
            high: null
        };

        res.json({
            success: true,
            card: cardData,
            pricing: pricing
        });

    } catch (error) {
        console.error("Scan Error:", error);
        res.status(500).json({ error: "Scan failed" });
    }
};
