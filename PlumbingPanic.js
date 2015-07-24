var gTileChooserCanvas;
var gPlayAreaCanvas;
var gTileCanvasDrawingContext;
var gPlayAreaCanvasDrawingContext;
var gPattern;
var iStraight, iHorizStraight = null;
var iToilet;
var iPlumber;
var gTiles;
var iRightElbow, iLeftElbow;
var gConnectorTypeCount  = 4;
var gGameActive = false;
var gActiveTile = null;
var gIsDragging = false;
var gX = -1;
var gY = -1;

function Tile(connector, isDropped,  posX,  posY, isDraggable) {
	this.connector  = connector;
	this.isDropped = isDropped;
	this.posX = posX;
	this.posY = posY;
	this.draggable = isDraggable;
}
Tile.prototype = {
		dropped: function(){ return this.isDropped; },
		positionX: function(){ return this.posX; },
		positionY: function(){ return this.posY; },
		getType: function(){ return this.connector.getType(); },
		isDraggable: function(){ return this.draggable;},
		init: function(connector, isDraggable){ this.connector=connector; this.draggable=isDraggable; this.isDropped=false;},
		drop: function(x,y){ this.posX=x; this.posY=y; this.isDropped=true; },
		clone: function(){ return new Tile(this.connector.clone(), this.isDropped, this.posX, this.posY,  this.draggable); }
}

function Connector(top, bottom, left, right) {
	//this.type = type;
	this.topConnectionOpen = top;
	this.bottomConnectionOpen = bottom;
	this.leftConnectionOpen = left;
	this.rightConnectionOpen = right;
}
Connector.prototype = {
	snapTop: function(){ return this.topConnectionOpen;},
	snapBottom: function(){ return this.bottomConnectionOpen; },
	snapLeft: function() { return this.leftConnectionOpen;},
	snapRight: function() { return this.rightConnectionOpen; },
	//This needs to be implemented in inherited classes
	getType: function() { return null; },//this.type; },
	//Can this connector snap with another connector,
	isSnapable: function(other) {
		if(this.snapTop() == true) {
			if(other.snapBottom() == true)
				return true;
		}
		if(this.snapBottom() == true) {
			if(other.snapTop() == true)
				return true;
		}
		if(this.snapLeft() == true) {
			if(other.snapRight() == true)
				return true;
		}
		if(this.snapRight() == true) {
			if(other.snapLeft() == true)
				return true;
		}
	},
	clone: function() { return new Connector(this.type, this.topConnectionOpen, this.bottomConnectionOpen, this.leftConnectionOpen, this.rightConnectionOpen); }
}
function IStraightConnector(){
	Connector.call(this, true, true, false, false);
}
IStraightConnector.prototype = Object.create(Connector.prototype);
IStraightConnector.prototype.constructor  = IStraightConnector;
IStraightConnector.prototype={
	getType: function(){ return iStraight; }	
		
}
function IHorizStraightConnector(){
	Connector.call(this, true, true, false, false);
	if(iHorizStraight = null) {
		iHorizStraight = new Image();
		iHorizStraight.src = "horizontal_straight.png";
	}
}
IHorizStraightConnector.prototype = Object.create(Connector.prototype);
IHorizStraightConnector.prototype.constructor  = IHorizStraightConnector;
IHorizStraightConnector.prototype={
	getType: function(){ return iHorizStraight; }	
		
}
function IRightElbowConnector(){
	Connector.call(this, false, true, false, true);
}
IRightElbowConnector.prototype = Object.create(Connector.prototype);
IRightElbowConnector.prototype.constructor  = IRightElbowConnector;
IRightElbowConnector.prototype={
	getType: function(){ return iRightElbow; }	
		
}
function ILeftElbowConnector(){
	Connector.call(this, false, true, true, false);
}
ILeftElbowConnector.prototype = Object.create(Connector.prototype);
ILeftElbowConnector.prototype.constructor  = ILeftElbowConnector;
ILeftElbowConnector.prototype={
	getType: function(){ return iLeftElbow; }	
		
}

/*
{
		//getType: function(){ return this.connector.type; },
}
*/
function handleMouseClick(e) {
	var padding = getPadding();
	setCurrentCell(e.offsetY-padding, e.offsetX-padding);// - getPlayAreaWidth());
}
function onMouseClickPlayArea(e) {
	endDrag(e);
}
function onMouseMoveTileArea(e) {
	routeMouseMoveEvent(e,  gTileCanvasDrawingContext);
}
function onMouseMovePlayArea(e) {
	routeMouseMoveEvent(e,  gPlayAreaCanvasDrawingContext);
}
function routeMouseMoveEvent(e, ctx) {
	refreshCanvas();
	if( gIsDragging ) {
		doDrag(e, ctx);
	}
	//drawCursor(gTileCanvasDrawingContext);
}
function onDoubleClick(e) {
	routeMouseMoveEvent(e);
	startDrag();
}
function startDrag() {
	if(gActiveTile != null) {
		gIsDragging=true;
	}
}
function doDrag(e, ctx) {
	//Draw the selected element under the cursor
	if(gActiveTile == null)
		return;
	var iPiece;
    var piece_width = getPieceWidth();
    var piece_height = getPieceHeight();
    var posX =  e.offsetX;
    var posY = e.offsetY;
	drawTile(ctx, gActiveTile.getType(), posX-piece_width/4, posY-piece_height/4, piece_width/2, piece_height/2);
}
function endDrag(e) {
	gX=-1; gY=-1;
	gActiveTile.drop(e.offsetX,e.offsetY);
	gIsDragging = false;
	gActiveTile = null;
}

//Initialize game and load resources
function initGame() {
	debugAlert("initGame", false);
	if(gGameActive ===  true) return;
	
	gBoardRowCount = 8;//document.getElementById("row").value;
	gBoardColumnCount = 6;//document.getElementById("column").value;
	
	//Create the play area canvas and listeners
	gPlayAreaCanvas = createCanvas(getPlayAreaWidth(), getPlayAreaHeight());
	gPlayAreaCanvasDrawingContext = gPlayAreaCanvas.getContext("2d");
	addListenerToElement(gPlayAreaCanvas,onMouseMovePlayArea,"mousemove");
	addListenerToElement(gPlayAreaCanvas,onMouseClickPlayArea,"click");
	
	//Create the tile chooser canvas and listeners
	gTileChooserCanvas = createCanvas(getTileLayoutWidth(), getTileLayoutHeight());
	gTileCanvasDrawingContext = gTileChooserCanvas.getContext("2d");
	addListenerToElement(gTileChooserCanvas, onMouseClick,"click");
	addListenerToElement(gTileChooserCanvas, onDoubleClick,"dblclick");
	addListenerToElement(gTileChooserCanvas,onMouseMoveTileArea,"mousemove");

	//Create the tiles
	iRightElbow = new  Image();
	iRightElbow.src  = "elbow.png";
	iLeftElbow = new  Image();
	iLeftElbow.src  = "elbow2.png";
	
	iStraight = new Image();
	iStraight.src = "straight.png";
	iPlumber = new Image();
	iPlumber.src = "plumber.jpg";
	iToilet = new Image();
	iToilet.addEventListener("load", function(){
		//after the resources are loaded start a  new game
		flushHandle();
		newGame();
		gGameActive = true;
	}, false);
	iToilet.src ="toilet.png";
}
function flushHandle() {
	var angle_deg = -30;
	var angle_rad = angle_deg*2*Math.PI/360;
	var sin_theta = Math.sin(angle_rad);//-.5;
	var cos_theta = Math.cos(angle_rad);//-.5;.866;
	var neg_sin_theta = -1*sin_theta;
	var xCofR = 125;
	var yCofR = 32;
	var x = xCofR - cos_theta*xCofR - neg_sin_theta*yCofR;
	var y = yCofR - sin_theta*xCofR - cos_theta*yCofR;
	var handle  = document.getElementById('flush')
	//handle.style.transform =  "matrix(1.4488, -0.3882, 0.3882, 1.4489, 0, 0)";//"matrix(cos_theta, neg_sin_theta, sin_theta, cos_theta, x, y)";
	//handle.style.transform =  "matrix(cos_theta, neg_sin_theta, sin_theta, cos_theta, x, y)";
	handle.style.transform =  "matrix(.940, -.34, .34, .94, .5, 10)";
	handle.blur();
	//handle.style.transform =  "matrix(eval(cos_theta), eval(neg_sin_theta), eval(sin_theta), eval(cos_theta), eval(x), eval(y))";
	//handle.style.transform =  "matrix(cos_theta, neg_sin_theta, sin_theta, cos_theta, x, y)";
	//handle.style.transform = "rotate(-30deg)";

	var audio = new Audio('toilet-flush-3.mp3');
	audio.play();
	
/*	
	handle.style.transform = "translate(-100px,-32px)";
	handle.style.transform = "rotate(-30deg)";
	handle.style.transform = "translate(100px,32px)";
*/
}
function getRandomConnector() {
	var v = Math.floor( Math.random()*gConnectorTypeCount ) + 1;
	var connector;
	switch(v) {
		case 1:
			connector = new IStraightConnector();
			break;
		case 2:
			connector = new IRightElbowConnector();
			break;
		case 3:
			connector = new ILeftElbowConnector();
			break;
		case 4:
			connector = new IHorizStraightConnector();
			break;
		default:
			connector = new IHorizStraightConnector();
			break;
	}
	return connector;
}
function generateTileArray() {
    var nColumns = getBoardWidth();
    var nRows = getBoardHeight();

    var column=0;
    var row=0;
    gTiles = new Array();
    for( column=0; column<nColumns; column++) {
    	var aRow = new Array();
    	for( row=0; row<nRows; row++) {
    		var a = new Tile(getRandomConnector(), false,  -1,  -1, true);
    		aRow.push(a);
    	}
    	gTiles.push(aRow);
    }
}

//Create a new game 
function newGame() {
    generateTileArray();
    refreshCanvas();

}
function refreshCanvas() {
	drawGrid();
	drawTiles();
	drawPlayArea();
}
function drawPlayArea() {
	debugAlert("drawPlayArea", false);
	var padding = getPadding();
	var width = getPlayAreaWidth();
	var height = getPlayAreaHeight();
	
	gPlayAreaCanvasDrawingContext.clearRect(0, 0, width, height );
	drawRect(gPlayAreaCanvasDrawingContext, padding,padding, width-padding, height-2*padding, "#ffffff" );

    var piece_width = getPieceWidth();
    var piece_height = getPieceHeight();
    var nColumns = getBoardWidth();
    var nRows 	= getBoardHeight();
    var column=0;
    var row=0;
    for( column=0; column<nColumns; column++) {
    	for( row=0; row<nRows; row++) {
    		var r = gTiles[column][row];
    		if(r.dropped()) {
	    		drawTile(gPlayAreaCanvasDrawingContext, r.getType(), r.positionX()-piece_width/4, r.positionY()-piece_height/4, piece_width/2, piece_height/2);
    		}
    	}
    }
}
function drawGrid() {
    var padding=getPadding();
    var width=getTileLayoutWidth()-padding;
    var height=getTileLayoutHeight()-padding;
    var piece_width = getPieceWidth();
    var piece_height = getPieceHeight();

    gTileCanvasDrawingContext.clearRect(0, 0, width, height );//kPixelWidth, kPixelHeight);

    gTileCanvasDrawingContext.beginPath();
    //var widthCanvas = width;//getCanvasWidth();
    var xTileOrigin = padding;//widthCanvas - width;
    var yTileOrigin = padding;
    for (var x = xTileOrigin; x <= width/*kPixelWidth*/; x += piece_width) {
    	gTileCanvasDrawingContext.moveTo(x, padding);
    	gTileCanvasDrawingContext.lineTo(x, height/*kPixelHeight*/);
    }
    
    for (var y = 0; y <= height; y += piece_height) {
    	gTileCanvasDrawingContext.moveTo(xTileOrigin, padding + y);
    	gTileCanvasDrawingContext.lineTo(width, padding +  y);
    }
    gTileCanvasDrawingContext.stroke();
}
function drawTiles()  {	
    //var xTileOrigin = 0;//getCanvasWidth() - getTileLayoutWidth();
	var padding = getPadding();
	var posX = padding;
	var posY = padding;

    var piece_width = getPieceWidth();
    var piece_height = getPieceHeight();
    var nColumns = getBoardWidth();
    var nRows 	= getBoardHeight();

    var column=0;
    var row=0;
    for( column=0; column<nColumns; column++) {
    	for( row=0; row<nRows; row++) {
    		
    		if(row == gY && column == gX){
        		gActiveTile/*tile*/ = gTiles[column][row];//.clone();
        		//alert("1");
        		drawTile(gTileCanvasDrawingContext, gActiveTile.getType(), posX+piece_width/4, posY+piece_height/4, piece_width/2, piece_height/2);
        		//alert("1");
    		}
    		else {
    			var r = gTiles[column][row];
    			if(r != null && r.dropped()) {
    				drawTile(gTileCanvasDrawingContext, iPlumber, posX+piece_width/4, posY+piece_height/4, 3*piece_width/4, 3*piece_height/4);
    			}
    			else {
    				drawTile(gTileCanvasDrawingContext, iToilet, posX+piece_width/4, posY+piece_height/4, piece_width/2, piece_height/2);
    			}
    		}
	    	posY += piece_height;
    	}
    	posY = padding;
		posX+=piece_width;
    }
}
//Draw a tile for the specified piece
function drawTile(ctx, img, posX, posY, width, height) {
	ctx.drawImage(img, posX, posY, width, height);
}
function createCanvas(width, height) {
	var theCanvas=document.createElement("canvas");
	theCanvas.id = "plumbingcanvas";
	document.body.appendChild(theCanvas);
	theCanvas.width = width;
	theCanvas.height = height;
	
	return theCanvas;
}
function getRow(e) {
	var y= e.offsetY;
	
	y /= getPieceHeight();
	y = Math.floor(y);
	return y;
}
function getColumn(e) {
	var x = e.offsetX;
	x /= getPieceWidth();
	x = Math.floor(x);
	return x;
}


function setCurrentCell(row, column) {
	gY = row/getPieceWidth();
	gX = column/getPieceHeight();
	gY = Math.floor(gY);
	gX = Math.floor(gX);
}


/*
function clickOnEmptyCell(cell) {
    if (gSelectedPieceIndex == -1) { return; }
    var rowDiff = Math.abs(cell.row - gPieces[gSelectedPieceIndex].row);
    var columnDiff = Math.abs(cell.column - gPieces[gSelectedPieceIndex].column);
    if ((rowDiff <= 1) &&
	(columnDiff <= 1)) {
	// we already know that this click was on an empty square,
	//   so that must mean this was a valid single-square move
	gPieces[gSelectedPieceIndex].row = cell.row;
	gPieces[gSelectedPieceIndex].column = cell.column;
	gMoveCount += 1;
	gSelectedPieceIndex = -1;
	gSelectedPieceHasMoved = false;
	drawBoard();
	return;
    }
    if ((((rowDiff == 2) && (columnDiff == 0)) ||
	 ((rowDiff == 0) && (columnDiff == 2)) ||
	 ((rowDiff == 2) && (columnDiff == 2))) && 
	isThereAPieceBetween(gPieces[gSelectedPieceIndex], cell)) {
	//this was a valid jump
	if (!gSelectedPieceHasMoved) {
	    gMoveCount += 1;
	}
	gSelectedPieceHasMoved = true;
	gPieces[gSelectedPieceIndex].row = cell.row;
	gPieces[gSelectedPieceIndex].column = cell.column;
	drawBoard();
	return;
    }
    gSelectedPieceIndex = -1;
    gSelectedPieceHasMoved = false;
    drawBoard();
}

function clickOnPiece(pieceIndex) {
    if (gSelectedPieceIndex == pieceIndex) { return; }
    gSelectedPieceIndex = pieceIndex;
    gSelectedPieceHasMoved = false;
    drawBoard();
}

function isThereAPieceBetween(cell1, cell2) {
    //note: assumes cell1 and cell2 are 2 squares away
    //   either vertically, horizontally, or diagonally
    var rowBetween = (cell1.row + cell2.row) / 2;
    var columnBetween = (cell1.column + cell2.column) / 2;
    for (var i = 0; i < gNumPieces; i++) {
	if ((gPieces[i].row == rowBetween) &&
	    (gPieces[i].column == columnBetween)) {
	    return true;
	}
    }
    return false;
}

function isTheGameOver() {
    for (var i = 0; i < gNumPieces; i++) {
	if (gPieces[i].row > 2) {
	    return false;
	}
	if (gPieces[i].column < (getBoardWidth() - 3)) {
	    return false;
	}
    }
    return true;
}
*/

/*
if (typeof resumeGame != "function") {
    saveGameState = function() {
	return false;
    }
    resumeGame = function() {
	return false;
    }
}
*/
/*
var boardHeight = getBoardHeight();
gPieces = [new Cell(boardHeight - 3, 0),
       new Cell(boardHeight - 2, 0),
       new Cell(boardHeight - 1, 0),
       new Cell(boardHeight - 3, 1),
       new Cell(boardHeight - 2, 1),
       new Cell(boardHeight - 1, 1),
       new Cell(boardHeight - 3, 2),
       new Cell(boardHeight - 2, 2),
       new Cell(boardHeight - 1, 2)];
gNumPieces = gPieces.length;
gSelectedPieceIndex = -1;
gSelectedPieceHasMoved = false;
gMoveCount = 0;
*/
/*
function getCursorPosition(e) {
    //returns Cell with .row and .column properties
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    x = Math.min(x, getBoardWidth() * getPieceWidth());
    y = Math.min(y, getBoardHeight() * getPieceHeight());
    var cell = new Cell(Math.floor(y/getPieceHeight()), Math.floor(x/getPieceWidth()));
    return cell;
}
*/
/*
function drawPiece(p, selected) {
	//return;
	
    var column = p.column;
    var row = p.row;
    var x = (column * getPieceWidth()) + (getPieceWidth()/2);
    var y = (row * getPieceHeight()) + (getPieceHeight()/2);
    var radius = (getPieceWidth()/2) - (getPieceWidth()/10);
    gDrawingContext.beginPath();
    gDrawingContext.arc(x, y, radius, 0, Math.PI*2, false);
    gDrawingContext.closePath();

    gDrawingContext.stroke();
    if (selected) {
    	gDrawingContext.fill();
    }
}
*/
/*
function endGame() {
    gSelectedPieceIndex = -1;
    gGameInProgress = false;
}
function getCell(e){
	return new Cell(e.OffsetY, e.offsetX);
}

function Cell(row, column) {
    this.row = row;
    this.column = column;
}

*
*/



