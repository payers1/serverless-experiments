const x = require('x-ray')()
const fs = require('fs')
const _ = require('lodash')
const P = require('bluebird')

const url = 'http://economistsquares.economist.com/Game/index.php'
const selector = 'script:nth-child(10)'

function scrapeForQuestions() {
  x(url, selector)((err, script) => {
    if (!err) {
      const lines = script
        .split('\n')
        .map(line => line.replace(/(\t|\\)/g, ''))
        .filter(line => line.startsWith('qvals'))
        .reduce((prev, line) => {
          const qNum = line.substr(6, 1)
          if (!prev[qNum]) {
            prev[qNum] = {
              options: []
            }
          }
          q = prev[qNum]

          const equalSign = line.indexOf('=') + 4
          const len = line.length - 3
          const value = line.substring(equalSign, len).trim()

          if (line.includes('["question"]')) {
            q.questionText = value
          } else if (line.includes('questionid')) {
            q.id = value
          } else if (line.includes('["option')) {
            q.options = [...q.options, value]
          }
          return prev
        }, {})

      const obj = _.mapKeys(lines, ({ id }) => id)
      console.log(obj)

      fs.writeFileSync(
        __dirname + '/questions.json',
        JSON.stringify(obj, null, 2)
      )
    }
  })
}

async function scrapeForQuestionsDate() {
  const data = await P.fromCallback(x(url, selector))
  const line = data
    .split('\n')
    .find(l => l.includes('questiondates'))
    .trim()

  const equalSign = line.indexOf('=') + 17
  const len = line.length - 2
  return line.substring(equalSign, len).trim()
}

module.exports = {
  scrapeForQuestions,
  scrapeForQuestionsDate
}

require('make-runnable')
