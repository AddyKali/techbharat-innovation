const express = require('express');
const router = express.Router();
const { create, getAll, updateStatus } = require('../controllers/leadsController');
const { protect } = require('../middleware/auth');

router.post('/', create);
router.get('/', protect, getAll);
router.put('/:id/status', protect, updateStatus);

module.exports = router;
