import { BASEBALL_SERIES } from "../data/baseballSeries.js";
import { discoverBaseballSetsByBrand, searchEbayCardsByCategory } from "../services/ebayService.js";



// 🔹 SERIES (Brand grid)
export const getBaseballSeries = (req, res) => {
    res.json({
        success: true,
        series: BASEBALL_SERIES,
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
export const getCardsByBrand = async (req, res) => {
    try {
        const { brand } = req.query;

        if (!brand) {
            return res.status(400).json({ error: "Brand required" });
        }

        const items = await searchEbayCardsByCategory(
            `${brand} baseball card`
        );

        // 🔥 FILTER OUT PACKS / LOTS
        const cards = items.filter(item => {
            const title = item.title?.toLowerCase() || "";
            return (
                !title.includes("lot") &&
                !title.includes("pack") &&
                !title.includes("box") &&
                !title.includes("sealed")
            );
        });

        return res.json({
            success: true,
            cards: cards.map(item => ({
                title: item.title,
                image: item.image?.imageUrl ?? "",
                price: item.price?.value ?? null,
                currency: item.price?.currency ?? null,
                ebay_url: item.itemWebUrl,
            })),
        });

    } catch (err) {
        console.error("Brand cards error:", err.message);
        return res.status(500).json({ error: "Failed to load cards" });
    }
};

