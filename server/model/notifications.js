const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  subscription: Object,
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
