JavaScript

const Question = require('../models/Question');

// Middleware to protect routes
exports.protect = (req, res, next) => {
  // Implement JWT token verification logic here
  // For simplicity, we'll assume a user is authenticated for this example
  req.user = { id: 'sampleUserId' }; // Replace with actual user ID from token
  next();
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ createdBy: req.user.id });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  const { questionText, options, correctAnswer, category, explanation } = req.body;
  try {
    const newQuestion = new Question({
      questionText,
      options,
      correctAnswer,
      category,
      explanation,
      createdBy: req.user.id
    });
    const createdQuestion = await newQuestion.save();
    res.status(201).json(createdQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    // Check if user is the creator
    if (question.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this question' });
    }
    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    // Check if user is the creator
    if (question.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }
    await Question.findByIdAndDelete(id);
    res.json({ message: 'Question removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
