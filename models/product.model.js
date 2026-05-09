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
    images: {
      type: [String],
      default: [],
      validate: {
        validator: arr => Array.isArray(arr) && arr.length <= 3,
        message: 'A product can have at most 3 images',
      },
    },
    tags: { type: [String], default: [] },
    amount: { type: Number, default: 0, min: 0 },
  },
  {
    collection: 'product_list',
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
