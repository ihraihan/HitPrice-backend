import axios from "axios";

export async function searchEbayCard(card) {
    const query = `${card.player_name} ${card.card_brand} baseball card`;

    const response = await axios.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        {
            headers: {
                Authorization: `Bearer ${process.env.EBAY_ACCESS_TOKEN}`,
            },
            params: {
                q: query,
                limit: 20,
                category_ids: "213",
                filter: "soldItems:true"
            }
        }
    );

    return response.data.itemSummaries || [];
}
