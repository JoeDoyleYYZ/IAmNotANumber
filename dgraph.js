/**
 * 
 */

function DGraphNode(root, value) {
	this.root = root;
	this.value = value;
	this.sibling = null;
}
DGraphNode.prototype = {
	getParent : function(){ return this.parent; },
	getSibling: function(){  return this.sibling; },
	getValue: function(){ return this.value; }, 
	addChild: function(the_child){ 
		if( this.child == null)
			this.child = the_child;
		else
			this.child.sibling = the_child;
	},
}