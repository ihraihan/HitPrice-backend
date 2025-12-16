import { BASEBALL_PLAYERS } from "../data/baseballPlayers.js";
import { discoverBaseballSetsByBrand, searchEbayCardsByCategory } from "../services/ebayService.js";



// 🔹 SERIES (Brand grid)
export const getBaseballSeries = (req, res) => {
    res.json({
        success: true,
        series: BASEBALL_PLAYERS,
    });
};

// 🔹 SETS (dynamic years)
export const getBaseballSets = async (req, res) => {
    try {
        const { brand } = req.query;

        if (!brand) {
            return res.status(400).json({ error: "Brand required" });
        }

        const sets = await discoverBaseballSetsByBrand(brand);

        res.json({
            success: true,
            sets,
        });
    } catch (err) {
        console.error("Sets error:", err);
        res.status(500).json({ error: "Failed to load sets" });
    }
};


// ✅ Cards inside a category
// ✅ Cards by player (clean + safe)
export const getCardsByPlayer = async (req, res) => {
    try {
        const { player } = req.query;

        if (!player || player.length < 3) {
            return res.status(400).json({
                success: false,
                error: "Valid player name required",
            });
        }

        const items = await searchEbayCardsByCategory(
            `${player} baseball card`
        );

        // 🔥 HARD FILTER: remove junk listings
        const cards = items.filter(item => {
            const title = item.title?.toLowerCase() || "";

            return (
                !title.includes("lot") &&
                !title.includes("pack") &&
                !title.includes("box") &&
                !title.includes("sealed") &&
                !title.includes("digital") &&
                !title.includes("custom") &&
                !title.includes("reprint")
            );
        });

        return res.json({
            success: true,
            player,
            total: cards.length,
            cards: cards.map(item => ({
                title: item.title,
                image: item.image?.imageUrl ?? "",
                price: item.price?.value ?? null,
                currency: item.price?.currency ?? null,
                ebay_url: item.itemWebUrl,
            })),
        });

    } catch (err) {
        console.error("Player cards error:", err.message);
        return res.status(500).json({
            success: false,
            error: "Failed to load player cards",
        });
    }
};
