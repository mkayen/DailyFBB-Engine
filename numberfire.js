var cheerio = require("cheerio")
var request = require("request")

request('https://www.numberfire.com/nba/fantasy/full-fantasy-basketball-projections', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html)
    var variable = $('script')[1].children[0].data
   	var data = variable.substring(variable.indexOf("= ")+2, variable.indexOf(";"))
    console.log(data)
  }
});