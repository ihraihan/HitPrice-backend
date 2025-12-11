// controllers/scanController.js
import { analyzeImage } from "../services/openaiService.js";
import { priceFromEbay } from "../services/ebayService.js";
import { compactResults } from "../services/priceUtils.js";

export async function scanHandler(req, res) {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: "image required" });

        // 1) Send image to OpenAI Vision to extract card fields
        const cardData = await analyzeImage(image);
        // cardData should include: player, year, set, card_number, variant, confidence

        // 2) Build search query from extracted fields
        const qparts = [];
        if (cardData.year) qparts.push(cardData.year);
        if (cardData.set) qparts.push(cardData.set);
        if (cardData.player) qparts.push(cardData.player);
        if (cardData.card_number) qparts.push(`#${cardData.card_number}`);
        const query = qparts.join(" ");

        // 3) Query eBay sold items
        const soldItems = await priceFromEbay(query);

        // 4) Compute aggregated pricing
        const pricing = compactResults(soldItems);

        // 5) Return combined data
        res.json({
            card: cardData,
            pricing,
            source: "openai + ebay",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "scan failed", details: err.message });
    }
}
