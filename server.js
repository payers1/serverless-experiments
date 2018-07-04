const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const app = require('express')()
const questions = require('./handlers/questions')

app.use(bodyParser.json({ strict: false }))
app.get('/', (req, res) => res.send('it works'))
app.get('/questions', questions.getAllQuestions)
app.get('/questions/:questionId', questions.getQuestion)
app.post('/questions', questions.saveAllQuestions)

module.exports.handler = serverless(app)
