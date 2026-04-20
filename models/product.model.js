import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true, index: true },
    icon: { type: String, default: '' },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    categoryIcon: { type: String, default: '' },
    shortDesc: { type: String, default: '' },
    fullDesc: { type: String, default: '' },
    image: { type: String, default: '' },
    tags: { type: [String], default: [] }, 
  },
  {
    collection: 'product_list',
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
