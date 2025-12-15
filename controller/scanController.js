import { analyzeImageBase64 } from "../services/openaiService.js";
import { searchEbayCard } from "../services/ebayService.js";
import { calculatePrices, buildHistory } from "../services/priceUtils.js";

export const scanCard = async (req, res) => {
    try {
        const { image } = req.body;

        // 0️⃣ Validate input
        if (!image || typeof image !== "string" || image.length < 5000) {
            return res.status(400).json({
                success: false,
                error: "Invalid or missing image"
            });
        }

        console.log("Received image length:", image.length);

        // 1️⃣ OpenAI Vision (extract card details)
        const card = await analyzeImageBase64(image);

        // 2️⃣ HARD BLOCK: non-baseball cards
        if (card?.error === "NOT_BASEBALL_CARD") {
            return res.status(400).json({
                success: false,
                error: "Only baseball cards are supported"
            });
        }

        // 3️⃣ Safety check: required baseball fields
        if (!card.player_name || !card.card_brand) {
            return res.status(400).json({
                success: false,
                error: "Invalid baseball card detected"
            });
        }

        // 4️⃣ Search eBay
        const ebayItems = await searchEbayCard(card);

        if (!ebayItems || ebayItems.length === 0) {
            return res.json({
                success: true,
                card,
                pricing: null,
                history: [],
                message: "No recent sales found on eBay"
            });
        }

        // 5️⃣ Pricing + history
        const pricing = calculatePrices(ebayItems);
        const history = buildHistory(ebayItems);

        // 6️⃣ Final response
        return res.json({
            success: true,
            card,
            pricing,
            history
        });

    } catch (error) {
        console.error("Scan Error:", error);

        return res.status(500).json({
            success: false,
            error: "Scan failed",
            details: error.message
        });
    }
};
