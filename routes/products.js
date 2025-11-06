import express from "express";
import Product from "../models/Product.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid product id" });
  }
});

// Create product (public)
router.post("/", async (req, res) => {
  try {
    const { name, price, imageLink, description, breed, color, count } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: "'name' and 'price' are required" });
    }
    const product = await Product.create({ name, price, imageLink, description, breed, color, count });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Failed to create product" });
  }
});

// Update product (full update)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, price, imageLink, description, breed, color, count } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, imageLink, description, breed, color, count },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update product" });
  }
});

// Partial update
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update product" });
  }
});

// Delete product
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: "Failed to delete product" });
  }
});

export default router;
