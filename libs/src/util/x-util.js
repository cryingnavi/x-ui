X.util.Observer = X.extend(X.emptyFn, {
	initialize: function(listener){
		this.eventTypes = this.eventTypes || {};
		for (var attr in listener) {
			this.eventTypes[attr] = listener[attr];
		}
	},
	addEvent: function(){
		var a = arguments,
			i = a.length,
			eventTypes = this.eventTypes;

		while(i--) {
			for (var attr in a[i]){
				if(eventTypes[attr]){
					if(X.type(eventTypes[attr]) === 'array'){
						this.eventTypes[attr].push(a[i][attr]);
					}
					else{
						this.eventTypes[attr] = [eventTypes[attr], a[i][attr]];
					}
				}
				else{
					this.eventTypes[attr] = a[i][attr];
				}
			}
		}
	},
	fireEvent: function(o, type, args){
		var params = o.config ? o.config.params || [] : [],
		    eventTypes = this.eventTypes;
		
		if (eventTypes[type]) {
			args = args || [];
			if(X.type(eventTypes[type]) === 'object'){
				var event = eventTypes[type];
				params = event.params ? params.concat(event.params) : params;
				
				return event.fn.apply(event.scope || o, args.concat(params));
			}
			else if(X.type(eventTypes[type]) === 'array'){
				for(var i=0, len = eventTypes[type].length; i<len; i++){
					var event = eventTypes[type][i],
						result = false;

					result = event.apply(o.config ? o.config.scope || o : o, args.concat(params));
				}
				return result;
			}
			else{
				return eventTypes[type].apply(o.config ? o.config.scope || o : o, args.concat(params));
			}
			return false;
		}
		return false;
	},
	removeEvent: function(type){
		if (this.eventTypes[type]) {
			delete this.eventTypes[type];
		}
	},
	clear: function(){
		this.eventTypes = {};
	}
});

X.util.Observer.prototype.on = X.util.Observer.prototype.addEvent;
X.util.Observer.prototype.off = X.util.Observer.prototype.removeEvent;
X.util.Observer.prototype.fire = X.util.Observer.prototype.fireEvent;

X.util.ElementManager = X.util.em = {
	id: 'x-ui-',
	index: 1000,
	get: function(selector){
		if(selector){
			var type = X.type(selector);
			if(type === 'string' || type === 'dom'){
				var el = $(selector),
					me = this;
				
				el.each(function(){
					if(!this.id){
						this.id = me.id + me.index++;
					}
				});

				return el;
			}
			else if(type === 'jquery'){
				var el = selector,
					me = this;
				
				el.each(function(){
					if(!this.id){
						this.id = me.id + me.index++;
					}
				});

				return el;
			}
			else if(type === 'object'){
				var config = selector,
					tag = config.tag;
				
				return this.create(tag, config);
			}
		}

		return this.create();
	},
	create: function(tag, config){
		var el = null;
		config = config || {};
		delete config.tag;
		if(tag){
			el = $('<' + tag + ' />', config);
		}
		else{
			el = $('<div />', config);
		}

		if(config.id){
			el.attr('id', config.id);
		}
		else{
			el.attr('id', this.id + this.index++);
		}

		return el;
	}
};

X.util.ComponentManager = X.util.cm = {
	map: { },
	cString: { },
	create: function(contain, items){
		for(var i=0, len=items.length; i<len; i++){
			if(!items[i].render){
				items[i] = new this.cString[items[i].cString](items[i]);
			}

			this.elementAdd(contain, items[i].el);
			if(!items[i].config.autoRender){
				items[i].render();
			}
			
			this.set(items[i].el.attr('id'), items[i]);
		}
		
		return items;
	},
	elementAdd: function(contain, el){
		contain.append(el);
	},
	set: function(id, item){
		this.map[id] = item;
	},
	get: function(id){
		return this.map[id];
	},
	addCString: function(name, klass){
		this.cString[name] = klass;
	},
	remove: function(id){
		delete this.map[id];
	},
	clear: function(){
		this.map = { };
	}
};


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


X.util.History = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
			vc: null
		};
		X.apply(this.config, config);
		
		var listener = { };
		if(this.config.listener){
			listener = this.config.listener;
		}
		X.util.History.base.initialize.call(this, listener);
		
		/* view */
		this.viewMap = { };
		
		/* ajax data save */
		this.ajaxCache = { };
		
		/* view id */
		this.stack = [];
	},
	initPageSave: function(key, view){
		this.clear();
		
		this.viewMap[key] = {
			view: view,
			transition: 'none'
		};
		this.stack.push(key);
	},
	nextPageSave: function(key, view, transition){
		this.viewMap[key] = {
			view: view,
			transition: transition
		};
		this.stack.push(key);
	},
	prevPageSave: function(key){
		var reverse = this.stack.reverse(),
		    len = 0,
		    removeView = [],
		    viewMap = this.viewMap;

		for(var i=0; i<reverse.length; i++){
			if(key === reverse[i]){
				len = i;
				break;
			}
			else{
				removeView.push(reverse[i]);
			}
		}

		for(var i=0; i<removeView.length; i++){
			if(viewMap[removeView[i]]){
				viewMap[removeView[i]].view.destroy();
				this.removeViewMap(removeView[i]);
			}
		}

		this.stack.reverse();
		this.stack = this.stack.slice(0, this.stack.length - len);
	},
	removeViewMap: function(key){
		this.viewMap[key].view.destroy();
		delete this.viewMap[key];
	},
	removeStack: function(key){
		var i=0,
			stack = this.stack,
			len = stack.length,
			array = [];
		for(;i<len;i++){
			if(stack[i] !== key){
				array.push(stack[i]);
			}
		}

		this.stack = array;
	},
	getBackPageInfo: function(){
	    var stack = this.stack,
	        len = stack.length;
		
		if(stack.length < 2){
			return false;
		}
		
		var from = stack[len - 1];
		var to = stack[len - 2];
		
		var fromView = this.viewMap[from];
		var toView = this.viewMap[to];
		
		return {
			fromView: fromView.view,
			toView: toView.view,
			transition: fromView.transition
		}
	},
	setAjaxCache: function(key, cacheData){
		this.ajaxCache[key] = cacheData;
	},
	getAjaxCache: function(key){
		return this.ajaxCache[key];
	},
	isCache: function(key){
		if(this.ajaxCache[key]){
			return true;
		}
		return false;
	},
	getViewInfo: function(key){
		if(this.viewMap[key]){
			return this.viewMap[key];
		}
		return null;
	},
	clear: function(){
		var removeView = this.stack, 
		    viewMap = this.viewMap;
		
		for(var i=0; i<removeView.length; i++){
			if(viewMap[removeView[i]]){
				viewMap[removeView[i]].view.destroy();
			}
		}

		this.viewMap = { };
		this.ajaxCache = { };
		this.stack = [ ];
	},
	getStackLength: function(){
		return this.stack.length;
	}
});

X.util.ViewController = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
			transition: 'slide'
		};
		X.apply(this.config, config);

		var listener = {};
		if(this.config.listener){
			listener = this.config.listener;
		}
		X.util.ViewController.base.initialize.call(this, listener);

		this.history = new X.util.History({
			vc: this
		});
		
		this.id = this.config.id || 'ui-vc-' + (X.util.ViewController.id++);

		X.util.ViewController.set(this);
	},
	init: function(view){
		this.view = view;
	},
	transitionStart: function(fromView, toView, transition, reverse){
		var deferred = new $.Deferred();

		function transitionHandler(fromView, toView, transition, reverse){
			var viewIn = function(){
				var tel = toView.getEl();
				tel.addClass(transition + ' in ' + reverse + ' ui-transitioning ui-vc-active').removeClass('ui-view-hide');

				var fel = fromView.getEl();
				fel.addClass(transition + ' out ' + reverse + ' ui-transitioning');

				if(transition !== 'none'){
					tel.animationComplete(viewOut);
				}
				else{
					viewOut();
				}
			},
			viewOut = function(){
				var tel = toView.getEl();
				tel.removeClass(transition + ' in ' + reverse + ' ui-transitioning');

				var fel = fromView.getEl();
				fel.removeClass(transition + ' out ' + reverse + ' ui-transitioning ui-vc-active');
				
				done();
			},
			done = function(){
				fromView.hide();
				deferred.resolve(this, [fromView, toView]);

				fromView = null, toView = null, transition = null, reverse = null;
			};

			viewIn();
		}

		transitionHandler(fromView, toView, transition, reverse);
		
		return deferred;
	},
	prevMove: function(fromView, toView, config){
		var promise,
			me = this;

		config = X.apply({
			transition: this.config.transition,
			reverse: 'reverse'
		}, config);

	
		if(!X.util.vcm.transition){
			config.transition = 'none';
		}

		this.fireEvent(this, 'beforeprevchange', [fromView, toView]);
		if(config.listener){
		    if(config.listener.beforeprevchange){
                config.listener.beforeprevchange.apply(config.listener.scope || me, [fromView, toView]);  
		    }
		}

		promise = this.transitionStart(fromView, toView, config.transition, config.reverse);
		promise.done(function(){
			X.util.vcm.changing = false;

			me.setActiveView(toView);
			me.history.prevPageSave(toView.getId());

			me.fireEvent(me, 'afterprevchange', [fromView, toView]);
			if(config.listener){
			    if(config.listener.afterprevchange){
                    config.listener.afterprevchange.apply(config.listener.scope || me, [fromView, toView]);  
			    }
			}

			me = null, fromView = null, toView = null, config = null;
		});
	},
	nextMove: function(fromView, toView, config){
		var promise,
			me = this;
		
		config = X.apply({
			transition: this.config.transition,
			history: true,
			reverse: ''
		}, config);
		
		if(!X.util.vcm.transition){
			config.transition = 'none';
		}

		this.fireEvent(this, 'beforenextchange', [fromView, toView]);
		if(config.listener){
		    if(config.listener.beforenextchange){
                config.listener.beforenextchange.apply(config.listener.scope || me, [fromView, toView]);  
		    }
		}

		promise = this.transitionStart(fromView, toView, config.transition, config.reverse);
		promise.done(function(){
			X.util.vcm.changing = false;
			
			me.setActiveView(toView);
			me.history.nextPageSave(toView.getId(), toView, config.transition);
			me.fireEvent(me, 'afternextchange', [fromView, toView]);

			if(config.listener){
			    if(config.listener.afternextchange){
                    config.listener.afternextchange.apply(config.listener.scope || me, [fromView, toView]);  
			    }
			}

			me = null, fromView = null, toView = null, config = null;
		});
	},
	backPage: function(){
		if(this.history.getStackLength() < 2){
			return false;
		}
		var o = this.history.getBackPageInfo();
		this.prevMove(o.fromView, o.toView, {
			transition: o.transition
		});

		return true;
	},
	setActiveView: function(activeView){
		this.activeView = activeView;
		this.activeView.el.addClass('ui-vc-active');
	},
	getActiveView: function(){
		return this.activeView;
	}
});

X.util.vcm = X.util.ViewControllerManager = X.apply(X.util.ViewController, {
	id: 0,
	transition: true,
	changing: false,
	map: { },
	loadingMsg: 'Loading..',
	errorMsg: '화면을 불러오지 못했습니다.',
	get: function(id){
		return this.map[id];
	},
	set: function(vc){
		this.map[vc.id] = vc;
	},
	setErrorMsg: function(msg){
		this.errorMsg = msg;
	},
	setLoadingMsg: function(){
		this.loadingMsg = msg;
	},
	enabledTransition: function(){
		this.transition = true;
	},
	disabledTransition: function(){
		this.transition = false;
	}
});


X.util.LocalViewController = X.extend(X.util.ViewController, {
	initialize: function(config){
		this.config = {
			activeIndex: 0,
		};
		X.apply(this.config, config);
		X.util.LocalViewController.base.initialize.call(this, this.config);

		this.views = [];
	},
	init: function(view){
		X.util.LocalViewController.base.init.call(this, view);
		
		this.views = this.view.config.items;
		this.viewsInit();
	},
	viewsInit: function(){
		if(this.views.length < 1){
			return false;
		}
		
		var views = this.views,
			len = views.length,
			activeIndex = this.config.activeIndex,
			activeView;

		activeView = views[activeIndex];

		this.setActiveView(activeView);
		this.history.initPageSave(activeView.getId(), activeView);

		views.forEach(function(view){
			view.el.addClass('ui-vc-views');
			view.hide();
		});

		activeView.show();
	},
	valid: function(fromView, toView){
		if(fromView === toView){
			return true;
		}
		else{
			return false;
		}
	},
	getActiveIndex: function(){
		var active = this.getActiveView();
		for(var i=0; i<this.views.length; i++){
			if(active === this.views[i]){
				return i;
			}
		}
	},
	getView: function(index){
		if(this.views.length < 1){
			return null;
		}
		
		var view = this.views[index];
		if(!view){
			return null;
		}
		
		return view;
	},
	nextPage: function(config){
		if(X.util.vcm.changing){
			return false;
		}
		
		if(!config){
			return false;
		}
		
		var fromView = this.getActiveView(),
			toView = this.getView(config.index);
		
		if(this.valid(fromView, toView)){
			return false;
		}
		
		X.util.vcm.changing = true;

		toView.show();
		this.nextMove(fromView, toView, config);
	},
	prevPage: function(config){
		if(X.util.vcm.changing){
			return false;
		}
		
		if(!config){
			return false;
		}
		
		var fromView = this.getActiveView(),
			toViewInfo = this.history.getViewInfo(this.getView(config.index).getId());
		
		if(this.valid(fromView, toViewInfo.view)){
			return false;
		}

		X.util.vcm.changing = true;

		toViewInfo.view.show();
		this.prevMove(fromView, toViewInfo.view, {
			transition: toViewInfo.transition
		});
	},
	appendView: function(view){
		view.el.addClass('ui-vc-active');
		this.views.push(view);

		return view;
	},
	removeView: function(view){
		var i=0,
			views = this.views,
			len = views.length,
			array = [];
		
		for(; i<len; i++){
			if(views[i] !== view){
				array.push(views[i]);
			}
		}
		this.views = array;

		this.history.removeMap(id);
		this.history.removeStack(id);

		return view;
	}
});
X.util.cm.addCString('localviewcontroller', X.util.LocalViewController);


X.util.RemoteViewController = X.extend(X.util.ViewController, {
	initialize: function(config){
		this.config = { 
			initPage: null
		};
		X.apply(this.config, config);
		X.util.RemoteViewController.base.initialize.call(this, this.config);

		this.views = [];
		this.updater = new X.util.ViewUpdater({
			vc: this
		});
	},
	init: function(view){
		X.util.RemoteViewController.base.init.call(this, view);
		
		if(this.config.initPage){
			this.initPage(this.config.initPage);
		}
	},
	initPage: function(config){
		this.fireEvent(this, 'beforeinit', []);
		this.callMethod = 'initSuccess';
		this.send(config);
	},
	nextPage: function(config){
		if(X.util.vcm.changing){
			return;
		}
		
		if(!config){
			return false;
		}
		
		if(this.valid(config.url)){
		   return; 
		}
		
		X.util.ViewController.changing = true;
		this.callMethod = 'nextSuccess';
		
		this.send(config);
	},
	prevPage: function(config){
		if(X.util.vcm.changing){
			return false;
		}
		
		if(!config){
			return false;
		}
		
		if(this.valid(config.url)){
		   return; 
		}

		var fromView = this.getActiveView(),
			toViewInfo = this.history.getViewInfo(config.url);
		
		if(this.valid(fromView, toViewInfo.view)){
			return false;
		}

		X.util.vcm.changing = true;
		this.prevMove(fromView, toViewInfo.view, {
			transition: toViewInfo.transition
		});
	},
	getToView: function(index){
		var view;
		var config = index;
		config.scroll = false;
		view = new X.View(config);
		
		view.getEl().addClass('ui-vc-views');
		return view;
	},
	send: function(config){
		if(!this.history.isCache(config.url)){
			//loading..
			this.loading = X.util.em.get()
				.html(X.util.vcm.loadingMsg).addClass('ui-loading-msg');

			X.getBody().prepend(this.loading);
			this.loading.addClass('ui-popup in');

			if(this.updater && config.url){
				if(config.url){
					this.updater.send(config);
				}
			}
		}
		else{
			this.success(this.history.getAjaxCache(config.url), config);
		}
	},
	success: function(data, config){
		if(this.loading){
			this.loading.remove();
		}

		this.history.setAjaxCache(config.url, data);
		data = $(data);

		var html = [],
			script = [];
		
		data.each(function(){
			if(this.nodeName !== 'SCRIPT'){
				html.push(this);
			}
			else{
				script.push(this);
			}
		});
		
		data = {
			html: $(html),
			script: $(script)
		};
		
		var toViewEl = data.html.eq(0),
			viewConfig = { id: config.url },
			toView;
		
		toView = this.history.getViewInfo(config.url);
		if(!toView){
			toView = this.getToView(viewConfig);
			toView.el.addClass('ui-vc-views');
		}
		else{
			toView = toView.view;
		}

		this[this.callMethod](data, toView, config);
	},
	initSuccess: function(data, toView, config){
		this.history.initPageSave(config.url, toView);
	
		this.setActiveView(toView);
		toView.setContent(data.html);
		this.view.add([toView]);
		toView.body.append(data.script);

		this.fireEvent(this, 'afterinit', [this.getActiveView()]);
		if(config.listener){
		    if(config.listener.afterinit){
		        config.listener.afterinit.apply(config.listener.scope || this, [this.getActiveView()]);  
		    }
		}
	},
	nextSuccess: function(data, toView, config){
		var fromView = this.getActiveView({
			id: config.url
		});		

		if(!this.history.getViewInfo(config.url)){
			toView.setContent(data.html);
			this.view.add([toView]);
			toView.body.append(data.script);
		}
		this.nextMove(fromView, toView, config);
	},
	errorTransition: function(div, type){
		var deferred = new $.Deferred();

		function transitionHandler(div, type){
			var divIn = function(){
				div.addClass('ui-popup in');
				div.animationComplete(divOut);
			},
			divOut = function(){
				window.setTimeout(function(){
					div.removeClass('ui-popup in').addClass('ui-popup out');
					div.animationComplete(done);
				}, 3000);
			},
			done = function(){
				deferred.resolve(this);

				div = null, type = null;
			};

			if(type === 'show'){
				divOut();
			}
			else{
				divIn();
			}
		}

		transitionHandler(div, type);
		
		return deferred;
	},
	error: function(){
		//error
		var div,
			promise,
			fn = function(div){
				var promise = this.errorTransition(div);
				return promise;
			};
		
		if(this.loading){
			div = this.loading;
			div.html(X.util.vcm.errorMsg);
			
			if(div.css('display') !== 'none'){
				promise = this.errorTransition(div, 'show');
			}
			else{
				promise = fn.call(this, div);
			}
		}
		else{
			var div = X.util.em.get()
				.html(X.util.vcm.errorMsg).addClass('ui-loading-msg');
			X.getBody().prepend(div);
			
			promise = fn.call(this, div);
		}

		promise.done(function(){
			X.util.vcm.changing = false;
			div.remove();
			div = null;
		});
	},
	valid: function(url){
	    if(this.history.stack.length){
    	    if(this.history.stack[this.history.stack.length - 1] === url){
    	        return true;
    	    }
	    }
	    return false;
	}
});


X.util.ViewUpdater = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
			clear: true,
			ajax: {
				context: this,
				timeout: 10000,
				dataType: 'html',
				success: this.success,
				error: this.error
			}
		};
		
		X.apply(true, this.config, config);

		var listener = {};
		if(this.config.listener){
			listener = this.config.listener;
		}
		X.util.ViewUpdater.base.initialize.call(this, listener);
	},
	send: function(config){
		config = X.apply(config, this.config.ajax);
		var xhr = $.ajax(config);

		var params = { };
		params.url = config.url;
		if(config.hasOwnProperty('transition')){
			params.transition = config.transition;
		}
		if(config.hasOwnProperty('history')){
			params.history = config.history;
		}
		if(config.hasOwnProperty('listener')){
		    params.listener = config.listener;
		}
		xhr.params = params;
	},
	success: function(data, status, xhr){
		this.config.vc.success(data, xhr.params);
	},
	error: function(xhr, status){
		this.config.vc.error(xhr);
	}
});

X.util.cm.addCString('viewupdater', X.util.ViewUpdater);