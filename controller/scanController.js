import { analyzeImageFromUrl } from "../services/openaiService.js";

export const scanCard = async (req, res) => {
    try {
        const { image_url } = req.body;

        if (!image_url) {
            return res.status(400).json({ error: "image_url missing" });
        }

        const cardData = await analyzeImageFromUrl(image_url);

        res.json({
            success: true,
            card: cardData,
            pricing: {
                message: "Pricing not added yet",
                low: null,
                mid: null,
                high: null
            }
        });

    } catch (error) {
        console.error("Scan Error:", error);
        res.status(500).json({ error: "Scan failed" });
    }
};
