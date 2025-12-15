import { BASEBALL_CATEGORIES } from "../data/baseballCategories.js";
import { searchEbayRaw, searchEbayByCategory } from "../services/ebayService.js";

export const getBaseballCategories = async (req, res) => {
    try {
        res.json({
            success: true,
            categories: BASEBALL_CATEGORIES.map(c => ({
                id: c.id,
                title: c.title,
                total: 0,
                image: "https://via.placeholder.com/300"
            })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load categories" });
    }
};
// // ✅ categories with LIVE preview + count
// export const getBaseballCategories = async (req, res) => {
//     try {
//         const results = [];

//         for (const cat of BASEBALL_CATEGORIES) {
//             const data = await searchEbayRaw(cat.query, 1);

//             results.push({
//                 id: cat.id,
//                 title: cat.title,
//                 total: data.total || 0,
//                 image:
//                     data.itemSummaries?.[0]?.image?.imageUrl ||
//                     "https://via.placeholder.com/300",
//             });
//         }

//         res.json({
//             success: true,
//             categories: results,
//         });
//     } catch (err) {
//         console.error("Categories error:", err);
//         res.status(500).json({ error: "Failed to load categories" });
//     }
// };

// ✅ cards inside a category
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

        const items = await searchEbayByCategory(cat.query);

        res.json({
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
        console.error("Cards error:", err);
        res.status(500).json({ error: "Failed to load cards" });
    }
};
