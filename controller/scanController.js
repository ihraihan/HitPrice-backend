import { analyzeImage } from "../services/openaiService.js";
import { getEbayPrices } from "../services/ebayService.js";

export const scanCard = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: "Image missing" });
        }

        // 1. Send image to OpenAI Vision
        const cardData = await analyzeImage(image);

        // 2. Build eBay query (example)
        const query = `${cardData.year} ${cardData.player} baseball card`;

        // 3. Get prices
        const prices = await getEbayPrices(query);

        res.json({
            card: cardData,
            pricing: prices,
        });
    } catch (err) {
        console.error("SCAN ERROR:", err);
        res.status(500).json({ error: "Scan failed", details: err.message });
    }
};
