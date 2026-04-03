const express = require('express');
const router = express.Router();
const { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/coursesController');
const { protect } = require('../middleware/auth');

router.get('/', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) { try { req.admin = require('jsonwebtoken').verify(token, process.env.JWT_SECRET); } catch {} }
  next();
}, getAllCourses);

router.get('/:id', getCourse);
router.post('/', protect, createCourse);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);

module.exports = router;
