import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageLink: String,
  description: String,
  rating:String,
  breed:String,
  color:String
});

export default mongoose.model("Product", productSchema);
