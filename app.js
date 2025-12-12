import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scanRoutes from "./route/scanRoutes.js"; // your path

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "8mb" })); // allow base64 images

app.use("/api", scanRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
