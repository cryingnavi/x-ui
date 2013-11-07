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
		X.util.Draggable.base.initialize.call(this, this.config);

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
			offset = el.offset(),
			l = offset.left,
			t = offset.top,
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

		me.region = {
			t: initialRegion.t + y,
			r: initialRegion.r + x,
			b: initialRegion.b + y,
			l: initialRegion.l + x
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

			me.transformTo(x, y, target);
			
			me.fireEvent(me, 'move', [me, me.region]);
			if(X.util.ddm){
				X.util.ddm.move({
					x: pageX,
					y: pageY
				});
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
				e.originalEvent.touches[0].pageX : e.originalEvent.pageX,
			pageY = e.originalEvent.touches ? 
				e.originalEvent.touches[0].pageY : e.originalEvent.pageY,
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

			if(!me.config.revert){
				style.left = me.position.x + 'px';
				style.top = me.position.y + 'px';
			}

			me.fireEvent(me, 'end', [me]);
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
					'-webkit-transform': 'translate3d(0px, 0px, 0px)'
				};
				
				me.active_el.css(anim).one('webkitTransitionEnd', function(){
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