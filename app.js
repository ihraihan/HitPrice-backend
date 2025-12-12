import express from "express";
import dotenv from "dotenv";
import scanRoutes from "./route/scanRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json({ limit: "10mb" }));

// routes
app.use("/api/scan", scanRoutes);

app.get("/", (req, res) => {
    res.send("HitPrice Backend Running");
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
