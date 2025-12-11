// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scanRoutes from "./routes/scanRoutes.js";

dotenv.config();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "6mb" })); // base64 images
app.use("/api", scanRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
