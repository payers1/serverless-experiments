const scraper = require('../scraper');

module.exports = (req, res) => {
  return scraper.scrapeForQuestionsDate()
    .then((a) => {
      res.send(a);
    });
}
