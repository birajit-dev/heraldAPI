const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema({
  page: String,
  browser: String,
  platform: String,
  modelCode: String,
  screenWidth: Number,
  screenHeight: Number,
  userAgent: String,
  viewedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PageView', pageViewSchema);
