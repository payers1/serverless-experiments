const scraper = require('../scraper');
const moment = require('moment');

module.exports = (req, res) => {
  return scraper.scrapeForQuestionsDate()
    .then((a) => {
      const d = moment(a, "MMMM DD YYYY");
      const diff = moment().diff(d, 'days');
      if (diff > 5) {
        scraper.scrapeForQuestions();
      }
      res.send(a);
    });
}
