import { Router } from 'express';
import {
  listProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

const router = Router();

router.get('/', listProducts);
router.post('/add', addProduct);
router.post('/update', updateProduct);
router.post('/delete', deleteProduct);

export default router;
