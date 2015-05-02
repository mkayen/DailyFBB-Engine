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

// COUNT TEAMS IN LINEUP

function countTeams(arr) {
    var a = [], b = [], prev;
    
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    
    return [a, b];
}

function throwAwayTeamsWithMultPlayers(array){

	for (var i = 0; i < array.length; i++){
		if(array[i] > 2){
			holdingCell.push(array[i])
		}
	}

}

// // POSITION FUNCTION --------------------------------------
// // BREAKS DOWN OMNIBUS ARRAY BY POSITION, CREATING POSITIONAL ARRAYS
// // INCLUDING: NAME, POSITION, SALARY, POINTS, RATIO

var omnibusLength = omnibus.length

function positionFunc(pos, array, points){
	for (var i = 0; i < omnibusLength; i++){
		if(omnibus[i][1] == pos && omnibus[i][7] > points){
			array.push(omnibus[i]);
		}
	}
}

positionFunc('PG', allPG, 25)
positionFunc('SG', allSG, 25)
positionFunc('SF', allSF, 25)
positionFunc('PF', allPF, 25)
positionFunc('C', allC, 25)

// console.log(omnibus)


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
			var pos1Team = origArray[j][9]
			var pos2Team = origArray[i][9]
			var pairArray = []
			pairArray.push(pos1name, pos2name, price, points, pos1Team, pos2Team)
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
			var pos1Team = pairArray1[j][4]
			var pos2Team = pairArray1[j][5]
			var pos3Team = pairArray2[i][4]
			var pos4Team = pairArray2[i][5]
			posQuad = []
			posQuad.push(pos1name, pos2name, pos3name, pos4name, price, points, pos1Team, pos2Team, pos3Team, pos4Team);
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
	for (var i; i < length2; i++){
		var pos1name = pgsgQuad[j][0]
		var pos2name = pgsgQuad[j][1]
		var pos3name = pgsgQuad[j][2]
		var pos4name = pgsgQuad[j][3]
		var pos5name = sfpfQuad[i][0]
		var pos6name = sfpfQuad[i][1]
		var pos7name = sfpfQuad[i][2]
		var pos8name = sfpfQuad[i][3]
		var pos1Team = pgsgQuad[j][6]
		var pos2Team = pgsgQuad[j][7]
		var pos3Team = pgsgQuad[j][8]
		var pos4Team = pgsgQuad[j][9]
		var pos5Team = sfpfQuad[i][6]
		var pos6Team = sfpfQuad[i][7]
		var pos7Team = sfpfQuad[i][8]
		var pos8Team = sfpfQuad[i][9]
		for (var h = 0; h < allC.length; h++){
			var pos9name = allC[h][0]
			var price = pgsgQuad[j][4] + sfpfQuad[i][4] + allC[h][2]
			var points = pgsgQuad[j][5] + sfpfQuad[i][5] + allC[h][3]
			var pos9Team = allC[h][9]
			posEight = []
			teams = []
			posEight.push(pos1name, pos2name, pos3name, pos4name, pos5name, pos6name, pos7name, pos8name, pos9name, price, points)
			teams.push(pos1Team, pos2Team, pos3Team, pos4Team, pos5Team, pos6Team, pos7Team, pos8Team, pos9Team)
			var holdingCell = []
			countTeams(teams)
			throwAwayTeamsWithMultPlayers(countTeams(teams)[1])
			// console.log(countTeams(teams)[1])
			if(points > 250 && price <= 60000 && holdingCell.length === 0){
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

