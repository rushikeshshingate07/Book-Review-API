const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/book');
const Review = require('../models/Review');

// POST /books  (auth)
router.post('/', auth, async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

// GET /books
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, author, genre } = req.query;
  const filter = {};
  if (author) filter.author = new RegExp(author, 'i');
  if (genre) filter.genre = new RegExp(genre, 'i');

  const books = await Book.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  res.json(books);
});

// GET /books/:id
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ msg: 'Book not found' });

  const avgRating = await Review.aggregate([
    { $match: { book: book._id } },
    { $group: { _id: null, avg: { $avg: '$rating' } } }
  ]);

  const { page = 1, limit = 5 } = req.query;
  const reviews = await Review.find({ book: book._id })
    .populate('user', 'name')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({ book, averageRating: avgRating[0]?.avg || 0, reviews });
});

module.exports = router;