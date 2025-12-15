import axios from "axios";
import { getEbayAccessToken } from "./ebayAuthService.js"; // ✅ FIX

export async function searchEbayCard(card) {
    const token = await getEbayAccessToken();

    console.log("EBAY TOKEN (first 20 chars):", token?.slice(0, 20));

    const query = `${card.player_name} ${card.card_brand} baseball card`;

    const response = await axios.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                q: query,
                category_ids: "213",
                filter: "soldItems:true",
                limit: 20,
            },
        }
    );

    return response.data.itemSummaries || [];
}

export async function discoverBaseballSetsByBrand(brand) {
    const token = await getEbayAccessToken();

    const res = await axios.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                q: `${brand} baseball card`,
                category_ids: "213",
                limit: 50,
            },
        }
    );

    const setsMap = new Map();

    for (const item of res.data.itemSummaries || []) {
        const yearMatch = item.title.match(/\b(18|19|20)\d{2}\b/);
        if (!yearMatch) continue;

        const year = yearMatch[0];
        const key = `${year}-${brand}`;

        if (!setsMap.has(key)) {
            setsMap.set(key, {
                id: key,
                title: `${year} ${brand}`,
                year,
                brand,
                image: item.image?.imageUrl,
                query: `${year} ${brand} baseball card`,
            });
        }
    }

    return [...setsMap.values()].sort((a, b) => b.year - a.year);
}

// 🔵 CATEGORY SEARCH (for Search screen grid)
export async function searchEbayCategoryPreview(query) {
    const token = await getEbayAccessToken();

    const response = await axios.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                q: query,
                category_ids: "213",
                limit: 1, // only preview image + count
            },
        }
    );

    return {
        total: response.data.total || 0,
        image:
            response.data.itemSummaries?.[0]?.image?.imageUrl ||
            "https://via.placeholder.com/300",
    };
}
// 🔵 CATEGORY FULL CARD LIST
export async function searchEbayCardsByCategory(query) {
    const token = await getEbayAccessToken();

    const response = await axios.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                q: query,
                category_ids: "213",
                limit: 30,
            },
        }
    );

    return response.data.itemSummaries || [];
}

export async function discoverBaseballSetsByBrand(brand) {
    const token = await getEbayAccessToken();

    const res = await axios.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                q: `${brand} baseball card`,
                category_ids: "213",
                limit: 50,
            },
        }
    );

    const setsMap = new Map();

    for (const item of res.data.itemSummaries || []) {
        const yearMatch = item.title.match(/\b(18|19|20)\d{2}\b/);
        if (!yearMatch) continue;

        const year = yearMatch[0];
        const key = `${year}-${brand}`;

        if (!setsMap.has(key)) {
            setsMap.set(key, {
                id: key,
                title: `${year} ${brand}`,
                year,
                brand,
                image: item.image?.imageUrl,
                query: `${year} ${brand} baseball card`,
            });
        }
    }

    return [...setsMap.values()].sort((a, b) => b.year - a.year);
}
