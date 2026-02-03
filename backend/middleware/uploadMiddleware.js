const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const uploadProjectImages = upload.array('files', 20);
const uploadAvatar = upload.single('file');
const uploadCover = upload.single('file');

module.exports = {
  uploadProjectImages,
  uploadAvatar,
  uploadCover,
};
