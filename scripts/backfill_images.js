import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../db_connection/mongodb_config.js';

dotenv.config();

const run = async () => {
  await connectDB();

  const coll = mongoose.connection.collection('product_list');

  const promote = await coll.updateMany(
    { $and: [
      { image: { $exists: true, $type: 'string', $ne: '' } },
      { $or: [{ images: { $exists: false } }, { images: { $size: 0 } }] }
    ]},
    [{ $set: { images: ['$image'] } }]
  );

  const ensureArr = await coll.updateMany(
    { images: { $exists: false } },
    { $set: { images: [] } }
  );

  const dropOld = await coll.updateMany({}, { $unset: { image: '' } });

  const total = await coll.countDocuments();
  const sample = await coll.find().sort({ productId: 1 }).limit(3).toArray();

  console.log(`Backfill complete:
  promoted image -> images[0]: ${promote.modifiedCount}
  ensured images=[] on missing: ${ensureArr.modifiedCount}
  removed legacy image field:   ${dropOld.modifiedCount}
  total docs in product_list:    ${total}`);

  console.log('Sample:');
  sample.forEach(d => console.log(`  #${d.productId} ${d.name} → images=${JSON.stringify(d.images)}`));

  await mongoose.disconnect();
};

run().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
