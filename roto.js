var cheerio = require("cheerio")
var request = require("request")

request('http://www.rotowire.com/daily/nba/value-report.htm', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html)
    var variable = $('table')[0].children[3].children[2].parent.children[1]
    console.log($)
  }
});