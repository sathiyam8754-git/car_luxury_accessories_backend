import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './db_connection/mongodb_config.js';
import productRoutes from './routes/product.routes.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

await connectDB();
app.get('/', (req, res) => {
  res.send('car luxury Server running');
});

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`car luxury Server started on port ${PORT}`);
});