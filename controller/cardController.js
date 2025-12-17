import { searchEbayCardsByCategory } from "../services/ebayService.js";
import { calculatePrices, buildHistory } from "../services/priceUtils.js";

export const lookupCard = async (req, res) => {
    try {
        const { player_name, card_brand, year, card_number } = req.body;

        if (!player_name || !card_brand) {
            return res.status(400).json({ error: "Missing card data" });
        }

        const queryParts = [
            player_name,
            card_brand,
            year,
            card_number,
            "baseball card",
        ].filter(Boolean);

        const query = queryParts.join(" ");

        const items = await searchEbayCardsByCategory(query);

        if (!items.length) {
            return res.json({
                card: {
                    player_name,
                    card_brand,
                    year,
                    card_number,
                },
                pricing: null,
                history: [],
            });
        }

        return res.json({
            card: {
                player_name,
                card_brand,
                year,
                card_number,
            },
            pricing: calculatePrices(items),
            history: buildHistory(items),
        });
    } catch (err) {
        console.error("Lookup error:", err);
        res.status(500).json({ error: "Lookup failed" });
    }
};
