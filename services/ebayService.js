// services/ebayService.js
import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";
dotenv.config();

let cachedToken = null;
let tokenExpire = 0;

async function getEbayToken() {
    const now = Date.now();
    if (cachedToken && now < tokenExpire - 60000) return cachedToken; // 60s buffer

    const basic = Buffer.from(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`).toString("base64");
    const res = await axios.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        qs.stringify({ grant_type: "client_credentials", scope: "https://api.ebay.com/oauth/api_scope" }),
        { headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" } }
    );

    cachedToken = res.data.access_token;
    tokenExpire = Date.now() + (res.data.expires_in * 1000);
    return cachedToken;
}

export async function priceFromEbay(query) {
    const token = await getEbayToken();
    const url = "https://api.ebay.com/buy/browse/v1/item_summary/search";

    const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            q: query,
            filter: "sold:true",
            limit: 50,
            // you can add marketplaceIds or deliveryCountry if needed
        }
    });

    const items = res.data.itemSummaries || [];
    // normalize
    return items.map(i => ({
        title: i.title,
        price: i.price?.value ? Number(i.price.value) : null,
        currency: i.price?.currency || "USD",
        soldDate: i.epochTime ? new Date(i.epochTime) : null,
        condition: i.condition?.conditionId || "",
        url: i.itemWebUrl || ""
    }));
}
