const express = require('express');
const router = express.Router();
const {
  getAllSections, createSection, updateSection,
  deleteSection, reorderSections,
} = require('../controllers/sectionsController');
const { protect } = require('../middleware/auth');

// Public — only visible sections returned unless admin token is present
router.get('/', (req, res, next) => {
  // Optionally decode token for admin to see all sections
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = decoded;
    } catch {}
  }
  next();
}, getAllSections);

// Protected write operations
router.post('/', protect, createSection);
router.put('/reorder', protect, reorderSections);
router.put('/:id', protect, updateSection);
router.delete('/:id', protect, deleteSection);

module.exports = router;
