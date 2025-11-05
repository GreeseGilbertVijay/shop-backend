import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Insert 5 sample products (run once manually)
router.get("/seed", async (req, res) => {
  await Product.deleteMany();
  await Product.insertMany([
    { name: "Red Shoes", price: 1200, image: "/red-shoes.jpg", description: "Comfortable stylish shoes." },
    { name: "Blue Shirt", price: 950, image: "/blue-shirt.jpg", description: "Premium cotton shirt." },
    { name: "Smart Watch", price: 2500, image: "/watch.jpg", description: "Track fitness and notifications." },
    { name: "Laptop Bag", price: 1800, image: "/bag.jpg", description: "Durable waterproof bag." },
    { name: "Sunglasses", price: 600, image: "/sunglasses.jpg", description: "UV protected modern style shades." }
  ]);
  res.send("✅ Seeded 5 products");
});

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

export default router;
