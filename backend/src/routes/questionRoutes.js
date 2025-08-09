JavaScript

const express = require('express');
const { getQuestions, createQuestion, updateQuestion, deleteQuestion, protect } = require('../controllers/questionController');
const router = express.Router();

// All question routes are protected
router.use(protect);

router.route('/')
  .get(getQuestions)
  .post(createQuestion);

router.route('/:id')
  .put(updateQuestion)
  .delete(deleteQuestion);

module.exports = router;
