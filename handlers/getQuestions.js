module.exports = (req, res) => {
  const questions = require('../questions.json');
  res.send(questions);
}
