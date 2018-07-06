const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const app = require('express')()

app.use(bodyParser.json({ strict: false }))
app.get('/', (req, res) => res.send('it works'))

module.exports.handler = serverless(app)
