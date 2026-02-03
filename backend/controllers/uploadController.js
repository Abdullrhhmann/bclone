const cloudinary = require('../config/cloudinary');

const uploadBufferToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });

    stream.end(buffer);
  });

const formatUploadResult = (result) => ({
  url: result.secure_url,
  filename: result.public_id,
  width: result.width,
  height: result.height,
  dominantColor: '#cccccc',
});

const uploadProjectImages = async (req, res) => {
  try {
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded',
      });
    }

    const uploads = await Promise.all(
      files.map((file) =>
        uploadBufferToCloudinary(file.buffer, {
          folder: 'al-katib/projects',
          resource_type: 'image',
        })
      )
    );

    const payload = uploads.map(formatUploadResult);

    return res.status(200).json({
      success: true,
      data: payload,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Upload failed',
    });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const result = await uploadBufferToCloudinary(file.buffer, {
      folder: 'al-katib/avatars',
      resource_type: 'image',
    });

    return res.status(200).json({
      success: true,
      data: formatUploadResult(result),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Upload failed',
    });
  }
};

const uploadCover = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const result = await uploadBufferToCloudinary(file.buffer, {
      folder: 'al-katib/covers',
      resource_type: 'image',
    });

    return res.status(200).json({
      success: true,
      data: formatUploadResult(result),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Upload failed',
    });
  }
};

module.exports = {
  uploadProjectImages,
  uploadAvatar,
  uploadCover,
};
