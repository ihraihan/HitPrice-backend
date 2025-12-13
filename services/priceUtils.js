export function calculatePrices(items) {
    const prices = items
        .map(i => parseFloat(i.price?.value))
        .filter(Boolean);

    if (prices.length === 0) return null;

    return {
        low: Math.min(...prices),
        average: Number(
            (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
        ),
        high: Math.max(...prices),
        total_sales: prices.length
    };
}

export function buildHistory(items) {
    return items.slice(0, 5).map(item => ({
        title: item.title,
        price: item.price?.value,
        currency: item.price?.currency,
        image: item.image?.imageUrl,
        sold_date: item.itemEndDate,
        ebay_url: item.itemWebUrl
    }));
}
