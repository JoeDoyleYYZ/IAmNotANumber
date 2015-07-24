/**
 * 
 */


function drawCursor(ctx) {
	var vOldStyle = ctx.fillStyle;
	ctx.fillStyle = "green";
	drawCircle(ctx, event.offsetX,event.offsetY, getPieceWidth()/20);
	ctx.fillStyle = vOldStyle;
}
function drawLine(ctx, fromX, fromY, toX, toY) {
	ctx.moveTo(fromX, fromY);
	ctx.lineTo(toX,toY);
	ctx.stroke();
}
function drawCircle(ctx, centerX, centerY, radius)  {
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke();
}
function drawRect(ctx, fromX, fromY, toX, toY, newStyle) {
	var oldStyle = preDrawShape(ctx, newStyle);

	ctx.rect(fromX,fromY,toX,toY);

	postDrawShape(ctx, oldStyle);
}
function changeStyle(ctx, new_style) {
	var vOldStyle = ctx.fillStyle;
	ctx.fillStyle = new_style;
	return vOldStyle;
}
function drawDirectedRect(ctx, fromX, fromY, toX, toY, thickness) {
	preDrawShape(ctx);
	ctx.rect(fromX,fromY,toX,toY);
	postDrawShape(ctx);
}
function preDrawShape(ctx, new_style) {
	var oldStyle = ctx.fillStyle;
	ctx.fillStyle = new_style;
	ctx.beginPath();
	return oldStyle;
}
function postDrawShape(ctx, old_style) {
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = old_style;
}


