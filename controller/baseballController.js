export const getBaseballCategories = (req, res) => {
    res.json({
        success: true,
        categories: BASEBALL_CATEGORIES
    });
};

export const getBaseballCards = async (req, res) => {
    const { category } = req.query;

    if (!category) {
        return res.status(400).json({ error: "Category required" });
    }

    const items = await searchEbayByCategory(category);

    res.json({
        success: true,
        cards: items
    });
};
