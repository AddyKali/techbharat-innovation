// testimonials.js
const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/testimonialsController');
const { protect } = require('../middleware/auth');

router.get('/', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) { try { req.admin = require('jsonwebtoken').verify(token, process.env.JWT_SECRET); } catch {} }
  next();
}, getAll);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

module.exports = router;
