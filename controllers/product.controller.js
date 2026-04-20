import Product from '../models/product.model.js';

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ productId: 1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      productId,
      icon,
      name,
      category,
      categoryIcon,
      shortDesc,
      fullDesc,
      image,
      tags,
    } = req.body;

    if (!name || !category) {
      return res
        .status(400)
        .json({ success: false, message: 'name and category are required' });
    }

    let finalId = productId;
    if (!finalId) {
      const last = await Product.findOne().sort({ productId: -1 }).lean();
      finalId = last ? last.productId + 1 : 1;
    } else {
      const exists = await Product.findOne({ productId: finalId }).lean();
      if (exists) {
        return res.status(409).json({
          success: false,
          message: `productId ${finalId} already exists`,
        });
      }
    }

    const product = await Product.create({
      productId: finalId,
      icon,
      name,
      category,
      categoryIcon,
      shortDesc,
      fullDesc,
      image,
      tags,
    });

    res.status(201).json({
      success: true,
      message: 'Product added',
      data: product,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId, ...updates } = req.body;

    if (productId === undefined || productId === null) {
      return res
        .status(400)
        .json({ success: false, message: 'productId is required in body' });
    }

    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.__v;

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No fields provided to update' });
    }

    const updated = await Product.findOneAndUpdate(
      { productId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `No product found with productId ${productId}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (productId === undefined || productId === null) {
      return res
        .status(400)
        .json({ success: false, message: 'productId is required in body' });
    }

    const deleted = await Product.findOneAndDelete({ productId });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `No product found with productId ${productId}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted',
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
