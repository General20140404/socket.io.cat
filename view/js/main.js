var catRunFlag = false;


function drawGrid() {
  
    var rows = 9,
        columns = 9;

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


    var catStandingElem = initGrid(rows, columns);
    var catRunableElems = [];

    gridWrapper.addEventListener('click', function(event) {
        var target = event.target;


        if(hasClass(target, 'item')) {
            //人走
            if(!hasClass(target, 'hascat') && !hasClass(target, 'selected') && !catRunFlag) {
                addClass(target, 'selected');
                catRunableElems = getCatRunableSteps(catStandingElem, rows, columns);
                catRunFlag = true;

            }

            //猫走
            if(hasClass(target, 'runable') && catRunFlag) {
                removeClass(catStandingElem, 'hascat');
                clearRunableSteps(catRunableElems);
                catStandingElem = target;
                addClass(target, 'hascat');

                catRunFlag = false;
            }
        }

    });

    // gridWrapper.addEventListener('mouseover', function(event) {
    //     var target = event.target;

    //     if(hasClass(target, 'hascat')){
            
    //     }

    // });

    
  
}

function initGrid(rows, columns) {
    var ranElemCount = 15;

    var initCatItem = document.getElementById('grid-' + Math.floor(rows/2) + '-' + Math.floor(columns/2));
    addClass(initCatItem, 'hascat');

    for(var i = 0; i<ranElemCount; i++) {
        var itemId = 'grid-' + Math.floor(Math.random() * rows) + '-' + Math.floor(Math.random() * columns);

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
    var countArr = [[-1,-1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]];

    var catCoord = catStandingElem.getAttribute("id").match(/\d/g);
    var coordX = parseInt(catCoord[0], 10),
        coordY = x%2 ? parseInt(catCoord[1], 10) + 1 : parseInt(catCoord[1], 10);

        console.log(coordX + "," + coordY)

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

drawGrid();