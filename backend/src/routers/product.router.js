import { Router } from 'express';
import { ProductModel } from '../models/product.model.js';
import handler from 'express-async-handler';
import admin from '../middleware/admin.mid.js';

const router = Router();

// Hàm tiện ích để hỗ trợ phân trang
const getPaginationParams = (req) => {
  const page = Math.max(1, parseInt(req.query.page)) || 1;
  const limit = Math.max(1, parseInt(req.query.limit)) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// GET tất cả món ăn (có phân trang)
router.get(
  '/',
  handler(async (req, res) => {
    const { page, limit, skip } = getPaginationParams(req);

    const totalItems = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const products = await ProductModel.find().skip(skip).limit(limit);

    res.send({ page, limit, totalItems, totalPages, data: products });
  })
);

// POST thêm món ăn
router.post(
  '/',
  admin,
  handler(async (req, res) => {
    const { name, price, tags, favorite, imagesUrl, origins, description } = req.body;

    const product = new ProductModel({
      name,
      price,
      tags: tags.split ? tags.split(',') : tags,
      favorite,
      imageUrls: imagesUrl,
      origins: origins.split ? origins.split(',') : origins,
      description,
    });

    await product.save();
    res.send(product);
  })
);

// PUT cập nhật món ăn
router.put(
  '/',
  admin,
  handler(async (req, res) => {
    const { id, name, price, tags, favorite, imageUrls, origins, description } = req.body;

    await ProductModel.updateOne(
      { _id: id },
      {
        name,
        price,
        tags: tags.split ? tags.split(',') : tags,
        favorite,
        imageUrls,
        origins: origins.split ? origins.split(',') : origins,
        description,
      }
    );

    res.send();
  })
);

// DELETE món ăn
router.delete(
  '/:productId',
  admin,
  handler(async (req, res) => {
    const { productId } = req.params;
    await ProductModel.deleteOne({ _id: productId });
    res.send();
  })
);

// GET danh sách tags
router.get(
  '/tags',
  handler(async (req, res) => {
    const tags = await ProductModel.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: '$count',
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: 'All',
      count: await ProductModel.countDocuments(),
    };

    tags.unshift(all);

    res.send(tags);
  })
);

// GET tìm kiếm món ăn (có phân trang)
router.get(
  '/search/:searchTerm',
  handler(async (req, res) => {
    const { searchTerm } = req.params;
    const { page, limit, skip } = getPaginationParams(req);

    const searchRegex = new RegExp(searchTerm, 'i');
    const totalItems = await ProductModel.countDocuments({ name: { $regex: searchRegex } });
    const totalPages = Math.ceil(totalItems / limit);

    const products = await ProductModel.find({ name: { $regex: searchRegex } }).skip(skip).limit(limit);

    res.send({ page, limit, totalItems, totalPages, data: products });
  })
);

// GET món ăn theo tag (có phân trang)
router.get(
  '/tag/:tag',
  handler(async (req, res) => {
    const { tag } = req.params;
    const { page, limit, skip } = getPaginationParams(req);

    const totalItems = await ProductModel.countDocuments({ tags: tag });
    const totalPages = Math.ceil(totalItems / limit);

    const products = await ProductModel.find({ tags: tag }).skip(skip).limit(limit);

    res.send({ page, limit, totalItems, totalPages, data: products });
  })
);

// GET chi tiết món ăn
router.get(
  '/:productId',
  handler(async (req, res) => {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId);
    res.send(product);
  })
);

// PUT đánh giá món ăn
router.put(
  '/rate/:productId',
  handler(async (req, res) => {
    const { productId } = req.params;
    const { stars, userId, comment } = req.body;

    if (stars < 0 || stars > 5) {
      return res.status(400).send({ message: 'Stars must be between 0 and 5' });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }

    product.ratings.push({
      userId,
      rating: stars,
      comment,
      createdAt: new Date(),
    });

    const totalRating = product.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    product.stars = totalRating / product.ratings.length;

    await product.save();

    res.send(product);
  })
);

// GET danh sách đánh giá
router.get(
  '/:productId/ratings',
  handler(async (req, res) => {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId).populate('ratings.userId', 'name email');

    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }

    res.send(product.ratings);
  })
);

// POST bình luận món ăn
router.post(
  '/:productId/comments',
  handler(async (req, res) => {
    const { productId } = req.params;
    const { userId, content } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).send({ message: 'Product not found' });

    product.comments.push({ userId, content });
    await product.save();

    const updatedProduct = await ProductModel.findById(productId).populate('comments.userId', 'name email');

    res.send(updatedProduct.comments);
  })
);

// GET bình luận món ăn
router.get(
  '/:productId/comments',
  handler(async (req, res) => {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId).populate('comments.userId', 'name email');

    if (!product) return res.status(404).send({ message: 'Product not found' });

    res.send(product.comments);
  })
);

export default router;
