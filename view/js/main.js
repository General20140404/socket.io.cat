
var GRID_ROWS,
    GRID_COLUMNS,
    INIT_RANDOM_NUM,
    randomGridArr;

var catRunFlag = false,
    gridWrapper,
    catStandingElem,
    catRunableElems = [];



var socket = (function() {
    var socket = io.connect('http://localhost');

    // socket.on('connected', function() {
    //     console.log('connected');
    // });

    socket.on('open',function(data){

        GRID_ROWS = data.row;
        GRID_COLUMNS = data.column;
        INIT_RANDOM_NUM = data.randomNum;
        randomGridArr = data.randomGridArr;

        gridWrapper = drawGrid(GRID_ROWS, GRID_COLUMNS);
        catStandingElem = initGrid(GRID_ROWS, GRID_COLUMNS, randomGridArr);

        gridWrapper.addEventListener('click', function(event) {
            var target = event.target;

            if(hasClass(target, 'item')) {
                //人走
                if(!hasClass(target, 'hascat') && !hasClass(target, 'selected') && !catRunFlag) {
                    addClass(target, 'selected');
                    catRunableElems = getCatRunableSteps(catStandingElem, GRID_ROWS, GRID_COLUMNS);
                    var sendObj = {
                        runElem : target.id,
                        catRunFlag : catRunFlag
                    };
                    
                    socket.emit("run", sendObj);

                    catRunFlag = true;
                }

                //猫走
                if(hasClass(target, 'runable') && catRunFlag) {
                    removeClass(catStandingElem, 'hascat');
                    clearRunableSteps(catRunableElems);
                    catStandingElem = target;
                    addClass(target, 'hascat');

                    var sendObj = {
                        runElem : target.id,
                        catRunFlag : catRunFlag
                    };

                    socket.emit("run", sendObj);
                    
                    catRunFlag = false;
                }
            }

        });
    });

    socket.on('run', function(data){
        console.log(data)

        var elem = document.getElementById(data.runElem);
        if(data.catRunFlag && hasClass(elem, 'hascat')){
            removeClass(catStandingElem, 'hascat');
            clearRunableSteps(catRunableElems);
            catStandingElem = elem;
            addClass(elem, 'hascat');
        }

        if(!data.catRunFlag && !hasClass(elem, 'selected')){

            addClass(elem, 'selected');
            catRunableElems = getCatRunableSteps(catStandingElem, GRID_ROWS, GRID_COLUMNS);
        }
    });

    

    
})();

function drawGrid(rows, columns) {

    var gridWrapper = document.getElementById('grid');

    var rowTemplate = '<div class="row">{items}</div>';
    var itemTemplate = '<div id="grid-{row}-{column}" class="item"></div>';
    var gridHtml = '';

    for(var i = 0; i<rows; i++) {
        var temp = ''; 
        for(var j = 0; j<columns; j++) {
            temp += itemTemplate.replace('{row}',i).replace('{column}', j);
        }
        gridHtml += rowTemplate.replace('{items}', temp);
    }

    gridWrapper.innerHTML = gridHtml;

    return gridWrapper;
  
}

function initGrid(rows, columns, randomGridArr) {

    var initCatItem = document.getElementById('grid-' + Math.floor(rows/2) + '-' + Math.floor(columns/2));
    addClass(initCatItem, 'hascat');

    for(var i = 0; i<randomGridArr.length; i++) {
        var itemId = 'grid-' + randomGridArr[i][0] + '-' + randomGridArr[i][1];

        var itemElem = document.getElementById(itemId);
        if(!hasClass(itemElem, 'hascat')) {
            addClass(itemElem, "selected");
        }
    } 

    return initCatItem;
}

function clearRunableSteps(stepArr) {
    for(var i = 0, len = stepArr.length; i<len; i++) {
        removeClass(stepArr[i], 'runable');
    }
}

function getCatRunableSteps(catStandingElem, rows, columns) {
    var stepArr = [];
    var countArrForOdd = [[-1,-1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]];
    var countArrForEven = [[-1,0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];

    var catCoord = catStandingElem.getAttribute("id").match(/\d/g);
    var coordX = parseInt(catCoord[0], 10),
        coordY = parseInt(catCoord[1], 10);

    var countArr = coordX%2 ? countArrForEven : countArrForOdd;

    for(var i = 0, len = countArr.length; i<len; i++) {
        var x = coordX + countArr[i][0];
        var y = coordY + countArr[i][1];

        if(x >= 0 && y >= 0 && x < rows && y < columns) {
            var runableElem = document.getElementById('grid-' + x + '-' + y);

            if(runableElem && !hasClass(runableElem, 'selected')) {
                addClass(runableElem, 'runable');
                stepArr.push(runableElem);
            }


        }
    }

    return stepArr;
}

