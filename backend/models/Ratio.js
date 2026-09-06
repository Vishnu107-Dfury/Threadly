const mongoose = require('mongoose');

const ratioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    default: 'Default Ratio Rule'
  },
  ratioLevel: {
    type: String,
    default: 'Brick'
  },
  groupKey: {
    type: String,
    default: 'Brick'
  },
  groupValues: {
    type: [String],
    default: []
  },
  gradeRatios: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Exact assignment format representation
  ratioData: [{
    title: String,
    attribute_data: [{
      key: String,
      value: String
    }],
    size: [{
      size: String,
      value: Number
    }],
    grade: String
  }]
}, {
  timestamps: true,
  strict: false
});

const Ratio = mongoose.model('Ratio', ratioSchema);

module.exports = Ratio;
