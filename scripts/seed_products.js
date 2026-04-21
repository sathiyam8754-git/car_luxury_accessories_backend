import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../db_connection/mongodb_config.js';
import Product from '../models/product.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
  await connectDB();

  const jsonPath = path.join(__dirname, '..', 'data', 'products.json');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const categories = JSON.parse(raw);

  const docs = categories.flatMap((cat) =>
    cat.services.map((s) => ({
      productId: s.id,
      icon: s.icon,
      name: s.name,
      category: s.category || cat.name,
      categoryIcon: cat.icon,
      shortDesc: s.shortDesc,
      fullDesc: s.fullDesc,
      image: s.image,
      tags: s.tags || [],
    }))
  );

  const ops = docs.map((d) => ({
    updateOne: {
      filter: { productId: d.productId },
      update: { $set: d },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(ops, { ordered: false });
  const total = await Product.countDocuments();

  console.log(
    `Seed complete → upserted: ${result.upsertedCount}, modified: ${result.modifiedCount}, total in product_list: ${total}`
  );

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Seed failed:', err);
  // process.exit(1);
});
