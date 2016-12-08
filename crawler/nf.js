var rp          = require("request-promise");
var cheerio     = require("cheerio");

/*

    The next step here is to scale the script so it works with any game.
    Logic:
        game obj - Defines Rules of Game
        
    Step 1 - Build out Scraping Function that takes
             URL as input

*/
var urlObject = {
    basketballUrl:  'https://www.numberfire.com/nba/fantasy/full-fantasy-basketball-projections',
    baseballUrl: 'https://www.numberfire.com/mlb/daily-fantasy/daily-baseball-projections'
};

var playersArray        = [];

var baseball = rp(urlObject.baseballUrl)
    .then(screenScrape)
    .then(function(){
        console.log('Player Data: ')
        console.log(playersArray)
    })

console.log(baseball)

// var playersArray        = [];
var projectionsArray    = [];
var salariesArray       = [];

var pointGuards = {
    abbrev: 'PG',
    arr: [],
    reduced: [],
    pairs: [],
}

var shootingGuards = {
    abbrev: 'SG',
    arr: [],
    reduced: [],
    pairs: [],
}

var smallForwards = {
    abbrev: 'SF',
    arr: [],
    reduced: [],
    pairs: [],
}

var powerForwards = {
    abbrev: 'PF',
    arr: [],
    reduced: [],
    pairs: [],
}

var centers = {
    abbrev: 'C',
    arr: [],
    reduced: [],
    pairs: [],
}

var pointGuardsShootingGuards  = [];
var smallForwardsPowerForwards = [];
var allLineups = [];
var eight = [];

var basketballPositions = 
    [pointGuards, shootingGuards, smallForwards, powerForwards, centers];

var screenScrape = function(data){
	var $ = cheerio.load(data);
	var names = []
	var pos   = []
	var cost  = []
	var proj  = []
	$('span.player-info a.full').each(function(){
		names.push($(this).text().trim())
	})
	$('span.player-info--position').each(function(){
		pos.push($(this).text())
	})
	$('.cost').each(function(){
		cost.push($(this).text().trim())
	})
	$('.fp').each(function(){
		proj.push($(this).text().trim())
	})
	for(i=0; i<names.length; i++){
		playerObj = {};
		playerObj.id = i + 1;
		playerObj.playerName = names[i];
		playerObj.position 	 = pos[i];
		playerObj.projection = proj[i];
		playerObj.salary     = cost[i].substring(1,cost[i].length);
		playersArray.push(playerObj);
	}
	return playersArray
}

var groupByPosition = function(data, pos){
    var count = data.length;
    for(var i=0; i < count; i++){
        if(data[i].position === pos.abbrev & data[i].projection > 5){
           var player = [];
           player.push(data[i].playerName)
           player.push(data[i].position)
           player.push(parseFloat(data[i].projection))
           player.push(parseFloat(data[i].salary.replace(/\,/g,"")))
           pos.arr.push(player)
        }
    }
    pos.arr.sort(function(a, b){
        return b[2] - a[2]
    })
};

var mapPlayerToEachPosition = function(data){
    basketballPositions.map(function(pos){
        groupByPosition(playersArray, pos)
    })
}

var check = function(count,pos){
    for (var i=0; i<count-1; i++){
        var index = 0
        if(pos.arr[i][3] <= pos.arr[i+1][3] & pos.arr[i][3]!=0){
            index++
            pos.arr[i+1][2] = 0
            pos.arr[i+1][3] = 0
            pos.arr.sort(function(a, b){
                return b[2] - a[2]
            })
        }
    if(index!=0){
        check(count,pos)
        }
    }
}

var removeImpossibleSelections = function(pos){
    var count = pos.arr.length
    check(count, pos);
    for (var i=0; i<count; i++){
        if(pos.arr[i][3]!=0){
            pos.reduced.push(pos.arr[i])
        }
    }
    pos.arr = [];
}

var removeImpossibleSelectionsFromEachPosition = function(pos){
    basketballPositions.map(function(pos){
        removeImpossibleSelections(pos)
    })
};

var positionPairs = function(pos){
    var count = pos.reduced.length
    for(var j=0; j<count; j++ ){
        var i = j + 1;
        for(var i; i<count; i++){
            var pairArray = []
            var namePlayer1 = pos.reduced[j][0]
            var namePlayer2 = pos.reduced[i][0]
            var posPlayer1  = pos.reduced[j][1]
            var posPlayer2  = pos.reduced[i][1]
            var points      = parseFloat(pos.reduced[j][2] + pos.reduced[i][2])
            var price       = pos.reduced[j][3] + pos.reduced[i][3]
            if(pos.pairs.length < 10){
                pairArray.push(namePlayer1, namePlayer2, posPlayer1, posPlayer2, price, points.toFixed(2))
                pos.pairs.push(pairArray)  
            }
        }
    }
    pos.pairs.sort(function(a, b){
        return b[4] - a[4]
    })
}

var pairMap = function(){
    basketballPositions.map(function(pos){
        positionPairs(pos)
    })
}

var promiseChain = rp(urlObject.basketballUrl)
    .then(screenScrape)
    .then(mapPlayerToEachPosition)
    .then(removeImpossibleSelectionsFromEachPosition)
    .then(pairMap)
    .then(function(){
        console.log('Script has started to run. Please wait a few minutes for lineup to generate.')
        console.log(
            pointGuards.reduced.length + ' | ' +
            shootingGuards.reduced.length + ' | ' +
            smallForwards.reduced.length + ' | ' +
            powerForwards.reduced.length + ' | ' +
            centers.reduced.length
        );
        console.log(
            pointGuards.pairs.length + ' | ' +
            shootingGuards.pairs.length + ' | ' +
            smallForwards.pairs.length + ' | ' +
            powerForwards.pairs.length + ' | ' +
            centers.reduced.length
        );
        console.log(
            pointGuards.pairs.length *
            shootingGuards.pairs.length *
            smallForwards.pairs.length *
            powerForwards.pairs.length *
            centers.reduced.length
        );
        // console.log(centers.reduced)
    })
    
    
var positionalQuads = function(pos1, pos2, arr){
    var pos1Count = pos1.pairs.length;
    var pos2Count = pos2.pairs.length;
    for(var i=0; i < pos1Count; i++){
        for(var j=0; j < pos2Count; j++){
            var quad = [];
            var player1name = pos1.pairs[i][0];
            var player2name = pos1.pairs[i][1];
            var player3name = pos2.pairs[j][0];
            var player4name = pos2.pairs[j][1];
            var price       = pos1.pairs[i][4] + pos2.pairs[j][4]
            var points      = parseFloat(pos1.pairs[i][5]) + parseFloat(pos2.pairs[j][5])
            quad.push(player1name, player2name, player3name, player4name, price, points)
            arr.push(quad)
        }
    }
    arr.sort(function(a,b){
        return b[4] - a[4]
    })
}   

var buildPositionalQuads = function(){
    positionalQuads(pointGuards, shootingGuards, pointGuardsShootingGuards);
    positionalQuads(smallForwards, powerForwards, smallForwardsPowerForwards)
}


var secondPromiseChain = promiseChain
    .then(buildPositionalQuads)
    .then(function(){
        console.log(pointGuardsShootingGuards.length)
    })

var lineupGenerator = function(arr1, arr2, arr3){
    var arr1Count = arr1.length;
    var arr2Count = arr2.length;
    for(var i=0; i < arr1Count; i++){
        for(var j=0; j < arr2Count; j++){
            var lineup = [];
            var player1name = arr1[i][0]
            var player2name = arr1[i][1]
            var player3name = arr1[i][2]
            var player4name = arr1[i][3]
            var player5name = arr2[j][0]
            var player6name = arr2[j][1]
            var player7name = arr2[j][2]
            var player8name = arr2[j][3]
            var price = arr1[i][4] + arr2[j][4]
            var points = arr1[i][5] + arr2[j][5]
            if(price <= 56500){
                lineup.push(player1name, player2name, player3name, player4name, player5name, player6name, player7name, player8name, price, points)
                arr3.push(lineup)
            }
        }
    }
}

var buildLineups = function(){
    lineupGenerator(pointGuardsShootingGuards, smallForwardsPowerForwards, eight)
}

var thirdPromiseChain = secondPromiseChain
                            .then(buildLineups)
                            // .then(function(){
                            //     console.log(eight.length)
                            //     console.log(eight[0])
                            // })

var finalLineupGenerator = function(arr1, arr2, arr3){
    var arr1Count = arr1.length;
    var arr2Count = arr2.length;
    for(var i=0; i < arr1Count; i++){
        for(var j=0; j < arr2Count; j++){
            var lineup = [];
            var player1name = arr1[i][0]
            var player2name = arr1[i][1]
            var player3name = arr1[i][2]
            var player4name = arr1[i][3]
            var player5name = arr1[i][4]
            var player6name = arr1[i][5]
            var player7name = arr1[i][6]
            var player8name = arr1[i][7]
            var player9name = arr2[j][0]
            var price = arr1[i][8] + arr2[j][3] 
            var points = arr1[i][9] + arr2[j][2]
            if(price <= 60000){
                lineup.push(player1name, player2name, player3name, player4name, player5name, player6name, player7name, player8name, player9name, price, points)
                arr3.push(lineup)
            }
        }
    arr3.sort(function(a, b){
        return b[10]-a[10]
    })
        
    }
}

var buildStartingLineup = function(){
    finalLineupGenerator(eight, centers.reduced, allLineups)
}

thirdPromiseChain
    .then(buildStartingLineup)
    .then(function(){
        console.log(allLineups.length)
        console.log(allLineups[0])
    })