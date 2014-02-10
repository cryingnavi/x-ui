X.util.DragNDropManager = X.util.ddm = {
	draggable: null,
	droppables: { },
	setDroppable: function(id, drop){
		this.droppables[id] = drop;
	},
	getDroppable: function(id){
		return this.droppables[id];
	},
	getDraggable: function(){
		if(!this.valid()){
			return false;
		}
		
		return this.draggable;
	},
	valid: function(){
		var draggable = this.draggable;
		if(draggable){
			return true;
		}
		
		return false;
	},
	start: function(drag){
		this.draggable = drag;
		
		$.each(this.droppables, function(id, drop){
			drop.start(X.util.ddm.getDraggable());
		});
	},
	move: function(pageXY){
		if(!this.valid()){
			return;
		}
		
		$.each(this.droppables, function(id, drop){
			drop.dragging(X.util.ddm.getDraggable(), pageXY);
		});
		
		pageXY = null;
	},
	end: function(e, pageXY){
		if(!this.valid()){
			return;
		}
		$.each(X.util.ddm.droppables, function(id, drop){
			drop.end(X.util.ddm.getDraggable(), e, pageXY);
		});
		
		e = null;
		pageXY = null;

		X.util.ddm.draggable = null;
	}
};