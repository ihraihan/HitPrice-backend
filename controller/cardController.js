// import { searchEbayByQuery } from "../services/ebayService.js";
// import { calculatePrices, buildHistory } from "../services/priceUtils.js";

// export const lookupCard = async (req, res) => {
//     try {
//         const { player, brand, set_name, variant, year } = req.body;

//         if (!player || !brand) {
//             return res.status(400).json({ error: "player and brand required" });
//         }

//         // 🔥 BUILD FLEXIBLE QUERY
//         let query = `${player} ${brand} baseball card`;

//         if (set_name) query += ` ${set_name}`;
//         if (variant) query += ` ${variant}`;
//         if (year) query += ` ${year}`;

//         const items = await searchEbayByQuery(query);

//         if (!items.length) {
//             return res.json({
//                 success: false,
//                 message: "No cards found",
//             });
//         }

//         const pricing = calculatePrices(items);
//         const history = buildHistory(items);

//         return res.json({
//             success: true,
//             card: {
//                 player_name: player,
//                 card_brand: brand,
//                 set_name,
//                 variant,
//                 year,
//             },
//             pricing,
//             history,
//         });

//     } catch (err) {
//         console.error("Lookup error:", err);
//         res.status(500).json({ error: "Lookup failed" });
//     }
// };
import { searchEbayByQuery } from "../services/ebayService.js";
import { calculatePrices, buildHistory } from "../services/priceUtils.js";

export const lookupCard = async (req, res) => {
    try {
        const {
            query,
            player,
            brand,
            set_name,
            variant,
            year,
            card_number,
        } = req.body;

        // ✅ 1. Decide search query
        let searchQuery = null;

        // Case A: direct query (SEARCH / FAVORITES)
        if (query && query.trim().length > 0) {
            searchQuery = query;
        }

        // Case B: structured scan lookup
        if (!searchQuery && player && brand) {
            searchQuery = [
                player,
                brand,
                set_name,
                variant,
                card_number,
                year,
                "baseball card",
            ]
                .filter(Boolean)
                .join(" ");
        }

        // ❌ Nothing usable
        if (!searchQuery) {
            return res.status(400).json({
                error: "query OR (player and brand) required",
            });
        }

        // 🔍 Search eBay SOLD items
        const items = await searchEbayByQuery(searchQuery);

        if (!items.length) {
            return res.json({
                success: false,
                message: "No cards found",
            });
        }

        // 💰 Pricing + history
        const pricing = calculatePrices(items);
        const history = buildHistory(items);

        return res.json({
            success: true,
            card: {
                player_name: player ?? null,
                card_brand: brand ?? null,
                set_name: set_name ?? null,
                variant: variant ?? null,
                year: year ?? null,
                card_number: card_number ?? null,
                query_used: searchQuery, // 🔥 helpful for debugging
            },
            pricing,
            history,
        });
    } catch (err) {
        console.error("Lookup error:", err);
        res.status(500).json({ error: "Lookup failed" });
    }
};

