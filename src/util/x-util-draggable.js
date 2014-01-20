/**
 * @class
 * @classdesc X.util.Draggable 클래스는 엘리먼트를 드래그 가능 엘리먼트로 생성한다.
 *  both or x or y 셋 중 하나의 값을 가지며 각각 양방향, 가로, 세로 방향으로 움직이게끔 지정한다.
 * @property {Boolen} config.constrain 드래그가 가능한 범위를 설정한다. 셀렉터로 설정가능하며 해당 셀렉터로 검색된 엘리먼트를 범위로 갖는다. 기본값은 false 이다. false 일 경우 범위가 존재하지 않는다.
 * @property {Object} config.handle 드래그 객체 내의 특정 영역을 handle 로 지정한다. 지정할 시 해당 영역을 클릭하여야 드래그가 시작된다. 기본값은 null 이다.
 * @property {Boolen} config.revert 드래그가 끝났을 경우 원래 위치로 되돌아 갈지 여부이다. 기본값은 false 이다.
 * @property {Number} config.revertDuration rever가 true 시 애니메이션 속도를 지정한다. 기본값은 200 이다. 0 지정시 애니메이션이 눈에 보이지 않는다.
 * 
 * @example
 * var drag = new X.util.Draggable({
 *      listener: {
 *          start: function(){ //drag 가 시작될 때 }
 *          move: function(){ //drag 가 지속 되고 있을 때 }
 *          end: function(){ //drag 가 끝날 때 }
 *      }
 * });
 */
X.util.Draggable = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
			horizontal: true,
			vertical: true,
			direction: 'both',
			constrain: false,
			handle: null,
			revert: false,
			revertDuration: 200,
			scroll: null // 구현안됨
		};
		X.apply(this.config, config);
	
		var listener = {};
		if(this.config.listener){
			listener = this.config.listener;
		}
		X.util.Draggable.base.initialize.call(this, listener);

		this.active_el = null;
		this.init();
	},
	init: function(){
		this.el = X.util.em.get(this.config.el)
			.addClass('ui-draggable');

		if (this.config.constrain) {
			this.config.constrain = $(this.config.constrain);
		}

		if(!this.config.handle){
			this.handle = this.el;
		}
		else{
			this.handle = this.el.find(this.config.handle);
		}
		
		if (this.config.direction == 'both') {
			this.config.horizontal = true;
			this.config.vertical = true;
		}
		else if (this.config.direction == 'x') {
			this.config.horizontal = true;
			this.config.vertical = false;
		}
		else {
			this.config.horizontal = false;
			this.config.vertical = true;
		}

		this.initialRegion = {
			t: 0, l: 0,
			r: 0, b: 0
		};

		this.offsetToCorner = {
			x: 0, y: 0
		};

		this.el.css({
			webkitTransform: 'translate3d(0px, 0px, 0px)',
			msTransform: 'translate3d(0px, 0px, 0px)',
			transform: 'translate3d(0px, 0px, 0px)'
		});

		this.handle.on(X.events.start, { me:this }, this.onStart);
	},
	reset: function(){
		var el = this.active_el,
			position = el.position(),
			l = position.left,
			t = position.top,
			r = l + el.width(),
			b = t + el.height();
		
		this.startPosition = this.position = {
			x: l || 0,
			y: t || 0
		};

		var region = {
			l: l, t: t,
			r: r, b: b
		};

		this.initialRegion = this.region = region;
		this.transform = { x: 0, y: 0 };
		
		this.transformTo(0, 0);
	},
	prepareDrag: function(e){
		this.reset();

		if (this.config.constrain !== false) {
			var w = this.config.constrain.width(),
				h = this.config.constrain.height();
			
			this.constrainRegion = {
				l: 0, t: 0,
				r: w, b: h
			};
		}

		var pageX = e.originalEvent.touches ? 
				e.originalEvent.touches[0].pageX : e.originalEvent.pageX,
			pageY = e.originalEvent.touches ? 
				e.originalEvent.touches[0].pageY : e.originalEvent.pageY;
				
		this.offsetToCorner = {
			x: pageX - this.initialRegion.l,
			y: pageY - this.initialRegion.t
		};
	},
	transformTo: function(x, y){
		var me = this,
			initialRegion = me.initialRegion,
			startPos = me.startPosition || { x: 0, y: 0 },
			target = me.active_el.get(0),
			style = target.style,
			translate = 'translate3d(' + x + 'px, ' + y + 'px' + ', 0px)';
		

		style.webkitTransform = translate;
		style.msTransform = translate;
		style.transform = translate;
		
		me.transform = { x: x, y: y };
		me.position = {
			x: startPos.x + x,
			y: startPos.y + y
		};
	},
	onStart: function(e){
		var me = e.data.me;
		
		if(me.dragging){
			return;
		}

		me.active_el = $(e.target);
		me.active_el.addClass('ui-dragging');
		var target = me.active_el.get(0);

		if(me.config.ghost){
			me.active_el = me._createGhost(me.active_el);
		}

		me.prepareDrag(e);
		if (!me.dragging) {
			me.dragging = true;
			target.style.webkitTransform = null;
			target.style.webkitTransitionDuration = null;
			target.style.msTransform = null;
			target.style.msTransitionDuration = null;
			target.style.transform = null;
			target.style.transitionDuration = null;
		}
		

		me.fireEvent(me, 'start', [me]);
		
		if(X.util.ddm){
			X.util.ddm.start(me);
		}

		X.getDoc().on(X.events.move, { me: me }, me.onMove);
		X.getDoc().on(X.events.end, { me: me }, me.onEnd);

		return false;
	},
	onMove: function(e){
		var me = e.data.me,
			target = e.target;

		if (me.dragging) {
			var x = 0,
				y = 0,
				initialRegion = me.initialRegion,
				constrainRegion = me.constrainRegion,
				pageX = e.originalEvent.touches ? 
					e.originalEvent.touches[0].pageX : e.originalEvent.pageX,
				pageY = e.originalEvent.touches ? 
					e.originalEvent.touches[0].pageY : e.originalEvent.pageY;

			if (me.config.horizontal) {
				x = pageX - initialRegion.l - me.offsetToCorner.x;
			}
			if (me.config.vertical) {
				y = pageY - initialRegion.t - me.offsetToCorner.y;
			}

			if (me.config.constrain) {
				if (me.config.horizontal) {
					if (initialRegion.l + x < constrainRegion.l) {
						x = constrainRegion.l - initialRegion.l;
					}
					if (initialRegion.r + x > constrainRegion.r) {
						x = constrainRegion.r - initialRegion.r;
					}
				}
				if (me.config.vertical) {
					if (initialRegion.t + y < constrainRegion.t) {
						y = constrainRegion.t - initialRegion.t;
					}
					if (initialRegion.b + y > constrainRegion.b) {
						y = constrainRegion.b - initialRegion.b;
					}
				}
			}
			
			me.region = {
    			t: initialRegion.t + y,
    			r: initialRegion.r + x,
    			b: initialRegion.b + y,
    			l: initialRegion.l + x
    		};
			
			if(me.fireEvent(me, 'move', [me, me.region]) !== false){
                me.transformTo(x, y, target);
			
    			if(X.util.ddm){
    				X.util.ddm.move({
    					x: pageX,
    					y: pageY
    				});
    			}
			}
		}
		
		return false;
	},
	onEnd: function(e){
		var me = e.data.me;
		if(!me.dragging){
			return;
		}

		var target = me.el,
			pageX = e.originalEvent.touches ? 
				e.originalEvent.changedTouches[0].pageX : e.originalEvent.pageX,
			pageY = e.originalEvent.touches ? 
				e.originalEvent.changedTouches[0].pageY : e.originalEvent.pageY,
			fn, endFn
			
		me.dragging = false;
		me.active_el.removeClass('ui-dragging');
		
		endFn = function(){
			if(me.config.ghost){
				me.ghost.remove();
			}

			var style = target.get(0).style;
			style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			style.webkitTransitionDuration = null;
			style.msTransform = 'translate3d(0px, 0px, 0px)';
			style.msTransitionDuration = null;
			style.transform = 'translate3d(0px, 0px, 0px)';
			style.transitionDuration = null;

			if(!me.config.revert){
				style.left = me.position.x + 'px';
				style.top = me.position.y + 'px';
			}

			me.fireEvent(me, 'end', [me, me.region]);
			if(X.util.ddm){
				X.util.ddm.end({
					x: pageX,
					y: pageY
				});
			}

			X.getDoc().off(X.events.move, me.onMove);
			X.getDoc().off(X.events.end, me.onEnd);
			
			me = null;
			target = null;
		};

		if (me.config.revert) {
			fn = function(){
				var anim = {
					'-webkit-transition-duration': me.config.revertDuration + 'ms',
					'-webkit-transform': 'translate3d(0px, 0px, 0px)',
					'-ms-transition-duration': me.config.revertDuration + 'ms',
					'-ms-transform': 'translate3d(0px, 0px, 0px)',
					'transition-duration': me.config.revertDuration + 'ms',
					'transform': 'translate3d(0px, 0px, 0px)'
				};
				
				me.active_el.css(anim).one('webkitTransitionEnd transitionend', function(){
					endFn();
					endFn = null;
				});
			};
		}
		else {
			fn = function(){
				endFn();
				endFn = null;
			};
		}
		fn();	

		return false;
	},
	_createGhost: function(target) {
		this.ghost = target.clone();

		this.active_el.before(this.ghost);
		if(this.ghost.get(0) !== target.get(0) && !(/(fixed|absolute)/).test(this.ghost.css('position'))){
			var offset = target.offset();
			this.ghost.css({
				position: 'absolute',
				left: offset.left,
				top: offset.top
			});
		}

		return this.ghost;
	}
});