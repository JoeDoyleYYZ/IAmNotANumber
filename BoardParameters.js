/**
 * 
 */
var gBoardRowCount = 8;
var gBoardColumnCount = 8; 
function getPadding() {
	return 20;
}
function getBoardWidth() {
	return gBoardColumnCount;//8	;
}
function getBoardHeight() {
	return gBoardRowCount;//8;
}
function getPieceWidth() {
	return 80;
}
function getPieceHeight() {
	return 80;
}
function getPlayAreaWidth() {
	return 1.5*getTileLayoutWidth();
}
function getPlayAreaHeight() {
	return getTileLayoutHeight();
}
function getTileLayoutWidth() {
	return 2*getPadding()  + (getBoardWidth()*getPieceWidth());
}
function getTileLayoutHeight() {
	return 2*getPadding()  + (getBoardHeight()*getPieceHeight());
}
function getCanvasWidth() {
	return getPlayAreaWidth() + getTileLayoutWidth();//2*getTileLayoutWidth();//1  + (getBoardWidth()*getPieceWidth());
}
function getCanvasHeight() {
	return getPlayAreaHeight();
}
