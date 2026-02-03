const express = require('express');
const {
  uploadProjectImages,
  uploadAvatar,
  uploadCover,
} = require('../controllers/uploadController');
const {
  uploadProjectImages: uploadProjectImagesMiddleware,
  uploadAvatar: uploadAvatarMiddleware,
  uploadCover: uploadCoverMiddleware,
} = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/project', uploadProjectImagesMiddleware, uploadProjectImages);
router.post('/avatar', uploadAvatarMiddleware, uploadAvatar);
router.post('/cover', uploadCoverMiddleware, uploadCover);

module.exports = router;
