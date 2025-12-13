import { analyzeImageBase64 } from "../services/openaiService.js";

export const scanCard = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: "Image missing" });
        }

        console.log("Received image length:", image.length);

        const cardData = await analyzeImageBase64(image);

        res.json({
            success: true,
            card: cardData
        });

    } catch (err) {
        console.error("Scan Error:", err);
        res.status(500).json({
            error: "Scan failed",
            details: err.message
        });
    }
};
