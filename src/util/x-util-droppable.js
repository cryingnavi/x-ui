/**
 * @class
 * @classdesc X.util.Droppable 클래스는 엘리먼트를 드롭 가능 엘리먼트로 생성한다.
 * @property {String} config.accept 드롭 영역이 받아들일 드래그 객체를 지정한다. 지정할 때는 CSS 셀렉터를 사용한다.
 * @example
 * var drag = new X.util.Droppable({
 *      accept: '#dragEl',
 *      listener: {
 *          start: function(){ //drag 객체가 드래그를 시작할 때 },
 *          move: function(){ //drag 객체가 드래그를 지속 하고 있을 때 },
 *          end: function(){ //drag 객체가 드래그를 끝냈을 때 },
 *          hover: function(){ //drag 객체가 드롭 영역에 들어온 후 지속적으로 호출된다. },
 *          enter: function(){ //drag 객체가 드롭 영역에 들어오면 한번만 호출된다. },
 *          leave: function(){ //drag 객체가 드롭 영역에 나가면 한번만 호출된다. },
 *          drop: function(){ //drag 객체가 드롭 영역 안에서 드롭 되면 호출된다. },
 *      }
 * });
 */
X.util.Droppable = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
			accept: '*'
		};
		X.apply(this.config, config);
		
		var listener = {};
		if(this.config.listener){
			listener = this.config.listener;
		}
		X.util.Droppable.base.initialize.call(this, listener);
		
		this.isEnter = false;
		this.init();
	},
	init: function(){
		this.el = X.util.em.get(this.config.el);
		this.el.addClass('ui-droppable');
		
		var id = this.el.attr('id');
		X.util.ddm.setDroppable(id, this);
	},
	isAccept: function(drag){
		if(this.config.accept !== '*'){
			return drag.el.is(this.config.accept);
		}

		return true;
	},
	start: function(drag){
		if(!this.isAccept(drag)){
			return;
		}
		
		var el = this.el;
		var offset = el.offset();
		this.left = offset.left;
		this.top = offset.top;
		
		this.width = el.outerWidth();
		this.height = el.outerHeight();

		this.fireEvent(this, 'start', [this, drag]);
	},
	dragging: function(drag, e){
		if(!this.isAccept(drag)){
			return;
		}
		this.move(drag, e);
	},
	move: function(drag, pageXY){
		this.fireEvent(this, 'move', [this, drag]);
		
		if(this.isOver(pageXY)) {
			if(!this.isEnter){
				this.isEnter = true;
				this.enter(drag);
			}
			this.hover(drag);
		}
		else{
			if(this.isEnter){
				this.isEnter = false;
				this.leave(drag);
			}
		}
	},
	enter: function(drag){
		this.fireEvent(this, 'enter', [this, drag]);
	},
	leave: function(drag){
		this.fireEvent(this, 'leave', [this, drag]);
	},
	drop: function(drag){
		this.fireEvent(this, 'drop', [this, drag]);
	},
	hover: function(drag){
		this.fireEvent(this, 'hover', [this, drag]);
	},
	end: function(drag, pageXY){
		if(!this.isAccept(drag)){
			return;
		}
		
		this.fireEvent(this, 'end', [this, drag]);

		this.isEnter = false;
		if(this.isOver(pageXY)) {
			this.drop(drag);
		}
	},
	isOver: function(pageXY){
		var pageX = pageXY.x;
		var pageY = pageXY.y;
		
		if(pageX > this.left 
				&& pageY > this.top 
				&& pageX < this.left + this.width 
				&& pageY < this.top + this.height) {
			
			return true;
		}

		return false;
	}
});



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