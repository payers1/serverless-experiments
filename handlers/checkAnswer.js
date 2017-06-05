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
  const { XML } = await parseXML(response);
  return XML.Correct.includes('YES');
}

module.exports = (req, res) => {
  const questionId = req.body.questionId;
  const guess = req.body.guess;
  const correct = checkAnswer(questionId, guess);
}
