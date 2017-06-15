const transform = require('camaro')
const rp = require('request-promise');

async function checkAnswer(questionId, guess) {
  const url = 'http://economistsquares.economist.com/HighTrafficAPI';
  const opts = {
    qs: {
      Action: 'GameSolveQuestion',
      QuestionID: questionId,
      Guess: guess
    }
  };
  const response = await rp.get(url, opts);
  const template = {
    correct: '//Correct'
  }
  const {correct} = transform(response, template);
  return correct === 'YES';
}

module.exports = async (req, res) => {
  const questionId = req.query.questionId;
  const guess = req.query.guess;
  const correct = await checkAnswer(questionId, guess);
  res.send(correct);
}
