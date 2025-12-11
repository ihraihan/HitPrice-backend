// services/priceUtils.js
export function compactResults(items) {
    const prices = items.map(i => i.price).filter(v => typeof v === "number" && v > 0);
    if (!prices.length) return { avgPrice: 0, lowPrice: 0, highPrice: 0, medianPrice: 0, sampleSize: 0 };

    prices.sort((a, b) => a - b);
    const sum = prices.reduce((s, v) => s + v, 0);
    const avg = sum / prices.length;
    const median = prices[Math.floor(prices.length / 2)];
    const low = prices[0];
    const high = prices[prices.length - 1];

    return {
        avgPrice: Number(avg.toFixed(2)),
        medianPrice: Number(median.toFixed(2)),
        lowPrice: low,
        highPrice: high,
        sampleSize: prices.length
    };
}
