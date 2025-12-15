import express from "express";
import dotenv from "dotenv";
import scanRoutes from "./route/scanRoutes.js";
import baseballRoutes from "./route/baseballRoutes.js";

dotenv.config();

const app = express();

// Parse JSON (allow base64 images)
app.use(express.json({ limit: "10mb" }));

// Root route (for quick testing)
app.get("/", (req, res) => {
    res.send("HitPrice backend is running 🚀");
});

// Scan route
app.use("/api/scan", scanRoutes);
// Baseball route
app.use("/api/baseball", baseballRoutes);

// Get port from Railway, fallback to 3000 locally
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
