import { BASEBALL_SERIES } from "../data/baseballSeries.js";
import {
    searchEbayCategoryPreview,
    searchEbayCardsByCategory,
} from "../services/ebayService.js";

// ✅ Categories (dynamic, live from eBay)
export const getBaseballCategories = async (req, res) => {
    try {
        const results = [];

        for (const cat of BASEBALL_SERIES) {
            const preview = await searchEbayCategoryPreview(cat.query);

            results.push({
                id: cat.id,
                title: cat.title,
                total: preview.total,
                image: preview.image,
            });
        }

        return res.json({
            success: true,
            categories: results,
        });
    } catch (err) {
        console.error("Categories error:", err.message);
        return res.status(500).json({
            success: false,
            error: "Failed to load categories",
        });
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
