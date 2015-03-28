var data = require("./output.json")
var length = data["daily_projections"].length
var projectionArray = []
var playerLength = 3000;
var playerArray =[]
var omnibus =[]

for (var i = 0; i < length; i++){
	projection = []
	var id = data["daily_projections"][i]['nba_player_id'];
	var salary = data["daily_projections"][i]["fanduel_salary"];
	var points = data["daily_projections"][i]["fanduel_fp"];
	var ratio = data["daily_projections"][i]["fanduel_ratio"];
	projection.push(id, salary, points, ratio);
	projectionArray.push(projection);
}

for (var i = 0; i < playerLength; i++){
	if(data["players"][i]!==undefined){
		player = [];
		var id = data["players"][i]['id'];
		var name = data["players"][i]['name'];
		// var team = data["players"][i]['team']
		var position = data["players"][i]['depth_position'];
		player.push(id, name, position);
		playerArray.push(player);
	}
}

plaLength = playerArray.length
proLength = projectionArray.length

for (var l = 0; l < proLength; l++){
	for (var k = 0; k < plaLength; k++){
		if(playerArray[l][0] === projectionArray[k][0]){
			completePlayer = []
			var name = playerArray[l][1]
			var position = playerArray[l][2]
			var salary = projectionArray[k][1]
			var points = projectionArray[k][2]
			var ratio = projectionArray[k][3]
			var ppp = parseInt(salary / points)
			var team = playerArray[l][3]
			completePlayer.push(name, position, salary, points, ratio, ppp)
			omnibus.push(completePlayer)
		}
	}
}


exports.nf = omnibus;