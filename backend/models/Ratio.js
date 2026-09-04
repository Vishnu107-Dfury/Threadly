const mongoose = require('mongoose');

const ratioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  ratioLevel: {
    type: [String],
    required: true
  },
  groupKey: {
    type: String,
    required: true
  },
  groupValues: {
    type: [String],
    default: []
  },
  gradeRatios: {
    type: mongoose.Schema.Types.Mixed,
    required: true
    /* 
    Example structure:
    {
      "A": { "4-5Y": 1, "5-6Y": 2 },
      "B": { "4-5Y": 2, "5-6Y": 2 }
    }
    */
  }
}, {
  timestamps: true
});

const Ratio = mongoose.model('Ratio', ratioSchema);

module.exports = Ratio;
