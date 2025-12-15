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
export const getBaseballCards = async (req, res) => {
    try {
        const { category } = req.query;

        if (!category) {
            return res.status(400).json({ error: "Category required" });
        }

        const cat = BASEBALL_CATEGORIES.find(c => c.id === category);

        if (!cat) {
            return res.status(404).json({ error: "Invalid category" });
        }

        const items = await searchEbayCardsByCategory(cat.query);

        return res.json({
            success: true,
            cards: items.map(item => ({
                title: item.title,
                price: item.price?.value,
                currency: item.price?.currency,
                image: item.image?.imageUrl,
                ebay_url: item.itemWebUrl,
            })),
        });
    } catch (err) {
        console.error("Cards error:", err.message);
        return res.status(500).json({
            success: false,
            error: "Failed to load cards",
        });
    }
};
