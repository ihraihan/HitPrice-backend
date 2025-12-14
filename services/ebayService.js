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
