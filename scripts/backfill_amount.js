import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../db_connection/mongodb_config.js';
import Product from '../models/product.model.js';

dotenv.config();

const run = async () => {
  await connectDB();

  const result = await Product.updateMany(
    { amount: { $exists: false } },
    { $set: { amount: 0 } }
  );

  const total = await Product.countDocuments();

  console.log(
    `Backfill complete → matched: ${result.matchedCount}, modified: ${result.modifiedCount}, total in product_list: ${total}`
  );

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
