/**
 * 
 */

//Add a listener to an element
function addListenerToElement(element, callback, type) {
	element.addEventListener(type, callback, false);
}

function onMouseMove(event) {
	handleMouseMove(event);
}

function onMouseClick(e) {
	handleMouseClick(e);
}

