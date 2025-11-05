import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DB connect
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Health/root route
app.get("/", (req, res) => {
  res.send("✅ Server running successfully");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
