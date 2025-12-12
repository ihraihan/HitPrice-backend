import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function getEbayToken() {
    const clientId = process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET;

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await axios.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${credentials}`,
            },
        }
    );

    return response.data.access_token;
}

export async function getEbayPrices(query) {
    const token = await getEbayToken();

    const response = await axios.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        {
            params: {
                q: query,
                filter: "sold:true",
                limit: 10,
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.data.itemSummaries || [];
}
