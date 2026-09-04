const Ratio = require('../models/Ratio');

// @desc    Get all ratios for user
// @route   GET /api/ratios
// @access  Private
const getRatios = async (req, res) => {
  try {
    const ratios = await Ratio.find({ userId: req.user.firebaseUid }).sort({ createdAt: -1 });
    res.json(ratios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ratio by id
// @route   GET /api/ratios/:id
// @access  Private
const getRatioById = async (req, res) => {
  try {
    const ratio = await Ratio.findOne({ _id: req.params.id, userId: req.user.firebaseUid });
    if (ratio) {
      res.json(ratio);
    } else {
      res.status(404).json({ message: 'Ratio configuration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new ratio
// @route   POST /api/ratios
// @access  Private
const createRatio = async (req, res) => {
  try {
    const { name, ratioLevel, groupKey, groupValues, gradeRatios } = req.body;
    
    const ratio = await Ratio.create({
      userId: req.user.firebaseUid,
      name,
      ratioLevel,
      groupKey,
      groupValues,
      gradeRatios
    });

    res.status(201).json(ratio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ratio
// @route   PUT /api/ratios/:id
// @access  Private
const updateRatio = async (req, res) => {
  try {
    const { name, ratioLevel, groupKey, groupValues, gradeRatios } = req.body;
    
    const ratio = await Ratio.findOne({ _id: req.params.id, userId: req.user.firebaseUid });
    
    if (ratio) {
      ratio.name = name || ratio.name;
      ratio.ratioLevel = ratioLevel || ratio.ratioLevel;
      ratio.groupKey = groupKey || ratio.groupKey;
      ratio.groupValues = groupValues || ratio.groupValues;
      ratio.gradeRatios = gradeRatios || ratio.gradeRatios;
      
      const updatedRatio = await ratio.save();
      res.json(updatedRatio);
    } else {
      res.status(404).json({ message: 'Ratio configuration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete ratio
// @route   DELETE /api/ratios/:id
// @access  Private
const deleteRatio = async (req, res) => {
  try {
    const ratio = await Ratio.findOne({ _id: req.params.id, userId: req.user.firebaseUid });
    
    if (ratio) {
      await ratio.deleteOne();
      res.json({ message: 'Ratio configuration removed' });
    } else {
      res.status(404).json({ message: 'Ratio configuration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRatios,
  getRatioById,
  createRatio,
  updateRatio,
  deleteRatio
};
