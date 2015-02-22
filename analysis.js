var swishData = require('./querySwish.js')
var nfData = require('./queryNF.js')

swishDataLength = swishData.swish.length;
nfDataLength = nfData.nf.length;

mergedArray = [];

for (var i = 0; i < swishDataLength; i++){
	for (var j = 0; j < nfDataLength; j++){
		if(swishData.swish[i][0] == nfData.nf[j][0]){
			var player = [];
			var name = swishData.swish[i][0]
			var pos = swishData.swish[i][1]
			var sal = swishData.swish[i][2]
			var swish_points = swishData.swish[i][3]
			var swish_ppp = parseInt(sal / swish_points)
			var nf_points = nfData.nf[j][3]
			var nf_ppp = parseInt(sal / nf_points)
			// var diff = Math.abs(nf_points - swish_points)
			var avg_points = (swish_points + nf_points) / 2
			var avg_ppp = parseInt((swish_ppp + nf_ppp) / 2)
			if(swish_points !== 0){
				player.push(name, pos, sal, swish_points, swish_ppp, nf_points, nf_ppp, avg_points, avg_ppp)
				mergedArray.push(player)
			}
		}
	}
}

module.exports = mergedArray