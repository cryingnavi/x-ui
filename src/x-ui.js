/*! 
 * x-ui Javascript UI FrameWork
 * jQuery Mobile Event Plugin, jQuery Mobile Animation used and iScroll 4 used.
 * 
 * Copyright 2013, 2013 YoungNam Heo
 * Dual licensed under the MIT or GPL Version 2 licenses
 * 
 * project: x-ui
 * version: 1.0.0
 * Date: 2013-11-10 11:11 
 */
X = {
    version : '1.0.0'
};

(function(){
	var win = $(window), 
		doc = $(document),
		body;

	X.apply = $.extend;
	X.apply(X, {
		emptyFn: $.noop,
		format: function(str){
			var args = arguments, len = args.length;
			var reg;
			for(var i=0; i<len; i++){
				reg = new RegExp('\\{'+i+'\\}', 'g');
				str = str.replace(reg, args[i+1]);
			}
			return str;
		},
		extend: function(sp, proto){
			var sb = function(){
				var args = $.makeArray(arguments);
				this.initialize.apply(this, args);
			};

			var F = function(){ },
				spp = sp.prototype;
			
			F.prototype = spp;
			if(!spp.initialize){
				spp.initialize = X.emptyFn;
			}
			sb.prototype = new F();
			sb.prototype.constructor = sb;
			sb.base = spp;

			if (proto){
				X.apply(sb.prototype, proto);
			}
			
			sb.extend = function(proto){
				var sp = this;
				return X.extend(sp, proto);
			};

			return sb;
		},
		type: function(o){
			var t = $.type(o);
			if(t === 'object'){
				if(o.innerHTML){
					t = 'dom';
				}
				else if(o.jquery){
					t = 'jquery';
				}
			}
			
			return t;
		},
		getOrientation: function(){
			var ori = window.orientation;
			if(ori === 0){
				return 'portrait';
			}
			else if(ori === 90){
				return 'landscape';
			}
			else if(ori === -90){
				return 'landscape';
			}
			else{
				return 'portrait';
			}
		},
		getBody: function(flag){
			if(!body){
				body = $('body');
			}
			return flag === true ? document.body : body;
		},
		getDoc: function(flag){
			return flag === true ? document : doc;
		},
		getWindow: function(flag){
			return flag === true ? window : win;
		},
		getWindowSize: function(){
			var win = this.getWindow();
			return {
				width: win.width(),
				height: win.height()
			};
		}
	});

	//animation complete callback
	$.fn.animationComplete = function( callback, data ){
		if('WebKitTransitionEvent' in window){
			return $(this).one('webkitAnimationEnd', data, callback);
		}
		else{
			// defer execution for consistency between webkit/non webkit
			setTimeout(callback, 0);
			return $(this);
		}
	};

	

	X.platform = (function(){
		var userAgent = navigator.userAgent.toLowerCase();
		var platform = navigator.platform;

		var iPhone = /iPhone/i.test(platform),
			iPad = /iPad/i.test(platform),
			iPod = /iPod/i.test(platform);

		var win = /win/i.test(platform),
			mac = /mac/i.test(platform),
			linux = /linux/i.test(platform),
			iOs = iPhone || iPad || iPod;

		var android = /android/i.test(userAgent),
			androidVersion = parseFloat(userAgent.slice(userAgent.indexOf('android') + 8));

		return {
			isIos: iOs,
			isWindows: win,
			isMac: mac,
			isLinux: linux,
			isDesktop: win || (!android && linux) || mac,
			iPod: iPod,
			iPhone: iPhone,
			iPad: iPad,
			android: android,
			androidVersion: androidVersion,
			hasTouch: ('ontouchstart' in window)
		};
	})();

	X.events = (function(){
		var hasTouch = X.platform.hasTouch ? true : false;
		return {
			start: hasTouch ? 'touchstart' : 'vmousedown',
			move: hasTouch ? 'touchmove' : 'vmousemove',
			end: hasTouch ? 'touchend' : 'vmouseup',
			orientationchange: hasTouch ? 'orientationchange' : 'resize'
		};
	})();
})();


X.apply(Array.prototype, {
	remove: function(from, to){
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	}
});
X.util = { };
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
X.ui = { };
X.View = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
			el: null,
			width: 200,
			height: 200,
			autoSize: true,
			scroll: true,
			scrollConfig: { },
			content: null,
			items: [ ],
			toolbars: [ ],
			floating: false,
			overlay: false,
			viewController: null,
			layout: 'y',
			flexible: true,
			panels: null,
			className: null,
			style: null
		};
		X.apply(true, this.config, config);

		var listener = { };
		if(this.config.listener){
			listener = this.config.listener;
		}
		X.View.base.initialize.call(this, listener);

		if(!this.config.el){
			this.config.el = {
				tag: 'div',
				id: this.config.id
			};
		}
		this.el = X.util.em.get(this.config.el);
		X.util.cm.set(this.el.get(0).id, this);
			
		this.body = this.el.wrapInner(
			X.util.em.get().addClass('ui-view-body')
		).children();

		if(this.config.autoRender){
			this.render();
		}
	},
	render: function(){
		this.fireEvent(this, 'beforerender', [this]);
		this.el.addClass('ui-view');

		this.setLayout(this.config.layout);
		this.setSize(this.config.autoSize);

		if(this.config.className){
			this.el.addClass(this.config.className);
		}

		if(this.config.style){
			this.el.css(this.config.style);
		}

		if(this.config.toolbars.length > 0){
			this.addToolbar(this.config.toolbars);
		}

		if(this.config.content){
			this.setContent(this.config.content);
		}
		
		if(this.config.items.length > 0){
			this.add(this.config.items);
		}

		if(this.config.viewController){
			this.setViewController(this.config.viewController);
		}
		
		if(this.config.floating){
			this.setFloating(this.config.floating);
		}
		
		if(this.config.panels){
			this.panelsCreate(this.config.panels);
		}	

		this.setFlexible(this.config.flexible);
		this.scrollCreate(this.config.scroll);

		X.getWindow().on(X.events.orientationchange, { me: this }, this.onOrientationChange);

		this.fireEvent(this, 'afterrender', [this]);
	},
	scrollRefresh: function(){
		if(this.scroll){
			this.scroll.refresh();
		}
	},
	panelsCreate: function(panels){
		if(panels.left){
			this.panelsLeft = X.util.em.get()
				.addClass('ui-view-panels-left');
			
			this.el.append(this.panelsLeft);
			
			X.util.cm.create(this.panelsLeft, [panels.left]);
		}
		
		if(panels.right){
			this.panelsRight = X.util.em.get()
				.addClass('ui-view-panels-right');
			
			this.el.append(this.panelsRight);
			
			X.util.cm.create(this.panelsRight, [panels.right]);
		}		

		this.body.addClass('ui-view-panels ui-view-panels-close');
		
		this.currentPanel = null;
	},
	panelsOpen: function(type){
		if(this.panelsRight || this.panelsLeft){
    		this.body.removeClass('ui-view-panels-close').addClass('ui-view-panels-open-' + type);
			
			this.currentPanel = type;
			this.fireEvent(this, 'panelsopen', [this, this.currentPanel]);
			
			this.body.on('vclick', { me: this }, function(e){
    		    var me = e.data.me;
    		    if(me.currentPanel){
    		        me.panelsClose();
    		    }
    		    
    		    return false;
    		});
		}
	},
	panelsClose: function(){
		if(this.panelsRight || this.panelsLeft){
			this.body.removeClass('ui-view-panels-open ui-view-panels-open-left ui-view-panels-open-right').addClass('ui-view-panels-close');
			
			this.currentPanel = null
			this.fireEvent(this, 'panelsclose', [this]);
			
			this.body.off('vclick');
		}
	},
	panelsToggle: function(type){
		if(this.panelsRight || this.panelsLeft){
			if(this.body.hasClass('ui-view-panels-close')){
				this.panelsOpen(type);
			}
			else{
				this.panelsClose(type);
			}
		}
	},
	setContent: function(content){
		var reg = /^#/;
		if(X.type(content) === 'string' && reg.test(content)){
			content = $(content);
			if(this.body.children('.ui-scrollview-view').length > 0){
				this.body.children('.ui-scrollview-view').html(content);
			}
			else{
				this.body.html(content);
			}
		}
		else{
			if(this.body.children('.ui-scrollview-view').length > 0){
				this.body.children('.ui-scrollview-view').html(content);
			}
			else{
				this.body.html(content);
			}
		}
		
		this.createHtmlComponent();
	},
	setLayout: function(layout){
		if(layout === "x"){
			this.el.addClass("ui-view-horizontal");
			this.body.removeClass("ui-view-body-vertical")
				.addClass("ui-view-body-horizontal");
		}
		else if(layout === "y"){
			this.body.removeClass("ui-view-body-horizontal")
				.addClass('ui-view-body-vertical');
		}
	},
	setFlexible: function(flex){
		if(flex){
			this.el.removeClass('ui-view-inflexible')
				.addClass('ui-view-flexible');
		}
		else{
			this.el.removeClass('ui-view-flexible')
				.addClass('ui-view-inflexible');
		}
	},
	setSize: function(autoSize){
		this.setWidth(autoSize);
		this.setHeight(autoSize);
	},
	setWidth: function(width){
		if(X.type(width) !== 'boolean' || width !== true){
			this.setFlexible(false);
			var w = width || this.config.width;
			this.el.width(w);
		}
	},
	setHeight: function(height){
		if(X.type(height) !== 'boolean' || height !== true){
			this.setFlexible(false);
			var h = height || this.config.height;
			this.el.css('min-height', 'none').height(h);
		}
	},
	getWidth: function(){
		var width = this.el.outerWidth();
		return width;
	},
	getHeight: function(){
		var height = this.el.outerHeight();
		return height;
	},
	scrollCreate: function(scroll){
		if(scroll){
			this.scroll = new iScroll(this.body.get(0), this.config.scrollConfig);
		}
	},
	scrollDestroy: function(){
		if(this.scroll){
			this.scroll.destroy();
		}
	},
	onOrientationChange: function(e){
		var me = e.data.me;
		me.fireEvent(me, 'orientationchange', []);
	},
	show: function(transition){
		if(!this.el.hasClass('ui-view-hide')){
			return;
		}

		if(this.config.floating){
			if(this.config.floating){
				var style = this.el.get(0).style;
				this.el.css({
					marginTop: -(parseInt(style.height) / 2),
					marginLeft: -(parseInt(style.width) / 2)
				});
			}
			if(this.overlay){
				this.overlay.show();
			}
		}

		this.el.removeClass('ui-view-hide');

		if(transition){
			this.el.addClass('pop in').animationComplete(function(){
				this.className = this.className.replace('pop in', '');
			});
		}	
		this.fireEvent(this, 'show', [this]);

		return this;
	},
	hide: function(transition){
		if(this.el.hasClass('ui-view-hide')){
			return;
		}

		if(transition){
			this.el.addClass('out').animationComplete(function(){
				this.className = this.className.replace('out', '') + 'ui-view-hide';
			});
		}
		else{
			this.el.addClass('ui-view-hide');
		}
		
		
		if(this.config.floating && this.overlay){
			this.overlay.hide();
		}

		this.fireEvent(this, 'hide', [this]);
		return this;
	},
	toggle: function(){
		if(this.el.hasClass('ui-view-hide')){
			this.show();
		}
		else{
			this.hide();
		}
	},
	getEl: function(){
		return this.el;
	},
	getId: function(){
		return this.el.attr('id');
	},
	getViewController: function(){
		return this.config.viewController;
	},
	setViewController: function(vc){
		if(X.type(vc) === 'string'){
			vc = X.util.ViewController.get(vc);
		}

		if(!vc){
			new Error('arguments is unknow');
		}

		vc.init(this);
		this.config.viewController = vc;
	},
	destroy: function(){
		this.el.remove();
		X.getWindow().off(X.events.orientationchange, this.onOrientationChange);

		this.fireEvent(this, 'destroy', [this]);
	},
	add: function(comps){
		var el = this.body.children('.ui-scrollview-view');
		if(el.length < 1){
			el = this.body;
		}
		comps = X.util.cm.create(el, comps);
		this.config.items = $.unique(this.config.items.concat(comps));
		this.config.items.reverse();
		
		return comps;
	},
	remove: function(index){
		this.config.items[index].destroy();
		this.config.items.remove(index);
	},
	addToolbar: function(toolbars){
		toolbars = X.util.cm.create(this.el, toolbars);
		this.config.toolbars.push(toolbars);

		return toolbars;
	},
	setFloating: function(float){
		if(float){
			this.config.floating = float;
			this.el.addClass('ui-view-floating ui-view-hide');
		}
		else{
			this.el.removeClass('ui-view-floating ui-view-hide');
		}		
		this.setOverlay(this.config.overlay);
	},
	setOverlay: function(overlay){
		if(overlay){
			if(this.config.floating){
				this.overlay = X.util.em.get().addClass('ui-overlay');
				X.getBody().append(this.overlay);
				this.overlay.bind('vclick', { me: this }, function(e){
					var me = e.data.me;
					me.hide();
				});
			}
			else{
				if(this.overlay){
					this.overlay.remove();
				}
			}
		}
		else{
			if(this.overlay){
				this.overlay.remove();
			}
		}
		
		this.config.overlay = overlay;
	},
	createHtmlComponent: function(){
		var	views = this.el.find('[data-role="view"]');
		views.each(function(){
			var el = $(this);

			var dataset = this.dataset,
				config = { }, attr, val;
			
			for(attr in dataset){
				if(dataset[attr] === "true" 
					|| dataset[attr] === "false"
					|| parseFloat(dataset[attr])
					|| /^\{(.*?)\}$/.test(dataset[attr])){
					val = JSON.parse(dataset[attr]);
				}
				else{
					val = dataset[attr];
				}
				
				config[attr] = val;
			}
			
			config.el = el;
			config.autoRender = true;

			new X.View(config);
		});

		var panels = this.el.find('[data-role="view"][data-panels="true"]');
		panels.each(function(){
			var id = this.id,
				view = X.util.cm.get(id),
				panels = { }, left, right;

			if(!view.scroll){
				left = view.body.children('[data-role="view"][data-panels="left"]');
				right = view.body.children('[data-role="view"][data-panels="right"]');

				if(left.length > 0){
					panels.left = X.util.cm.get(left.get(0).id);
				}

				if(right.length > 0){
					panels.right = X.util.cm.get(right.get(0).id);
				}
			}

			view.panelsCreate(panels);
		});

		var	comps = this.el.find('[data-role]').not('[data-role="view"]');
		var charts = [];
		
		comps.each(function(){
			var el = $(this),
				comp = el.data('role');

			var dataset = this.dataset,
				config = { }, attr, val;
			
			for(attr in dataset){
				if(dataset[attr] === "true" 
					|| dataset[attr] === "false"
					|| parseFloat(dataset[attr])
					|| /^\{(.*?)\}$/.test(dataset[attr])){
					val = JSON.parse(dataset[attr]);
				}
				else{
					val = dataset[attr];
				}
				
				config[attr] = val;
			}
			
			config.el = el;
			config.autoRender = true;

			if(comp === 'toolbar'){
				el.parents('.ui-view').eq(0).prepend(el);
				config.title = el.html();
				el.empty();
				new X.ui.Toolbar(config);
			}

			if(comp === 'tabs'){
				var tabs = el.children('[data-role="view"]'),
					items = [ ], titles = [ ];
				
				tabs.each(function(){
					items.push(X.util.cm.get(this.id));
					titles.push(this.dataset.title);
				});

				config.items = items;
				config.titles = titles;
				
				new X.ui.Tabs(config);
			}

			if(comp === 'carousel'){
				var views = el.children('[data-role="view"]'),
					items = [ ];
				
				views.each(function(){
					items.push(X.util.cm.get(this.id));
				});

				config.items = items;
				new X.ui.Carousel(config);
			}

			if(comp === 'listview'){
				new X.ui.ListView(config);
			}

			if(comp === 'accordion'){
				var views = el.children('[data-role="view"]'),
					items = [ ], titles = [ ];

				views.each(function(i){
					items.push(X.util.cm.get(this.id));
					titles.push(this.dataset.title);
				});

				config.items = items;
				config.titles = titles;

				new X.ui.Accordion(config);
			}

			if(comp === 'textbox'){
				new X.ui.TextBox(config);
			}

			if(comp === 'slider'){
				new X.ui.Slider(config);
			}

			if(comp === 'progress'){
				new X.ui.Progressbar(config);
			}

			if(comp === 'spinner'){
				new X.ui.Spinner(config);
			}

			if(comp === 'switchbox'){
				new X.ui.SwitchBox(config);
			}

			if(comp === 'checkbox'){
				new X.ui.CheckBox(config);
			}
			
			if(comp === 'radiobox'){
				new X.ui.RadioBox(config);
			}
			
			if(comp === 'selectbox'){
				new X.ui.SelectBox(config);
			}
			
			if(comp === 'layoutview'){
			    var east = el.children('[data-regions="east"]').get(0),
			        west = el.children('[data-regions="west"]').get(0),
			        south = el.children('[data-regions="south"]').get(0),
			        nouth = el.children('[data-regions="nouth"]').get(0),
			        center = el.children('[data-regions="center"]').get(0);

                east = X.util.cm.get(east ? east.id : null);
                if(east){
                    east.setWidth(false);
                }
                
                west = X.util.cm.get(west ? west.id : null);
                if(west){
                    west.setWidth(false);
                }
                
                south = X.util.cm.get(south ? south.id : null);
                if(south){
                    south.setHeight(false);
                }
                
                nouth = X.util.cm.get(nouth ? nouth.id : null);
                if(nouth){
                    nouth.setHeight(false);
                }
                
                center = X.util.cm.get(center ? center.id : null);

                config.regions = { };
			    config.regions.east = east;
			    config.regions.west = west;
			    config.regions.south = south;
			    config.regions.nouth = nouth;
			    config.regions.center = center;

			    new X.ui.LayoutView(config);
			}
		});

		var	formView = this.el.find('[data-role="formview"]');
		formView.each(function(){
			var el = $(this),
				items = [],
				selector = '[data-role="textbox"],' +
					'[data-role="slider"],' +
					'[data-role="spinner"],' + 
					'[data-role="switchbox"],' +
					'[data-role="progress"]';
			
			var dataset = this.dataset,
				config = { }, val, panels = { };
			
			for(attr in dataset){
				if(dataset[attr] === "true" 
					|| dataset[attr] === "false"
					|| parseFloat(dataset[attr])
					|| /^\{(.*?)\}$/.test(attr)){
					val = JSON.parse(dataset[attr]);
				}
				else{
					val = dataset[attr];
				}
				
				config[attr] = val;
			}

			el.children(selector).each(function(){
				items.push(X.util.cm.get(this.id));
			});

			config.el = el;
			config.items = items;
			config.autoRender = true;

			new X.ui.FormView(config);
		});
	}	
});

X.util.cm.addCString('view', X.View);
X.ui.Accordion = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			titles: [],
			items: [],
			scroll: false,
			activeIndex: 0
		};
		X.apply(this.config, config);
		X.ui.Accordion.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.Accordion.base.render.call(this);
		this.el.addClass('ui-accordion');
		
		this.createItems();
		this.createTitle();

		views = this.body.on('vclick', '.ui-accordion-views > .ui-accordion-title', { me: this }, function(e){
			var me = e.data.me;
			
			var index = me.body.children('.ui-accordion-views').index($(this).parent());
			me.change(index);
			return false;
		});
	},
	createItems: function(){
		this.body.children('.ui-view').each(function(){
			var div = X.util.em.get()
				.addClass('ui-accordion-views ui-accordion-close');
			
			$(this).wrap(div);
		});

		var items = this.body.children('.ui-accordion-views');
		items.eq(this.config.activeIndex)
			.removeClass('ui-accordion-close')
			.addClass('ui-accordion-open');

		var me = this;
		this.config.items.forEach(function(view, i){
			if(me.config.activeIndex !== i){
				view.hide();
			}
		});
	},
	createTitle: function(){
		var views = this.body.children('.ui-accordion-views'),
			titles = this.config.titles;
		views.each(function(i){
			if(titles[i]){
				div = X.util.em.get()
					.addClass('ui-accordion-title')
					.html(titles[i]);
				
				$(this).prepend(div);
			}
		});

		titles = null;		
	},
	change: function(index){
		if(this.config.activeIndex === index){
			return;
		}
		
		this.body.children('.ui-accordion-views')
			.removeClass('ui-accordion-open')
			.addClass('ui-accordion-close')
			.eq(index).addClass('ui-accordion-open')
			.removeClass('ui-accordion-close');


		this.config.items.forEach(function(view, i){
			if(index !== i){
				view.hide();
			}
			else{
				view.show();
			}
		});
		
		this.config.activeIndex = index;

		this.fireEvent(this, 'change', [this]);
	},
	append: function(comp, title){
		var div = X.util.em.get()
				.addClass('ui-accordion-views ui-accordion-close');

		var titleDiv = X.util.em.get()
					.addClass('ui-accordion-title')
					.html(title);

		this.body.append(div);
		comp = X.util.cm.create(div, [comp]);
		div.prepend(titleDiv);

		this.config.activeIndex = null;

		return [comp[0], title];
	},
	prepend: function(comp, title){
		var div = X.util.em.get()
				.addClass('ui-accordion-views ui-accordion-close');

		var titleDiv = X.util.em.get()
					.addClass('ui-accordion-title')
					.html(title);

		this.body.prepend(div);
		comp = X.util.cm.create(div, [comp]);
		div.prepend(titleDiv);

		this.config.activeIndex = null;

		return [comp[0], title];
	},
	remove: function(index){
		this.body.children('.ui-accordion-views').eq(index).remove();
		this.config.items = this.config.items.filter(function(el, i){
			return (index !== i);
		});

		this.config.titles = this.config.titles.filter(function(el, i){
			return (index !== i);
		});
		this.config.activeIndex = null;
	},
	removeAll: function(){
		this.body.empty();
		this.config.activeIndex = null;
	},
	changeTitle: function(title, index){
		index = index || 0;
		var view = this.body.children('.ui-accordion-views')
			.eq(index);
		
		view
			.children('.ui-accordion-title')
			.html(title);
		
		this.config.titles[index] = title;
	},
	getItem: function(index){
		return this.config.items[index];
	}
});

X.util.cm.addCString('accordion', X.ui.Accordion);
X.ui.Carousel = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			direction: 'x',
			scroll: false,
			activeIndex: 0,
			duration: 200
		};
		X.apply(this.config, config);
		X.ui.Carousel.base.initialize.call(this, this.config);

		this.endPos = 0;
		this.dragging = false;
		this.activeIndex = this.config.activeIndex;
	},
	render: function(){
		X.ui.Carousel.base.render.call(this);
		this.el.addClass('ui-carousel');
		this.carouselBody = X.util.em.get().addClass('ui-carousel-body');

		var views = this.body.children('.ui-view').addClass('ui-carousel-views'),
			activeIndex = this.activeIndex,
			style = this.carouselBody.get(0).style,
			pos = 0, 
			itemSize = 0;
		
		if(views.length > 0){
			views.wrapAll(this.carouselBody);
		}
		else{
			this.el.append(this.carouselBody);
		}

		this.carouselBody = this.body.children('.ui-carousel-body');
		
		if(this.config.direction === 'x'){
			this.carouselBody.addClass('ui-carousel-horizontal');
		}
		else{
			this.carouselBody.addClass('ui-carousel-vertical');
		}

		if(this.config.direction === 'x'){
		    itemSize = this.getWidth();
		    pos = (-1 * activeIndex) * itemSize;
		    
			style.webkitTransform = 'translateX(' + (pos) + 'px)';
			style.msTransform = 'translateX(' + (pos) + 'px)';
			style.transform = 'translateX(' + (pos) + 'px)';
		}
		else{
		    itemSize = this.getHeight();
		    pos = (-1 * activeIndex) * itemSize;
		    
			style.webkitTransform = 'translateY(' + (pos) + 'px)';
			style.msTransform = 'translateY(' + (pos) + 'px)';
			style.transform = 'translateY(' + (pos) + 'px)';
		}

		this.carouselBody.bind(X.events.start, {me: this}, this.onStart);
		
		X.getWindow().on(X.events.orientationchange, { me: this }, this.resize);
	},
	resize: function(e){
		var me = e.data.me,
		    endPos = me.endPos,
		    style;
		    
		if(endPos === 0){
		    return false;
		}
		
        style = me.carouselBody.get(0).style;

        style.webkitTransitionDuration = "0";
		if(me.config.direction === 'x'){
            endPos = (me.getWidth() * me.activeIndex) * -1;

            style.webkitTransform = 'translateX(' + endPos + 'px)';
		    style.msTransform = 'translateX(' + endPos + 'px)';
			style.transform = 'translateX(' + endPos + 'px)';
		}
		else{
		    endPos = (me.getHeight() * me.activeIndex) * -1;

            style.webkitTransform = 'translateY(' + endPos + 'px)';
		    style.msTransform = 'translateY(' + endPos + 'px)';
			style.transform = 'translateY(' + endPos + 'px)';
		}
		
		me.endPos = endPos;
		return false;
	},
	onStart: function(e){
		var me = e.data.me;

		var pageX = e.originalEvent.touches ? 
				e.originalEvent.touches[0].pageX : e.originalEvent.pageX,
			pageY = e.originalEvent.touches ? 
				e.originalEvent.touches[0].pageY : e.originalEvent.pageY;

		me.startPageX = pageX;
		me.startPageY = pageY;
		me.dragging = true;

		me.carouselBody.on(X.events.move, { me: me }, me.onMove);
		me.carouselBody.on(X.events.end, { me: me }, me.onEnd);
	},
	onMove: function(e){
		var me = e.data.me;
		
		if(me.dragging){
			var pageX = e.originalEvent.touches ? 
					e.originalEvent.touches[0].pageX : e.originalEvent.pageX;

			var	pageY = e.originalEvent.touches ? 
					e.originalEvent.touches[0].pageY : e.originalEvent.pageY;

			var style = me.carouselBody.get(0).style;

			style.webkitTransitionDuration = "0";
			if(me.config.direction === 'x'){
				me.movePos  = (pageX - me.startPageX) + (-1 * me.activeIndex) * me.getWidth();
				me.moveLimit = Math.abs(pageX - me.startPageX);

				style.webkitTransform = 'translateX(' + me.movePos + 'px)';
				style.msTransform = 'translateX(' + me.movePos + 'px)';
				style.transform = 'translateX(' + me.movePos + 'px)';
			}
			else{
				me.movePos  = (pageY - me.startPageY) + (-1 * me.activeIndex) * me.getHeight();
				me.moveLimit = Math.abs(pageY - me.startPageY);

				style.webkitTransform = 'translateY(' + me.movePos + 'px)';
				style.msTransform = 'translateY(' + me.movePos + 'px)';
				style.transform = 'translateY(' + me.movePos + 'px)';
			}
		}
		
		return false;
	},
	onEnd: function(e){
		var me = e.data.me, 
			endPos = 0,
			style = me.carouselBody.get(0).style;

		if(me.moveLimit > 30){
			if(me.movePos > 0){
				me.activeIndex = 0;
			}
			else{
				if(Math.abs(me.movePos) > Math.abs(me.endPos)){
					me.activeIndex++;
					if(me.activeIndex >= (me.config.items.length - 1)){
						me.activeIndex = me.config.items.length - 1;
					}
				}
				else{
					me.activeIndex--;
				}
			}

			if(me.activeIndex === 0){
				endPos = 0;
			}
			else if(me.activeIndex > 0){
				if(me.config.direction === 'x'){
					endPos = (me.getWidth() * me.activeIndex) * -1;
				}
				else{
					endPos = (me.getHeight() * me.activeIndex) * -1;
				}
			}
			me.endPos = endPos;
		}
		else{
			endPos = me.endPos;	
		}
		
		style.webkitTransitionDuration = me.config.duration + 'ms';
		if(me.config.direction === 'x'){
			style.webkitTransform = 'translateX(' + endPos + 'px)';
			style.msTransform = 'translateX(' + endPos + 'px)';
			style.transform = 'translateX(' + endPos + 'px)';
		}
		else{
			style.webkitTransform = 'translateY(' + endPos + 'px)';
			style.mozTransform = 'translateY(' + endPos + 'px)';
			style.transform = 'translateY(' + endPos + 'px)';
		}

		me.fireEvent(me, 'change', [me, me.activeIndex, me.getActiveView()]);

		me.carouselBody.off(X.events.move, me.onMove);
		me.carouselBody.off(X.events.end, me.onEnd);
		
		me.dragging = false;
	},
	getActiveView: function(){
		return this.config.items[this.activeIndex];
	},
	append: function(comp){
		var comps = X.util.cm.create(this.carouselBody, [comp]);
		this.config.items.push(comps[0]);
		comps[0].addClass('ui-carousel-views');
		
		return comps[0];
	},
	remove: function(index){
		this.config.items[index].destroy();
		this.config.items.remove(index);
	},
	destroy: function(){
		X.ui.Carousel.base.destroy.call(this);
		X.getWindow().off(X.events.orientationchange, { me: this }, this.resize);
	},
	next: function(){
		var index = this.activeIndex + 1,
			style = this.carouselBody.get(0).style;

		style.webkitTransitionDuration = '200ms';
		if(this.config.direction === 'x'){
			style.webkitTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
			style.msTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
		}
		else{
			style.webkitTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
			style.msTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
		}

		this.activeIndex = index;
		this.fireEvent(this, 'change', [this, this.activeIndex, this.getActiveView()]);
	},
	prev: function(){
		var index = this.activeIndex - 1,
			style = this.carouselBody.get(0).style;

		style.webkitTransitionDuration = '200ms';
		if(this.config.direction === 'x'){
			style.webkitTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
			style.msTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
		}
		else{
			style.webkitTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
			style.msTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
		}

		this.activeIndex = index;
		this.fireEvent(this, 'change', [this, this.activeIndex, this.getActiveView()]);
	}
});

X.util.cm.addCString('carousel', X.ui.Carousel);
X.ui.ListView = X.extend(X.View, {
	initialize: function(config){
		this.config = {
		    activeRow: true,
			scrollConfig: {
				direction: 'y'
			}
		};
		X.apply(this.config, config);
		X.ui.ListView.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.ListView.base.render.call(this);
		this.el.addClass('ui-listview');

		this.ul = this.body.children('.ui-scrollview-view').children('ul');
		this.ul.children('li').addClass('ui-listview-item');

		this.ul.on('vclick', 'li', {me: this}, this.rowClick);
		this.scrollEvent();
	},
	scrollEvent: function(){
		var me = this;
		this.scroll.options.onScrollStart = function(){
			
		};

		this.scroll.options.onScrollMove = function(){
			
		}

		this.scroll.options.onAnimationDoing = function(){
			
		};

		this.scroll.options.onScrollEnd = function(){
			
		};
	},
	rowClick: function(e){
		var me = e.data.me;
		if(me.config.activeRow){
		    me.ul.children('li').removeClass('active');
		    this.className = this.className + ' active';
		}
		
		me.fireEvent(me, 'rowclick', [me, this]);
	},
	append: function(rows){
		var type = X.type(rows);
		if(type === 'string'){
			rows = $(rows).addClass('ui-listview-item');
		}
		else if(type === 'jquery'){
			rows.addClass('ui-listview-item');
		}

		this.ul.append(rows);
		this.scrollRefresh();
	},
	prepend: function(rows){
		var type = X.type(rows);
		if(type === 'string'){
			rows = $(rows).addClass('ui-listview-item');
		}
		else if(type === 'jquery'){
			rows.addClass('ui-listview-item');
		}

		this.ul.prepend(rows);
		this.scrollRefresh();
	},
	replaceWith: function(index, row){
		if(X.type(index) !== 'number'){
			throw new Error('arguments must be number ');
		}

		var type = X.type(row);
		if(type === 'string'){
			row = $(row).addClass('ui-listview-item');
		}
		else if(type === 'jquery'){
			row.addClass('ui-listview-item');
		}
	
		this.ul.children('li:eq(' + index + ')').replaceWith(row);
	},
	remove: function(index){
		if(X.type(index) !== 'number'){
			throw new Error('arguments must be number ');
		}
		this.ul.children('li:eq(' + index + ')').remove();
		this.scrollRefresh();
	},
	removeAll: function(){
	    this.ul.children('li').remove();
	    this.scrollRefresh();
	}
});

X.util.cm.addCString('listview', X.ui.ListView);
X.ui.Tabs = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			position: 'top',
			activeIndex: 0,
			titles: [],
			autoSize: true,
			transition: 'slide',
			scroll: false,
			items: []
		};
		X.apply(this.config, config);
		X.ui.Tabs.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.Tabs.base.render.call(this);
		this.el.addClass('ui-tabs');

		this.createTabBar();
		
		var activeIndex = this.config.activeIndex;
		
		this.tabBar
			.children('.ui-tabs-bar-items')
			.eq(activeIndex)
			.addClass('ui-tabs-bar-items-active');
		
		this.activeView = this.config.items[activeIndex];
		for(var i=0,len=this.config.items.length; i<len; i++){
			if(i === activeIndex){
				continue;
			}

			this.config.items[i].hide();
		}
	},
	createTabBar: function(){
		this.tabBar = X.util.em.get()
			.addClass('ui-tabs-bar ui-tabs-bar-' + this.config.position);
		
		var items = this.config.items,
			len = items.length,
			o, html = '';

		for(var i=0; i<len; i++){
			html += '<div class="ui-tabs-bar-items"><span>' + items[i].config.title + '</span></div>'; 
		}
		this.tabBar.html(html);
		
		if(this.config.position === 'top'){
			this.el.prepend(this.tabBar);
		}
		else{
			this.el.append(this.tabBar);
		}
		
		this.tabBar.on('vclick', '.ui-tabs-bar-items', { me: this }, this._click);
	},
	_click: function(e){
		var me = e.data.me,
			bar = $(this), parent = bar.parent(),
			index = parent.find('.ui-tabs-bar-items').index(bar);
		
		parent.find('.ui-tabs-bar-items').removeClass('ui-tabs-bar-items-active');
		bar.addClass('ui-tabs-bar-items-active');
		
		me.change(index);
		return false;
	},
	change: function(index){
		var fromView = this.getActiveView(),
			toView = this.config.items[index];
			
		if(fromView === toView){
			return;
		}	
	
		if(fromView.el.nextAll('#' + toView.getId()).length > 0){
			this.right(fromView, toView);
		}
		else{
			this.left(fromView, toView);
		}
	},
	transitionStart: function(fromView, toView, transition, reverse){
		var deferred = new $.Deferred();

		function transitionHandler(fromView, toView, transition, reverse){
			var viewIn = function(){
				var tel = toView.getEl();
				tel.addClass(transition + ' in ' + reverse + ' ui-transitioning').removeClass('ui-view-hide');

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
				fel.removeClass(transition + ' out ' + reverse + ' ui-transitioning');
				
				done();
			},
			done = function(){
				deferred.resolve(this, [fromView, toView]);

				fromView = null, toView = null, transition = null, reverse = null;
			};

			viewIn();
		}

		transitionHandler(fromView, toView, transition, reverse);
		
		return deferred;
	},
	setActiveView: function(view){
		this.activeView = view;
	},
	getActiveView: function(){
		return this.activeView;
	},
	getActiveViewIndex: function(){
		var active = this.getActiveView();
		for(var i=0; i<this.config.items.length; i++){
			if(active === this.config.items[i]){
				return i;
			}
		}
	},
	getView: function(index){
		return this.config.items[index];
	},
	right: function(fromView, toView){
		this.fireEvent(this, 'beforechange', [this, this.getActiveView(), this.getActiveViewIndex(), toView]);

		var promise = this.transitionStart(fromView, toView, this.config.transition, ''), me = this;
		promise.done(function(){
			fromView.hide();
			me.setActiveView(toView);

			me.fireEvent(me, 'afterchange', [me.getActiveView(), me.getActiveViewIndex(), fromView]);
			me = null, fromView = null, toView = null;
		});
	},
	left: function(fromView, toView){
		this.fireEvent(this, 'beforechange', [this, this.getActiveView(), this.getActiveViewIndex(), toView]);

		var promise = this.transitionStart(fromView, toView, this.config.transition, 'reverse'), me = this;
		promise.done(function(){
			fromView.hide();
			me.setActiveView(toView);

			me.fireEvent(me, 'afterchange', [me.getActiveView(), me.getActiveViewIndex(), fromView]);
			me = null, fromView = null, toView = null;
		});
	},
	append: function(comp, title){
		comp = X.util.cm.create(this.body, [comp]);
		this.config.items.push(comp[0]);
		comp[0].hide();

		var titleDiv = X.util.em.get()
			.addClass('ui-tabs-bar-items')
			.html('<span>' + title + '</span>');

		this.tabBar.append(titleDiv);
		return [comp[0], title];
	},
	prepend: function(comp, title){
		comp = X.util.cm.create(this.body, [comp]);
		this.config.items = comp.concat(this.config.items);
		comp[0].hide();
		this.body.prepend(comp[0].el);

		var titleDiv = X.util.em.get()
			.addClass('ui-tabs-bar-items')
			.html('<span>' + title + '</span>');

		this.tabBar.prepend(titleDiv);
		return [comp[0], title];
	},
	remove: function(index){
		this.config.items[index].destroy();
		this.config.items.remove(index);

		this.tabBar.children('.ui-tabs-bar-items').eq(index).remove();
	}
});
X.util.cm.addCString('tabs', X.ui.Tabs);
X.ui.Toolbar = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
			position: 'top',
			title: null
		};
		X.apply(this.config, config);
		
		var listener = { };
		if(this.config.listener){
			listener = this.config.listener;
		}
		X.ui.Toolbar.base.initialize.call(this, listener);
		
		if(!this.config.el){
			this.config.el = {
				tag: 'div',
				id: this.config.id
			};
		}
		this.el = X.util.em.get(this.config.el);
		
		if(!X.util.cm.get(this.el.get(0).id)){
			X.util.cm.set(this.el.get(0).id, this);
		}

		if(this.config.autoRender){
			this.render();
		}
	},
	render: function(){
		this.fireEvent(this, 'beforerender', [this]);
		
		this.el.addClass('ui-toolbar ' + this.config.position);

		this.inner = X.util.em.get()
			.addClass('ui-toolbar-inner');

		this.el.append(this.inner);

		this.setTitle(this.config.title);
		
		var parent = this.el.parent();
		if(this.config.position === 'bottom'){
			parent.append(this.el);
		}
		else{
			parent.prepend(this.el);
		}
		
		this.fireEvent(this, 'afterrender', [this]);
	},
	setTitle: function(title){
		if(!this.title){
			this.title = X.util.em.get().
				addClass('ui-toolbar-title');

			this.inner.append(this.title);
			this.title.html(title);
			return;
		}
		this.title.html(title);
		this.fireEvent(this, 'changetitle', [this, title]);
	},
	getTitle: function(){
		if(this.title){
			return this.title.text();
		}
	},
	destroy: function(){
		this.el.remove();
	}
});

X.util.cm.addCString('toolbar', X.ui.Toolbar);
X.ui.LayoutView = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			resize: true,
			minSize: {
				west: 100,
				east: 100,
				south: 50,
				nouth: 50
			},
			maxSize: {
				west: 400,
				east: 400,
				south: 150,
				nouth: 150
			},
			size: {
				west: 200,
				east: 200,
				south: 100,
				nouth: 100
			},
			regions: null,
			scroll: false
		};
		X.apply(true, this.config, config);
		
		this.resizeing = false;
		this.region = null;
		this.spliters = { };
		this.currentResizeing = null;

		X.ui.LayoutView.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.LayoutView.base.render.call(this);
		this.el.addClass('ui-layout');
		
		this.contain = X.util.em.get().addClass('ui-layout-contain');
		this.body.append(this.contain);
		
		if(this.config.minSize.west > this.config.size.west){
		    this.config.size.west = this.config.minSize.west;
		}
		
		if(this.config.minSize.east > this.config.size.east){
		    this.config.size.east = this.config.minSize.east;
		}

		if(this.config.minSize.south > this.config.size.south){
		    this.config.size.south = this.config.minSize.south;
		}
		
		if(this.config.minSize.nouth > this.config.size.nouth){
		    this.config.size.nouth = this.config.minSize.nouth;
		}

		this.createView();
		
		this.maxWidth = this.el.width();
		this.maxHeight = this.el.height();

		for(var attr in this.config.regions){
			if(attr === 'center'){
				continue;
			}
			this.createSpliter(attr);
		}
		
		if(X.platform.hasTouch){
			X.getWindow().bind('orientationchange', { me: this }, this.orientationChange);
		}
		else{
			X.getWindow().bind('resize', { me: this }, this.orientationChange);
		}
	},
	orientationChange: function(e){
	    var me = e.data.me;
	    me.resizeSplitter();
	    me.fire(me, 'orientationchange', [me]);
	},
	createView: function(){
		var hViews = [], vViews = [], 
			regions = this.config.regions;
	
		for(var attr in regions){
			if(attr === 'west' || attr === 'east'){
				regions[attr].config.width = this.config.size[attr];
				regions[attr].config.height = false;
				regions[attr].config.flexible = false;

				hViews.push(regions[attr]);
			}

			this[attr] = regions[attr];
			
			if(attr === 'south' || attr === 'nouth'){
				regions[attr].config.width = false;
				regions[attr].config.height = this.config.size[attr];
				regions[attr].config.flexible = false;
				
				vViews.push(regions[attr]);
			}
		}

		if(regions.center){
			hViews.push(regions.center);
		}

		X.util.cm.create(this.body, vViews);
		if(regions.nouth){
			regions.nouth.el.insertBefore(this.contain);
		}
		
		X.util.cm.create(this.contain, hViews);
		if(regions.east){
			regions.east.el.insertAfter(regions.center.el);
		}
		
		for(var attr in regions){
			regions[attr].el.addClass('ui-layout-items ' + attr);
		}
	},
	createSpliter: function(region){
		var position,
		    direction,
		    div = X.util.em.get()
			    .addClass('ui-layout-spliter ' + region);
			
		if(region === 'west'){
		    position = 'left';
		    direction = 'x';
		}
		else if(region === 'east'){
		    position = 'right';
		    direction = 'x';
		}
		else if(region === 'south'){
		    position = 'bottom';
		    direction = 'y';
		}
		else{
		    position = 'top';
		    direction = 'y';
		}
		
		this.resizeSplitter();
		
		div.css(position, this.config.size[region] - 10);

		this.spliters[region] = div;
		this.el.append(div);

		new X.util.Draggable({
		    el: div,
		    direction: direction,
		    scope: this,
		    listener: {
		        start: this.onStart,
		        move: this.onMove,
		        end: this.onEnd
		    },
		    constrain: this.el
		});
		
		
		
		this[region].el.on('webkitTransitionEnd', {me: this}, function(e){
		    var me = e.data.me;
		    me.resizeSplitter();
            return false;
        });
	},
	resizeSplitter: function(){
	    var west = this.spliters.west,
	        east = this.spliters.east;

	    if(west){
	        west.css({
                height: this.west.getHeight(),
                top: this.west.el.offset().top
            });
	    }
	    
	    if(east){
	        east.css({
                height: this.east.getHeight(),
                top: this.east.el.offset().top
            });
	    }
	    
	},
	onStart: function(drag){
	    var currentResizeing;
	    if(drag.el.hasClass('west')){
	        currentResizeing = 'west';
	    }
	    else if(drag.el.hasClass('east')){
	        currentResizeing = 'east';
	    }
	    else if(drag.el.hasClass('nouth')){
	        currentResizeing = 'nouth';
	    }
	    else{
	        currentResizeing = 'south';
	    }
	    this.currentResizeing = currentResizeing;
	},
	onMove: function(drag, region){
	    if(this.currentResizeing === 'west'){
	        if(region.r <= this.config.minSize.west || region.r >= this.config.maxSize.west){
	           return false;
	        }
	    }
	    else if(this.currentResizeing === 'east'){
            var l = this.getWidth() - region.l;
	        if(l <= this.config.minSize.east || l >= this.config.maxSize.east){
				return false;
			}
	    }
	    else if(this.currentResizeing === 'nouth'){
	        if(region.b <= this.config.minSize.nouth || region.b >= this.config.maxSize.nouth){
				return false;
			}
	    }
	    else {
	        var t = this.getHeight() - region.t;
	        if(t <= this.config.minSize.south || t >= this.config.maxSize.south){
				return false;
			}
	    }
    },
	onEnd: function(drag, region){
	    var size = 0,
	        resizeView = null;

        if(this.currentResizeing === 'west'){
	        if(region.r <= this.config.minSize.west){
	           size = this.config.minSize.west;
	        }
	        else if(region.r >= this.config.maxSize.west){
	            size = this.config.maxSize.west;
	        }
	        else{
	            size = region.r;
	        }
	        this.west.setWidth(size);
	        resizeView = this.west;
	    }
	    else if(this.currentResizeing === 'east'){
	        var l = this.getWidth() - region.l;
            if(l <= this.config.minSize.east){
	           size = this.config.minSize.east;
	        }
	        else if(l >= this.config.maxSize.east){
	            size = this.config.maxSize.east;
	        }
	        else{
	            size = l;
	        }
	        this.east.setWidth(size);
	        resizeView = this.east;
	    }
	    else if(this.currentResizeing === 'nouth'){
	        if(region.b <= this.config.minSize.nouth){
	           size = this.config.minSize.nouth;
	        }
	        else if(region.b >= this.config.maxSize.nouth){
	            size = this.config.maxSize.nouth;
	        }
	        else{
	            size = region.b;
	        }
	        this.nouth.setHeight(size);
	        resizeView = this.nouth;
	    }
	    else {
	        var t = this.getHeight() - region.t;
            if(t <= this.config.minSize.south){
	           size = this.config.minSize.south;
	        }
	        else if(t >= this.config.maxSize.south){
	            size = this.config.maxSize.south;
	        }
	        else{
	            size = t;
	        }
	        this.south.setHeight(size);
	        resizeView = this.south;
        }

	    this.fireEvent(this, 'resize', [this, resizeView]);
	}
});
X.ui.Form = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
			placeholder: 'please..',
			required: false,
			disabled: false,
			defaultValue: null,
			label: null
		};
		X.apply(this.config, config);
			
		var listener = {};
		if(this.config.listener){
			listener = this.config.listener;
		}
		X.ui.Form.base.initialize.call(this, listener);

		if(!this.config.el){
			this.config.el = {
				tag: 'div',
				id: this.config.id
			};
		}
		
		this.el = X.util.em.get(this.config.el);
		
		if(!X.util.cm.get(this.el.get(0).id)){
			X.util.cm.set(this.el.get(0).id, this);
		}
		
		if(this.config.autoRender){
			this.render();
		}
	},
	render: function(){
		this.fireEvent(this, 'beforerender', [this]);
		this.el.addClass('ui-form-box');
		
		if(this.config.label){
			this.labelCreate();
		}
		
		if(this.config.style){
			this.el.css(this.config.style);
		}
		
		this.formcontin = X.util.em.get()
			.addClass('ui-form-container');
		
		this.el.append(this.formcontin);

		if(this.config.disabled){
			this.disabled();
		}
	},
	getName: function(){
		return this.config.name || this.el.get(0).id;
	},
	setValue: function(val){
		if (this.form.attr('disabled')) {
			return;
		}
		this.form.val(val);
		this.fireEvent(this, 'setvalue', [this, val]);
	},
	getValue: function(){
		return this.form.val();
	},
	labelCreate: function(){
		this.formlabel = X.util.em.get()
			.addClass('ui-form-label').html(this.config.label);
		
		this.el.append(this.formlabel);
	},
	show: function(){
		this.el.show();
		this.fireEvent(this, 'show', [this]);
	},
	hide: function(){
		this.el.hide();
		this.fireEvent(this, 'hide', [this]);
	},
	toggle: function(){
		if(this.el.css('display') !== 'none'){
			this.hide();
		}
		else{
			this.show();
		}
	},
	getEl: function(){
		return this.el;
	},
	getId: function(){
		return this.el.attr('id');
	},
	disabled: function(){
		this.el.addClass('ui-disabled');
		this.form.attr('disabled', true);
		this.fireEvent(this, 'disabled', [this]);
	},
	enabled: function(){
		this.el.removeClass('ui-disabled');
		this.form.attr('disabled', false);
		this.fireEvent(this, 'enabled', [this]);
	},
	destroy: function(){
		this.el.remove();
	}
});
X.ui.FormView = X.extend(X.View, {
	initialize: function(config){
		this.config = {	};
		X.apply(this.config, config);
		X.ui.FormView.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.FormView.base.render.call(this);
	},
	serialize: function(){
		return $.param(this.getJSON());
	},
	getJSON: function(){
		var params = { },
			items = this.config.items,
			len = items.length;
		
		for(var i=0; i<len; i++){
			params[items[i].getName()] = items[i].getValue();
		}

		return params;
	}
});
X.ui.TextBox = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			type: 'text'
		};
		X.apply(this.config, config);
		X.ui.TextBox.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.TextBox.base.render.call(this);

		this.el.addClass('ui-textbox');
		this.formCreate();
		
		this.form.bind('focus keypress blur keydown keyup', {me: this}, this.elementEvent);
		
		this.fireEvent(this, 'afterrender', [this]);
	},
	formCreate: function(){
		this.form = X.util.em.get({
			tag: 'input',
			type: this.config.type,
			'class': 'ui-text-input',
			placeholder: this.config.placeholder,
			disabled: this.config.disabled,
			value: this.config.defaultValue
		});
		this.formcontin.append(this.form);
	},
	setType: function(type){
		this.form.prop('type', type);
	},
	setPlaceholder: function(placeholder){
		this.config.placeholder = placeholder;
		this.form.attr('placeholder', placeholder);
	},
	elementEvent: function(e){
		var me = e.data.me,
			val = me.getValue(),
			type =  e.type;

		me.fireEvent(me, type, [me, val, e]);
	}
});

X.util.cm.addCString('textbox', X.ui.TextBox);
X.ui.Slider = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			min: 0,
			max: 100,
			step: 1,
			defaultValue: 50,
			direction: 'x',
			style: { },
			subhandle: false
		};
		X.apply(this.config, config);
		X.ui.Slider.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.Slider.base.render.call(this);
		
		this.el.addClass('ui-slider ui-slider-' + this.config.direction);
		this.formCreate();
		this.handleCreate();
		this.subHandleCreate();

		if(this.config.disabled){
			this.disabled();
		}
		
		this.dragging = false;
		this.handle.bind( X.events.start, {me: this}, function(e){
			var me = e.data.me,
				el = me.el;
			
			if(el.hasClass('ui-disabled')){
				return false;
			}
			
			me.dragging = true;
			me.subdragging = false;
			

			X.getDoc().on(X.events.move, {me: me}, me.onMove);
			X.getDoc().on(X.events.end, {me: me}, me.onEnd);
			return false;
		});

		
		if(this.subhandle){
			this.subhandle.bind( X.events.start, {me: this}, function(e){
				var me = e.data.me,
					el = me.el;
				
				if(el.hasClass('ui-disabled')){
					return false;
				}

				me.dragging = true;
				me.subdragging = true;

				X.getDoc().on(X.events.move, {me: me}, me.onMove);
				X.getDoc().on(X.events.end, {me: me}, me.onEnd);
				return false;
			});
		}

		this.setValue(this.config.defaultValue);
		this.fireEvent(this, 'afterrender', [this]);
	},
	onMove: function(e){
		var me = e.data.me;
		if ( me.dragging ) {
			me.setValue( e );
			return false;
		}
	},
	onEnd: function(e){
		var me = e.data.me;
		if ( me.dragging ) {
			me.dragging = false;
			var val = me.getValue();
			me.fireEvent(me, 'change', [val]);
			return false;
		}

		X.getDoc().off(X.events.move, me.onMove);
		X.getDoc().off(X.events.end, me.onEnd);
	},
	formCreate: function(){
		this.form = X.util.em.get({
			tag: 'input',
			type: 'range',
			'class': 'ui-slider-input',
			required: this.config.required,
			placeholder: this.config.placeholder,
			min: this.config.min,
			max: this.config.max,
			step: this.config.step,
			value: this.config.defaultValue
		});
		this.formcontin.append(this.form);
	},
	subHandleCreate: function(){
		if(this.config.subhandle){
			this.subhandle = X.util.em.get().addClass('ui-slider-subhandle');
			this.formcontin.append(this.subhandle);
			
			if(X.type(this.config.range) === 'object'){
				
			}
			else{
				this.subhandle.addClass('ui-slider-subhandle');
			}
		}
	},
	handleCreate: function(val){
		this.handle = X.util.em.get(false, false, 'a').addClass('ui-slider-handle');
		this.formcontin.append(this.handle);

		if(X.type(this.config.range) === 'object'){
			this.subhandle = X.util.em.get(false, false, 'a').addClass('ui-slider-handle ui-slider-subhandle');
			this.formcontin.append(this.subhandle);
		}
	},
	setValue: function(val){
		var percent,
			min = this.getMin(),
			max = this.getMax();	
			
		if (X.type(val) === 'object') {
			var e = val,
				tol = 8;

			if(this.config.direction === 'x'){
				var w = this.formcontin.width(),
					l = this.formcontin.offset().left,
					x = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.originalEvent.pageX;
		
    			if ( !this.dragging || x < l - tol || x > l + w + tol ) {
					return;
				}

				percent = Math.round(((x - l) / w ) * 100 );
			}
			if(this.config.direction === 'y'){
				var h = this.formcontin.height(),
					t = this.formcontin.offset().top,
					y = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.originalEvent.pageY;
					
				if ( !this.dragging || y < t - tol || y > t + h + tol ) {
					return;
				}

				percent = Math.round(((y - t) / h ) * 100);
			}
		}

		if(X.type(val) === 'number'){
			percent = this.percentValue(val);
		}
		
		var newval = Math.round( (percent / 100) * (max - min) ) + min;
		newval = this.trimValue(newval);

		percent = this.percentValue(newval);

		if(this.subdragging){
			var data = this.handle.data('data');

			if(data){
				data = parseInt(data);
				if(newval < data){
					return;
				}
			}
		}

		if(!this.subdragging && this.subhandle){
			var data = this.subhandle.data('data');
			if(data){
				data = parseInt(data);
				if(newval > data)
					return;
			}
			else{
				var subPercent = (this.config.subhandle - min) / (max - min) * 100;
				var subNewVal = Math.round( (subPercent / 100) * (max - min) ) + min;
				

				if(this.config.direction === 'x'){
					this.subhandle.css("left", subPercent + "%").data('data', subNewVal);
				}
				else{
					this.subhandle.css("top", subPercent + "%").data('data', subNewVal);
				}
			}
		}
		
		if(this.config.direction === 'x'){
			if(this.subdragging){
				this.subhandle.css("left", percent + "%").data('data', newval);
			}
			else{
				this.handle.css("left", percent + "%").data('data', newval);
			}
		}

		if(this.config.direction === 'y'){
			if(this.subdragging){
				this.subhandle.css("top", (percent) + "%").data('data', newval);
			}
			else{
				this.handle.css("top", (percent) + "%").data('data', newval);
			}
		}

		this.fireEvent(this, 'change', [this, percent, newval]);
	},
	trimValue: function(val){
		var min = this.getMin(),
			max = this.getMax();

		if ( val <= min ) {
			return min;
		}
		if ( val >= max ) {
			return max;
		}
		var step = ( this.config.step > 0 ) ? this.config.step : 1,
			stepVal = (val - min) % step,
			alignValue = val - stepVal;

		if ( Math.abs(stepVal) * 2 >= step ) {
			alignValue += ( stepVal > 0 ) ? step : ( -step );
		}

		return parseFloat(alignValue.toFixed(5));
	},
	percentValue: function(val){
		var min = this.getMin(),
			max = this.getMax();

		percent = (parseFloat(val) - min) / (max - min) * 100;
		
		if(isNaN(percent)){
			return 0;
		}
		if (percent < 0) { 
			percent = 0; 
		}
		if (percent > 100) { 
			percent = 100; 
		}

		return percent;
	},
	//override
	getValue: function(){
		if(this.subhandle){
			return [this.handle.data('data'), this.subhandle.data('data')];
		}
		else{
			return this.handle.data('data');
		}
	},
	disabled: function(){
		this.el.addClass('ui-disabled');
		this.handle.addClass('ui-disabled');
		if(this.subhandle){
			this.subhandle.addClass('ui-disabled');
		}
		this.form.attr('disabled', true);
		this.fireEvent(this, 'disabled', [this]);
	},
	enabled: function(){
		this.el.removeClass('ui-disabled');
		this.handle.removeClass('ui-disabled');
		if(this.subhandle){
			this.subhandle.removeClass('ui-disabled');
		}
		this.form.attr('disabled', false);
		this.fireEvent(this, 'enabled', [this]);
	},
	setMin: function(min){
		this.config.min = min;
	},
	setMax: function(max){
		this.config.max = max;
	},
	getMin: function(){
		return this.config.min;
	},
	getMax: function(){
		return this.config.max;
	}
});

X.util.cm.addCString('slider', X.ui.Slider);
X.ui.Spinner = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			min: 0,
			max: 100,
			step: 1,
			defaultValue: 0
		};
		X.apply(this.config, config);
		X.ui.Spinner.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.Spinner.base.render.call(this);
		this.el.addClass('ui-spinner').width(this.config.width);
		
		this.formCreate();
		this.handleCreate();
		
		this.fireEvent(this, 'afterrender', []);
	},
	formCreate: function(){
		this.form = X.util.em.get({
			tag: 'input',
			type: 'number',
			min: this.config.min,
			max: this.config.max,
			value: this.config.defaultValue,
			step: this.config.step
		});
		this.formcontin.append(this.form);
		
		this.form.bind('change', { me: this }, this._change);
	},
	_change: function(e){
		var me = e.data.me,
			val = parseFloat(me.form.val(), 10) || 0;
		
		if(val < me.config.min){
			val = me.config.min
			me.form.val(val);
		}
		else if(val > me.config.max){
			val = me.config.max;
			me.form.val(val);
		}
		
		me.fireEvent(me, 'change', [me,  val]);
	},
	handleCreate: function(){
		var plus = X.util.em.get()
			.html('+').addClass('ui-spinner-btn ui-spinner-plus');

		this.formcontin.append(plus);
		
		
		var minus = X.util.em.get()
			.html('-').addClass('ui-spinner-btn ui-spinner-minus');

		this.formcontin.append(minus);
		
		plus.on(X.events.start, { me: this }, this.plus);
		minus.on(X.events.start, { me: this }, this.minus);
	},
	end: function(e){
		var me = e.data.me;
		me.clearTimer();
		
		return false;
	},
	clearTimer: function(){
		if(this.interval){
			window.clearInterval(this.interval);
			this.interval = null;
			
			X.getDoc().off(X.events.end, this.end);
		}
	},
	timer: function(e, flag){
		if(!this.interval){
			var me = this;
			this.interval = window.setInterval(function(){
				me[flag](e);
			}, 100);
			
			X.getDoc().on(X.events.end, {me: this}, this.end);
		}
	},
	plus: function(e){
		var me = e.data.me,
			val = parseFloat(me.form.val(), 10) || 0;
		
		var result = val + me.config.step;
		
		if(result > me.config.max){
			result = me.config.max;
		}
		
		result = parseFloat(result.toFixed(1), 10);
		me.form.val(result);

		me.timer(e, 'plus');
		return false;
	},
	minus: function(e){
		var me = e.data.me,
			val = parseFloat(me.form.val(), 10) || 0;
		
		var result = val - me.config.step;
		
		if(result < me.config.min){
			result = me.config.min;
		}
		
		result = parseFloat(result.toFixed(1), 10);
		me.form.val(result);
		
		me.timer(e, 'minus');
		return false;
	},
	setValue: function(val){
		if (this.el.hasClass('ui-disabled')) {
			return;
		}
		if(!val){
			val = 0;
		}

		if(val < this.config.min){
			val = this.config.min;
		}
		if(val > this.config.max){
			val = this.config.max;
		}
		
		this.form.val(val);
		
		this.fireEvent(this, 'change', [this,  val]);
	},
	setMax: function(max){
		if(X.type(max) !== 'number'){
			return;
		}
		
		this.config.max = max;
		this.form.attr('max', max);
	},
	setMin: function(min){
		if(X.type(min) !== 'number'){
			return;
		}
		
		this.config.min = min;
		this.form.attr('min', min);
	},
	getMax: function(){
		return this.config.max;
	},
	getMin: function(){
		return this.config.min;
	},
	setStep: function(step){
		if(X.type(step) !== 'number'){
			return;
		}
		
		this.config.step = step;
		this.form.attr('step', step);
	}
});

X.util.cm.addCString('spinner', X.ui.Spinner);
X.ui.Progressbar = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			max: 100,
			defaultValue: 0
		};
		X.apply(this.config, config);
		X.ui.Progressbar.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.Progressbar.base.render.call(this);
		
		this.el.addClass('ui-progressbar');
	
		this.formCreate();
		
		this.setValue(this.config.defaultValue);
		
		this.fireEvent(this, 'afterrender', [this]);
	},
	formCreate: function(){
		this.form = X.util.em.get({
			tag: 'progress',
			'class': 'ui-progress',
			max: this.config.max,
			value: this.config.defaultValue
		});
		
		this.gauge = X.util.em.get().addClass('ui-progress-gauge');
		this.bar = X.util.em.get().addClass('ui-progress-bar');
		this.formcontin.append(this.gauge, this.bar);
		this.formcontin.append(this.form);
	},
	setValue: function(val){
		if (this.el.hasClass('ui-disabled')) {
			return;
		}
		
		var w = this.el.width(),
			percent = (w / this.config.max) * val;

		if(isNaN(percent)){
			return;
		}
		
		if(percent > w){
			percent = w;
		}		
		
		if(val < 0){
			val = 0;
		}
		
		if(val > this.config.max){
			val = this.config.max;
		}
		this.form.val(val);
		
		this.gauge.width(percent);
		this.fireEvent(this, 'update', [this, val]);
	},
	setMax: function(max){
		this.config.max = max;
	},
	getMax: function(max){
		return this.config.max;
	},
	disabled: function(){
		this.el.addClass('ui-disabled');
		this.fireEvent(this, 'disabled', [this]);
	},
	enabled: function(){
		this.el.removeClass('ui-disabled');
		this.fireEvent(this, 'enabled', [this]);
	}
});

X.util.cm.addCString('progressbar', X.ui.Progressbar);
X.ui.SwitchBox = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			checked: false,
			on: 'ON',
			off: 'OFF'
		};
		X.apply(this.config, config);
		X.ui.SwitchBox.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.SwitchBox.base.render.call(this);
		this.el.addClass('ui-switchbox').width(this.config.width);
		this.formCreate();

		this.handle = X.util.em.get().addClass('ui-switchbox-handle');
		this.text = X.util.em.get({tag: 'span'}).addClass('ui-switchbox-text');
		

		this.formcontin.append(this.text)
			.append(this.handle);
		
		this.formcontin.on('vclick', { me: this }, this._change);

		if(this.config.checked){
			this.el.addClass('on');
		}
		else{
			this.el.addClass('off');
		}

		this.setText();

		if(this.config.disabled){
			this.disabled();
		}
		
		this.fireEvent(this, 'afterrender', [this]);
	},
	formCreate: function(){
		this.form = X.util.em.get({
			tag: 'input',
			type: 'checkbox',
			checked: this.config.checked
		}).hide();
		this.formcontin.append(this.form);
	},
	_change: function(e){
		var me = e.data.me,
			el = me.el;

		if(me.el.hasClass('on')){
			me.unchecked();
		}
		else{
			me.checked();
		}
		
		return false;
	},
	setOn: function(on){
		this.config.on = on;

		this.setText();
	},
	setOff: function(off){
		this.config.off = off;

		this.setText();
	},
	setText: function(){
		var text;
		if(this.el.hasClass('on')){
			text = this.config.on;
		}
		else{
			text = this.config.off;
		}

		this.text.html(text);
	},
	toggleChecked: function(){
		if(this.el.hasClass('on')){
			this.unchecked();
		}
		else{
			this.checked();
		}
	},
	checked: function(){
		if(this.el.hasClass('ui-disabled')){
			return;
		}
		
		this.el.removeClass('off').addClass('on');
		
		this.setText();
		this.form.attr('checked', true);

		this.fireEvent(this, 'change', [this, true]);
	},
	unchecked: function(){
		if(this.el.hasClass('ui-disabled')){
			return;
		}
		
		this.el.removeClass('on').addClass('off');
		
		this.setText();
		this.form.attr('checked', false);
		this.fireEvent(this, 'change', [this, false]);
	},
	getValue: function(){
		return this.form.is(':checked');
	}
});

X.util.cm.addCString('switchbox', X.ui.SwitchBox);
(function(){
	
	var head = $('head');
	function SetMeta(name, content){
		var meta = $('<meta />');
		meta.attr('name', name);
		meta.attr('content', content);
		head.eq(0).append(meta);
    }
	
	
	// Non-Retina iPhone, iPod touch, and Android devices
	//57
	// Non-Retina iPad
	//72
	// Retina iPhone and iPod touch
	//114
	// Retina iPad
	//144
	
	function SetLink(rel, icon, size){
		var link = $('<link />');
		link.attr('rel', rel);
		link.attr('href', icon);
		
		if (size) {
			link.setAttribute('sizes', size + 'x' + size);
		}
		head.eq(0).append(link);
	}	
	
	X.App = function(config){
		var default_config = {
			name: 'Application',
			icon: null,
			iconsize: null,
			splash: null,
			viewport: true,
			fullscreen: true,
			statusbar: null,
			ready: null,
			initialScale: 1,
			maximumScale: 1,
			minimumScale: 1,
			userScalable: 'no'
		};
		config = X.apply(default_config, config);

		if(config.viewport){
			SetMeta('viewport', 'initial-scale=' + default_config.initialScale + 
					', maximum-scale=' + default_config.maximumScale + 
					', minimum-scale=' + default_config.minimumScale + 
					', user-scalable=' + default_config.userScalable);
		}
		if(config.fullscreen){
			SetMeta('apple-mobile-web-app-capable', 'yes');
			SetMeta('apple-touch-fullscreen', 'yes');
		}
		
		if(config.statusbar){
			SetMeta('apple-mobile-web-app-status-bar-style', config.statusbar);
		}
		
		if(config.splash){
			SetLink('apple-touch-startup-image', config.splash);
		}
		
		if(config.icon){
			SetLink('apple-touch-icon', config.icon, config.iconsize);
		}
		
		
		if(config.id){
			config.id = config.id + config.name;
		}

		X.getDoc().ready(function(){
			var default_config = {
				id: config.id,
				el: 'body',
				autoSize: true,
				autoRender: true,
				scroll: false
			};
			
			default_config = X.apply(default_config, config.viewConfig);
	
			
			X.App.View = new X.View(default_config);

			X.getDoc().on('vclick', 'a', { view: X.App.View }, function(e){
				var el = $(this),
					href = el.attr('href'),
					transition = el.data('transition') || 'slide',
					history = el.data('history') === false ? false : true,
					back = el.data('back'),
					rel = el.attr('rel'),
					parents, vc;
				
				if(!href){
					return;
				}
				
				if(href.match(/^tel\:/)){
					return true;
				}
				
				parents = el.parents('.ui-view');
				parents.each(function(){
					var id = this.id;
					var view = X.util.cm.get(id);
					vc = view.getViewController();
					if(vc){
						return false;
					}
				});
				
				if(!vc){
					return false;
				}

				if(back && href === '#'){
					vc.backPage();
					return false;
				}
				
				if(href !== '#' && back){
					vc.prevPage({ url: href });
					return false;
				}
	
				if(href === '#' || !href){
					return true;
				}
				
				vc.nextPage({
					url: href,
					transition: transition,
					history: history
				});
	
				return false;
			});


			if(config.ready){
				config.ready(X.App.View);
			}

			config = null;

			X.getDoc().bind('orientationchange', function(e){
				return false;
			});
		});
	};
	
	X.getApp = function(){
		if(X.App.View){
			return X.App.View;
		}
		return null;
	};
})();