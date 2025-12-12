import { analyzeImage } from "../services/openaiService.js";

// TEMPORARY: no eBay API yet
export const scanCard = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: "Image missing" });
        }

        // 1. Send image to OpenAI Vision
        const cardData = await analyzeImage(image);

        // 2. TEMPORARY MOCK PRICES
        const prices = {
            low: 10,
            mid: 20,
            high: 30,
            message: "eBay pricing not implemented yet",
        };

        res.json({
            success: true,
            card: cardData,
            pricing: prices,
        });
    } catch (error) {
        console.error("SCAN ERROR", error);
        res.status(500).json({ error: "Scan failed", details: error.message });
    }
};
