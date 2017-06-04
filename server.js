const app  = require('express')();
const PORT = process.env.PORT || 3000;
const _ = require('lodash');
const getRandomQuestion = () => {
  const questions = require('./questions.json');
  const questionKeys = _.keys(questions);
  const randomNum = _.random(0, questionKeys.length - 1);
  const randomQuestionKey = questionKeys[randomNum];
  return questions[randomQuestionKey];
}

app.get('/', (req, res) => {
  res.send('it works');
})

app.get('/random-question', (req, res) => {
  res.send(getRandomQuestion());
})
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
