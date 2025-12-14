import axios from "axios";

let cachedToken = null;
let tokenExpiry = 0;

export async function getEbayAccessToken() {
    const now = Date.now();

    // Reuse token if still valid (buffer 60s)
    if (cachedToken && now < tokenExpiry - 60000) {
        return cachedToken;
    }

    const credentials = Buffer.from(
        `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
    ).toString("base64");

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

    cachedToken = response.data.access_token;
    tokenExpiry = now + response.data.expires_in * 1000;

    console.log("✅ New eBay token fetched");

    return cachedToken;
}
