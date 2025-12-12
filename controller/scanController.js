import { analyzeImageBase64 } from "../services/openaiService.js";

export const scanCard = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: "Image (base64) missing" });
        }

        console.log("Received image length:", image.length);

        // Send to OpenAI
        const cardData = await analyzeImageBase64(image);

        // Return response
        res.json({
            success: true,
            card: cardData,
            pricing: {
                message: "eBay pricing not added yet",
                low: null,
                mid: null,
                high: null
            }
        });

    } catch (error) {
        console.error("Scan Error:", error);
        res.status(500).json({ error: "Scan failed", details: error.message });
    }
};
