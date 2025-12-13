import { analyzeImageBase64 } from "../services/openaiService.js";
import { searchEbayCard } from "../services/ebayService.js";
import { calculatePrices, buildHistory } from "../services/priceUtils.js";

export const scanCard = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: "Image missing" });
        }

        // 1️⃣ OpenAI Vision
        const card = await analyzeImageBase64(image);

        // 2️⃣ eBay search
        const ebayItems = await searchEbayCard(card);

        // 3️⃣ Pricing + history
        const pricing = calculatePrices(ebayItems);
        const history = buildHistory(ebayItems);

        res.json({
            success: true,
            card,
            pricing,
            history
        });

    } catch (error) {
        console.error("Scan Error:", error);
        res.status(500).json({
            error: "Scan failed",
            details: error.message
        });
    }
};
