var swishData = require("./outputSwish.json")
var length = swishData.length

var allPlayers = [];

	for (var i = 0; i < length; i++){
		var playerArray = []
		var name = swishData[i]['player_name']
		var pos = swishData[i]['fd_pos']
		var salary = parseInt(swishData[i]['fd_salary'])
		var points = parseFloat(swishData[i]['proj_fantasy_pts_fd'])
		var ratio = parseInt(salary / points)
		var team = swishData[i]['team_abr']
		playerArray.push(name, pos, salary, points, ratio, team)
		allPlayers.push(playerArray)
		}	

exports.swish = allPlayers;