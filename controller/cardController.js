import { searchEbayByQuery } from "../services/ebayService.js";
import { calculatePrices, buildHistory } from "../services/priceUtils.js";

export const lookupCard = async (req, res) => {
    try {
        const { player, brand, set_name, variant, year } = req.body;

        if (!player || !brand) {
            return res.status(400).json({ error: "player and brand required" });
        }

        // 🔥 BUILD FLEXIBLE QUERY
        let query = `${player} ${brand} baseball card`;

        if (set_name) query += ` ${set_name}`;
        if (variant) query += ` ${variant}`;
        if (year) query += ` ${year}`;

        const items = await searchEbayByQuery(query);

        if (!items.length) {
            return res.json({
                success: false,
                message: "No cards found",
            });
        }

        const pricing = calculatePrices(items);
        const history = buildHistory(items);

        return res.json({
            success: true,
            card: {
                player_name: player,
                card_brand: brand,
                set_name,
                variant,
                year,
            },
            pricing,
            history,
        });

    } catch (err) {
        console.error("Lookup error:", err);
        res.status(500).json({ error: "Lookup failed" });
    }
};

