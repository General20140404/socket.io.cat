
function drawGrid() {
  
    var rows = 9,
        colunms = 9;

    var gridWrapper = document.getElementById('grid');

    var rowTemplate = '<div class="row">{items}</div>';
    var itemTemplate = '<div id="grid-{row}-{column}" class="item"></div>';
    var gridHtml = '';

    for(var i = 0; i<rows; i++) {
        var temp = ''; 
        for(var j = 0; j<colunms; j++) {
            temp += itemTemplate.replace('{row}',i).replace('{column}', j);
        }
        gridHtml += rowTemplate.replace('{items}', temp);
    }

    gridWrapper.innerHTML = gridHtml;

    init(rows, colunms);
  
}

function init(rows, colunms) {
    var randomCount = 15;

    var initCatItem = document.getElementById('grid-' + Math.floor(rows/2) + '-' + Math.floor(colunms/2));
    addClass(initCatItem, 'hascat');

    for(var i = 0; i<randomCount; i++) {
        var itemId = 'grid-' + Math.floor(Math.random() * rows) + '-' + Math.floor(Math.random() * colunms);

        var itemDom = document.getElementById(itemId);
        if(!hasClass(itemDom, 'hascat')) {
            addClass(itemDom, "selected");
        }
    }
  
}

drawGrid();