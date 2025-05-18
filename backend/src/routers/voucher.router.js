import { Router } from 'express';
import handler from 'express-async-handler';
import admin from '../middleware/admin.mid.js';
import { VoucherModel } from '../models/voucher.model.js';

const router = Router();

router.get(
  '/',
  handler(async (req, res) => {
    const vouchers = await VoucherModel.find({});
    res.send(vouchers);
  })
);


router.get(
  '/:id',
  handler(async (req, res) => {
    const { id } = req.params;
    const voucher = await VoucherModel.findById(id);
    if (!voucher) {
      return res.status(404).send({ message: 'Voucher not found' });
    }
    res.send(voucher);
  })
);

// Create a new voucher
router.post(
  '/',
  admin,
  handler(async (req, res) => {
    const { code, discountPercent, startDate, expiryDate, usageLimit, minOrderAmount } = req.body;

    const newVoucher = new VoucherModel({
      code,
      discountPercent,
      startDate,
      expiryDate,
      usageLimit,
      minOrderAmount
    });

    await newVoucher.save();
    res.send(newVoucher);
  })
);

// Update a voucher
router.put(
  '/:id',
  admin,
  handler(async (req, res) => {
    const { id } = req.params;
    const { code, discountPercent, startDate, expiryDate, usageLimit, minOrderAmount } = req.body;

    const updated = await VoucherModel.findByIdAndUpdate(
      id,
      { code, discountPercent, startDate, expiryDate, usageLimit, minOrderAmount },
      { new: true }
    );

    if (!updated) {
      return res.status(404).send({ message: 'Voucher not found' });
    }

    res.send(updated);
  })
);

// Delete a voucher
router.delete(
  '/:id',
  admin,
  handler(async (req, res) => {
    const { id } = req.params;
    const deleted = await VoucherModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).send({ message: 'Voucher not found' });
    }
    res.send({ message: 'Voucher deleted successfully' });
  })
);

router.get('/code/:code', async (req, res) => {
  console.log('Voucher code received:', req.params.code);
  try {
    const voucher = await VoucherModel.findOne({ code: req.params.code });
    if (!voucher) return res.status(404).json({ message: 'Voucher not found' });
    res.json(voucher);
  } catch (error) {
    console.log('Error fetching voucher:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/use', async (req, res) => {
  console.log('Updating voucher usage for ID:', req.params.id);
  try {
    const voucher = await VoucherModel.findById(req.params.id);
    if (!voucher) {
      console.log('Voucher not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Voucher not found' });
    }

    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return res.status(400).json({ message: 'Usage limit reached' });
    }

    voucher.usedCount = (voucher.usedCount || 0) + 1;
    await voucher.save();
    console.log('Voucher usage updated successfully:', voucher);
    res.json(voucher);
  } catch (error) {
    console.error('Error updating voucher usage:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
