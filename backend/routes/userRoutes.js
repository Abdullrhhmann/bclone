const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getUserProfile, followUser } = require('../controllers/userController');

const router = express.Router();

router.get('/:username', getUserProfile);
router.post('/:userId/follow', authMiddleware, followUser);
router.delete('/:userId/follow', authMiddleware, followUser);

module.exports = router;
