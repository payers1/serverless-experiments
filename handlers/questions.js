const AWS = require('aws-sdk')
const _ = require('lodash')
const P = require('bluebird')
const { QUESTIONS_TABLE, IS_OFFLINE } = process.env
const scraper = require('../scraper')

const dbConfig =
  IS_OFFLINE === 'true'
    ? {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      }
    : undefined
const dynamoDb = new AWS.DynamoDB.DocumentClient(dbConfig)

async function saveAllQuestions(req, res) {
  const questions = await scraper.scrapeForQuestions()
  return P.map(_.keys(questions), questionId => {
    item = questions[questionId]
    const params = {
      TableName: QUESTIONS_TABLE,
      Item: {
        questionId,
        questionText: item.questionText,
        options: item.options
      }
    }
    return dynamoDb.put(params).promise()
  }).then(() => res.send(200))
}

function getAllQuestions(req, res) {
  return dynamoDb
    .scan({ TableName: QUESTIONS_TABLE })
    .promise()
    .then(questions => res.json(questions))
}

function getQuestion(req, res) {
  const params = {
    TableName: QUESTIONS_TABLE,
    Key: {
      questionId: req.params.questionId
    }
  }
  return dynamoDb
    .get(params)
    .promise()
    .then(result => {
      if (result.Item) {
        const { questionId, questionText, options } = result.Item
        res.json({ questionId, questionText, options })
      } else {
        res.status(404).json({ error: 'Question not found' })
      }
    })
    .catch(err => res.status(400).json({ error: 'Could not get question' }))
}

module.exports = {
  getQuestion,
  getAllQuestions,
  saveAllQuestions
}
