const cloudinary = require("cloudinary").v2;

const cloudinarycon = require('config').get('cloudinaryConfig');


cloudinary.config({
  cloud_name: cloudinarycon.cloud_name,
  api_key: cloudinarycon.api_key,
  api_secret: cloudinarycon.api_secret,
});

module.exports = cloudinary;