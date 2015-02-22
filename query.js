// GLOBAL VARIABLES & ARRAY ------------------------------

var data = require("./output.json")
var length = data["daily_projections"].length
var omnibus = require("./analysis.js")
var allPG = []
var allSG = []
var allSF = []
var allPF = []
var allC = []
var pgAllPairs = []
var sgAllPairs = []
var sfAllPairs = []
var pfAllPairs = []
var pgsgQuad = []
var sfpfQuad = []
var lineups = []

// // POSITION FUNCTION --------------------------------------
// // BREAKS DOWN OMNIBUS ARRAY BY POSITION, CREATING POSITIONAL ARRAYS
// // INCLUDING: NAME, POSITION, SALARY, POINTS, RATIO

var omnibusLength = omnibus.length

function positionFunc(pos, array){
	for (var i = 0; i < omnibusLength; i++){
		if(omnibus[i][1] == pos && omnibus[i][7] > 25){
			array.push(omnibus[i]);
		}
	}
}

positionFunc('PG', allPG)
positionFunc('SG', allSG)
positionFunc('SF', allSF)
positionFunc('PF', allPF)
positionFunc('C', allC)

// // POSITION PAIRS -----------------------------------------
// // PAIRS UP PLAYERS AT PARTICULAR POSITION TO ACCOUNT FOR
// // TWO STARTERS AT EACH POSITION OTHER THAN CENTER

function positionPairs(origArray, newArray){
	var length = origArray.length
	for (var j = 0; j < length; j++){
		var i = j + 1;
		for (var i; i < length; i++){
			var pos1name = origArray[j][0]
			var pos2name = origArray[i][0]
			var price = origArray[j][2] + origArray[i][2]
			var points = origArray[j][7] + origArray[i][7]
			var pairArray = []
			pairArray.push(pos1name, pos2name, price, points)
			if(i!=j){
				newArray.push(pairArray)
			}
		}
	}
}

positionPairs(allPG, pgAllPairs)
positionPairs(allSG, sgAllPairs)
positionPairs(allSF, sfAllPairs)
positionPairs(allPF, pfAllPairs)

// // POSITION QUADS ------------------------------------------
// // QUADS UP PLAYERS AT TWO POSITIONS.
// // FILTERING IS CONTROLLED BY FINAL IF STATEMENT, WHERE QUAD
// // ARE PUSHED TO ARRAY IF IT MEETS STANDARDS DEFINED.

function positionQuads(pairArray1, pairArray2, newArray){
	var length1 = pairArray1.length
	var length2 = pairArray2.length
	for (var j = 0; j < length1; j++){
		var i = j + 1;
		for (var i; i< length2; i++){
			var pos1name = pairArray1[j][0]
			var pos2name = pairArray1[j][1]
			var pos3name = pairArray2[i][0]
			var pos4name = pairArray2[i][1]
			var price = pairArray1[j][2] + pairArray2[i][2]
			var points = pairArray1[j][3] + pairArray2[i][3]
			posQuad = []
			posQuad.push(pos1name, pos2name, pos3name, pos4name, price, points);
			if(i!=j){
				newArray.push(posQuad);		
			}
		}
	}
}

positionQuads(pgAllPairs, sgAllPairs, pgsgQuad)
positionQuads(sfAllPairs, pfAllPairs, sfpfQuad)


console.log(allPG.length, allSG.length, allSF.length, allPF.length, allC.length)
console.log(pgAllPairs.length, sgAllPairs.length, sfAllPairs.length, pfAllPairs.length)
console.log(pgsgQuad.length, sfpfQuad.length)

// // Lineups -----------------------------------------
// // GENERATES SET LINEUPS.

var length1 = pgsgQuad.length;
var length2 = sfpfQuad.length;

for (var j = 0; j < length1; j++){
	var i = j + 1;
	for (var i = 0; i < length2; i++){
		var pos1name = pgsgQuad[j][0]
		var pos2name = pgsgQuad[j][1]
		var pos3name = pgsgQuad[j][2]
		var pos4name = pgsgQuad[j][3]
		var pos5name = sfpfQuad[i][0]
		var pos6name = sfpfQuad[i][1]
		var pos7name = sfpfQuad[i][2]
		var pos8name = sfpfQuad[i][3]
		for (var h = 0; h < allC.length; h++){
			var pos9name = allC[h][0]
			var price = pgsgQuad[j][4] + sfpfQuad[i][4] + allC[h][2]
			var points = pgsgQuad[j][5] + sfpfQuad[i][5] + allC[h][3]
			posEight = []
			posEight.push(pos1name, pos2name, pos3name, pos4name, pos5name, pos6name, pos7name, pos8name, pos9name, price, points)
			if(points > 270 && price <= 60000){
				lineups.push(posEight)
			}
		}
	}
}

var sortedOut = lineups
sortedOut.sort(function(a,b){
	return b[10] - a[10]
})

console.log(lineups.length)
console.log(sortedOut)

