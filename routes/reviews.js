
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');

// POST /books/:id/reviews
router.post('/books/:id/reviews', auth, async (req, res) => {
  const exists = await Review.findOne({ book: req.params.id, user: req.user.id });
  if (exists) return res.status(400).json({ msg: 'Review already submitted' });

  const review = new Review({
    book: req.params.id,
    user: req.user.id,
    rating: req.body.rating,
    comment: req.body.comment,
  });
  await review.save();
  res.json(review);
});

// PUT /reviews/:id
router.put('/:id', auth, async (req, res) => {
  let review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ msg: 'Review not found' });
  if (review.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

  review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(review);
});

// DELETE /reviews/:id
router.delete('/:id', auth, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ msg: 'Review not found' });
  if (review.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

  await review.remove();
  res.json({ msg: 'Review removed' });
});

module.exports = router;