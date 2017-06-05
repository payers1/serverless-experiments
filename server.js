const app  = require('express')();
const PORT = process.env.PORT || 3000;

const {
  checkDate,
  getQuestions,
  checkAnswer
} = require('./handlers');

app.get('/', (req, res) => res.send('it works'))

app.get('/check-date', checkDate);

app.get('/check-answer', checkAnswer);

app.get('/questions', getQuestions);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
