const serverless = require('serverless-http')
const app = require('express')()
const {
  countAll,
  getAll,
  countChairmanSelection,
  countTopRated,
  countRed,
  countSparkling,
  countRose
} = require('./db')

app.get('/get-categories', async (req, res) => {
  res.send([
    { id: 'all', name: 'All', count: await countAll() },
    {
      id: 'chairman',
      name: "Chairman's Selection",
      count: await countChairmanSelection()
    },
    { id: 'top_rated', name: 'Top Rated', count: await countTopRated() },
    { id: 'red', name: 'Red', count: await countRed() },
    { id: 'sparkling', name: 'Sparkling', count: await countSparkling() },
    { id: 'rose', name: 'Rosé', count: await countRose() }
  ])
})

app.get('/get-all', async (req, res) => {
  const allWines = await getAll()
  res.send(allWines)
})

exports.handler = serverless(app)
