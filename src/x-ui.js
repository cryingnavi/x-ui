/*! 
 * x-ui Javascript UI FrameWork
 * jQuery Mobile Event Plugin, jQuery Mobile Animation used and iScroll 4 used.
 * 
 * Copyright 2013, 2014 YoungNam Heo
 * Dual licensed under the MIT or GPL Version 2 licenses
 * 
 * project: x-ui
 * version: 1.0.1
 * repository: git://github.com/cryingnavi/x-ui.git
 * contact: cryingnavi@gmail.com
 * Date: 2014-01-23 11:01 
 */
/**
 * X namespace
 * @namespace
 * @version 1.0.1
 */
X = {
    version : '1.0.1'
};

(function(){
	var win = $(window), 
		doc = $(document),
		body;

    /**
     * @static
     * @method
     * @memberof X
     * @desc jquery 의 extend 와 같다.
     */
	X.apply = $.extend;
	X.apply(X, {
	    /**
         * @static
         * @method
         * @memberof X
         * @desc jquery 의 noop 와 같다.
         */
		emptyFn: $.noop,
		/**
         * @static
         * @method
         * @memberof X
         * @desc 문자열을 결합하여 반환한다
         * @param {string} str 원본 문자열
         * @param {string} ... 결합할 문자열
         * @returns {string} 결합된 문자열
         * @example X.format("{0} World {1}", "Hello", "Javascript);
         */
		format: function(str){
			var args = arguments, len = args.length;
			var reg;
			for(var i=0; i<len; i++){
				reg = new RegExp('\\{'+i+'\\}', 'g');
				str = str.replace(reg, args[i+1]);
			}
			return str;
		},
		/**
         * @static
         * @method
         * @memberof X
         * @desc 클래스를 상속한다
         * @param {Class} sp 슈퍼클래스
         * @param {object} proto prototype
         * @returns {Class} sb 자식 클래스
         */
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
		/**
         * @static
         * @method
         * @memberof X
         * @desc 객체의 타입을 문자열로 반환한다.
         * @param {object} o 타입을 검사할 객체
         * @returns {string} t 객체의 타입
         * <br><u>dom:</u> 객체가 HtmlElement 이면 dom 을 반환한다.
         * <br><u>jquery:</u> 객체가 jquery 이면 jquery 를 반환한다.
         */
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
		/**
		 * @static
		 * @method
		 * @memberof X
         * @desc 디바이스의 방향을 문자열로 반환한다.
         * @returns {string} orientation 디바이스의 방향
         * <b>portrait</b> : 세로<br />
         * <b>landscape</b> : 가로
         */
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
		/**
		 * @static
		 * @method
		 * @memberof X
         * @desc document.body 객체를 반환한다.
         * @param {Boolean} flag true를 전달할시 document.body 를 아니면 jquery(body);
         * @returns {Object} document.body | jquery 객체를 반환한다.
         */
		getBody: function(flag){
			if(!body){
				body = $('body');
			}
			return flag === true ? document.body : body;
		},
		/**
		 * @static
		 * @memberof X
         * @desc document 객체를 반환한다.
         * @param {Boolean} flag true를 전달할시 document 를 아니면 jquery(document);
         * @returns {Object} document | jquery 객체를 반환한다.
         */
		getDoc: function(flag){
			return flag === true ? document : doc;
		},
		/**
		 * @static
		 * @method
		 * @memberof X
         * @desc window 객체를 반환한다.
         * @param {Boolean} flag true를 전달할시 window 를 아니면 jquery(window);
         * @returns {Object} window | jquery 객체를 반환한다.
         */
		getWindow: function(flag){
			return flag === true ? window : win;
		},
		/**
		 * @static
		 * @method
		 * @memberof X
         * @desc window 의 현재 사이즈를 반환한다.
         * @returns {Object} width, height 를 프로퍼티로 갖는 객체를 반환한다.
         * @example var size
         */
		getWindowSize: function(){
			var win = this.getWindow();
			return {
				width: win.width(),
				height: win.height()
			};
		}
	});

	$.fn.animationComplete = function( callback, data ){
		if(X.platform.cssAnimataion){
			return $(this).one('webkitAnimationEnd animationend', data, callback);
		}
		else{
			setTimeout(callback, 0);
			return $(this);
		}
	};

    /**
     * @static
     * @memberof X
     * @desc 현재 플랫폼에 대한 각종 정보를 반환한다.
     * <b>X.platform.isIos</b>          : ios 일 경우 true. <br/>
     * <b>X.platform.isWindows</b>      : window 일 경우 true. <br/>
     * <b>X.platform.isMac</b>          : mac 일 경우 true. <br/>
     * <b>X.platform.isLinux</b>        : linux 일 경우 true. <br/>
     * <b>X.platform.isDesktop</b>      : desktop 일 경우 true. <br/>
     * <b>X.platform.iPod</b>           : ipod 일 경우 true. <br/>
     * <b>X.platform.iPhone</b>         : iphone 일 경우 true. <br/>
     * <b>X.platform.iPad</b>           : ipad 일 경우 true. <br/>
     * <b>X.platform.android</b>        : android 일 경우 true. <br/>
     * <b>X.platform.androidVersion</b> : android version 정보를 담음. <br/>
     * <b>X.platform.hasTouch</b>       : touch 가 가능 한 기기일 경우 true. <br/>
     */
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
			
		function getCssAnimataion(){
		    var prefixes = ['webkit', 'Moz', 'o', ''],
		        len = prefixes.length,
		        style = document.documentElement.style,
		        i = 0,
		        ret = false;
		    
		    for(; i<len; i++){
		        if(style[prefixes[i]] + 'AnimationName'){
		            ret = true;
		            break;
		        }
		    }
		    
		    return ret;
		}
			
		
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
			hasTouch: ('ontouchstart' in window),
			cssAnimataion: getCssAnimataion()
		};
	})();

    /** 
     * @static
     * @memberof X
     * @desc 터치 가능 환경에 따라 이벤트를 분기한다.
     * <b>X.events.start</b>                : touchstart or vmousedown <br/>
     * <b>X.events.move</b>                 : touchmove or vmousemove <br/>
     * <b>X.events.end</b>                  : touchend or vmouseup <br/>
     * <b>X.platform.orientationchange</b>  : orientationchange or resize <br/>
     */
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
/**
 * @namespace
 * @desc X.util Namespace
 */
X.util = { };
/**
 * @class 
 * @classdesc X.util.Observer 클래스는 custom 이벤트를 발생시켜주며 대부분의 클래스의 최상위 클래스로 존재한다.
 * @property {Object} config.listener 등록할 커스텀 이벤트
 * @example
 * var observer = new X.util.Observer({
 *      success: function(){ },
 *      error: function(){ }
 * });
 */
X.util.Observer = X.extend(X.emptyFn, {
	initialize: function(listener){
		this.eventTypes = this.eventTypes || {};
		for (var attr in listener) {
			this.eventTypes[attr] = listener[attr];
		}
	},
	/**
     * @desc custom 이벤트를 등록한다.
     * @memberof X.util.Observer.prototype
     * @method addEvent
     * @alias Observer#on
     * @param {args} ... 
     * @example 
     * var observer = new X.util.Observer();
     * observer.addEvent({
     *  success: function(){ }
     *  error: function(){ }
     * });
     * 
     * observer.addEvent({
     *  success: {
     *      scope: window,
     *      params: [ ].
     *      fn: function(){ }
     *  },
     *  error: {
     *      scope: window,
     *      params: [ ].
     *      fn: function(){ }
     *  }
     * });
     */
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
	/**
     * @desc custom 이벤트를 발생시킨다.
     * @memberof X.util.Observer.prototype
     * @method fireEvent
     * @alias Observer#fire
     * @param {Object} 이벤트 핸들러의 scope
     * @param {String} type 커스텀 이벤트의 이름 
     * @param {args} args 이벤트 핸들러에 전달될 argument.
     * @return {Object} 이벤트 핸들러가 return 한 무언가를 반환함.
     */
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
		}
	},
	/**
     * @desc custom 이벤트를 삭제한다
     * @memberof X.util.Observer.prototype
     * @method removeEvent
     * @alias Observer#off
     * @param {String} type
     */
	removeEvent: function(type){
		if (this.eventTypes[type]) {
			delete this.eventTypes[type];
		}
	},
	/**
     * @desc 등록한 custom 이벤트를 모두 삭제한다
     * @memberof X.util.Observer.prototype
     * @method clear
     */
	clear: function(){
		this.eventTypes = { };
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
/**
 * @static
 * @desc x ui 로 선언된 ui 컴포넌트에 대한 참조를 가지고 ui 의 고유한 id로 가져올 수 있다.
 * @alias X.util.cm
 */
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
	/**
     * @static
     * @memberof X.util.ComponentManager
     * @param {String} id - 컴포넌트 id
     * @desc x ui 로 선언된 ui 컴포넌트의 참조를 가져온다.
     */
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

/**
 * @class
 * @desc X.util.ViewController 클래스는 X.util.LocalViewController, X.util.RemoteViewController 의 base 클래스이다.
 */
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
			    var tel = null,
			        fel = null;

				tel = toView.getEl();
				tel.addClass(transition + ' in ' + reverse + ' ui-transitioning ui-vc-active').removeClass('ui-view-hide');

				fel = fromView.getEl();
				fel.addClass(transition + ' out ' + reverse + ' ui-transitioning');

				if(transition !== 'none'){
					tel.animationComplete(viewOut);
				}
				else{
					viewOut();
				}
			},
			viewOut = function(){
			    var tel = null,
			        fel = null;
			        
				tel = toView.getEl();
				tel.removeClass(transition + ' in ' + reverse + ' ui-transitioning');

				fel = fromView.getEl();
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
	/**
	 * @method
     * @desc 바로 이전 화면으로 돌아간다.
     * @memberof X.util.ViewController.prototype
     * @return {Boolean} succ 이전 페이지로 돌아갔다면 true, 실패시 false를 반환한다.
     */
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
	/**
	 * @method
     * @desc 현재 활성화 되어 있는 화면의 view 를 반환한다.
     * @memberof X.util.ViewController.prototype
     * @return {Component}
     */
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
/**
 * @class
 * @desc X.util.LocalViewController 클래스는 생성된 X.View 의 자식 view 들에 대해서 화면전환을 제공한다.
 * @property {String} config.activeIndex 처음 생성시에 활성화 될 화면의 인덱스
 * @property {String} config.transition 화면 전환 animation 종류를 지정한다.<br/>
 * <b>slide</b>, <b>slidefade</b>, <b>slideup</b>, <b>slidedown</b><br/>
 * <b>pop</b>, <b>fade</b>, <b>flip</b>, <b>turn</b>, <b>flow</b><br/>
 * <b>roll</b>
 * @example
 * var view = new X.View({
 *      viewController: new X.util.LocalViewController({
 *          beforenextchange: function(){ },        //다음 화면으로 전환하기 직전에 호출된다.
 *          afternextchange: function(){ },         //다음 화면으로 전환한 후에 호출된다.
 *          beforeprevchange: function(){ },        //이전 화면으로 전환하기 진적에 호출된다.
 *          afterprevchange: function(){ }          //이전 화면으로 전환한 후에 호출된다.
 *      }),
 *      items: [
 *          new X.View(),
 *          new X.View(),
 *          new X.View()
 *      ]
 * });
 * 
 * var vc = view.getViewController();
 * vc.nextPage(1);
 */
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
	/**
     * @method
     * @desc 현재 활성화 되어 있는 view의 인덱스를 반환한다.
     * @memberof X.util.LocalViewController.prototype
     * @return {Number} i 현재 활성화 되어있는 요소의 인덱스를 반환한다.
     */
	getActiveIndex: function(){
		var active = this.getActiveView();
		for(var i=0; i<this.views.length; i++){
			if(active === this.views[i]){
				return i;
			}
		}
	},
	/**
	 * @method
     * @desc view들 중 인자로 받은 index 에 해당 하는 view를 반환한다.
     * @memberof X.util.LocalViewController.prototype
     * @param {Number} index - 원하는 view에 해당하는 index
     * @return {X.View} view - X.View를 반환한다.
     */
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
	/**
	 * @method
     * @desc 다음 화면으로 화면을 전환한다.
     * @memberof X.util.LocalViewController.prototype
     * @param {Object} config - 다음 화면으로 전환한다.<br/>
     * <b>index</b>         : 전환하고자 하는 view 의 인덱스<br/>
     * <b>history</b>       : 화면전환을 history에 저장할지 여부<br/>
     * <b>transition</b>    : 화면전환에 사용할 애니메이션<br/>
     * <b>reverse</b>       : 화면전환시 방향. reverse 시 역방향. 빈값을 경우는 정방향.<br/>
     */
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
	/**
     * @desc 이전 화면으로 전환한다.
     * @memberof X.util.LocalViewController.prototype
     * @method prevPage
     * @param {Object} config - 이전 화면으로 전환한다.<br/>
     * <b>index</b>         : 전환하고자 하는 view 의 인덱스<br/>
     * <b>transition</b>    : 화면전환에 사용할 애니메이션<br/>
     * <b>reverse</b>       : 화면전환시 방향. reverse 시 역방향. 빈값을 경우는 정방향.<br/>
     */
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
	/**
     * @desc 새로운 view를 viewcontroller에 등록한다.
     * @memberof X.util.LocalViewController.prototype
     * @method appendView
     * @param {X.View} view - 등록할 새로운 view
     * @return {X.View} view - 해당 view를 반환한다.
     */
	appendView: function(view){
		view.el.addClass('ui-vc-active');
		this.views.push(view);

		return view;
	},
	/**
     * @desc 등록된 view 를 viewcontroller에서 삭제 한다.
     * @memberof X.util.LocalViewController.prototype
     * @method removeView
     * @param {X.View} view - 삭제할 view
     * @return {X.View} view - 해당 view를 반환한다.
     */
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
/**
 * @class
 * @classdesc X.util.RemoteViewController 클래스는 원격지에 있는 화면을 불러와 화면을 전환하도록 한다.
 * @property {String} config.initPage 초기 화면의 url 을 지정한다.
 * @property {String} config.transition 화면 전환 animation 종류를 지정한다.
 * <b>slide</b><br/>
 * <b>slidefade</b><br/>
 * <b>slideup</b><br/>
 * <b>slidedown</b><br/>
 * <b>pop</b><br/>
 * <b>fade</b><br/>
 * <b>flip</b><br/>
 * <b>turn</b><br/>
 * <b>flow</b><br/>
 * <b>roll</b>
 * @example
 * var view = new X.View({
 *      viewController: new X.util.RemoteViewController({
 *          beforenextchange: function(){ },        //다음 화면으로 전환하기 직전에 호출된다.
 *          afternextchange: function(){ },         //다음 화면으로 전환한 후에 호출된다.
 *          beforeprevchange: function(){ },        //이전 화면으로 전환하기 진적에 호출된다.
 *          afterprevchange: function(){ }          //이전 화면으로 전환한 후에 호출된다.
 *      }),
 *      items: [
 *          new X.View(),
 *          new X.View(),
 *          new X.View()
 *      ]
 * });
 * 
 * var vc = view.getViewController();
 * vc.initPage({ url: "page.html" });
 * vc.nextPage({ url: "page-next.html" });
 */
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
	/**
	 * @method
     * @desc 다음 화면으로 화면을 전환한다.
     * @memberof X.util.RemoteViewController.prototype
     * @param {Object} config - 초기 화면을 불러오기 위한 정보이다.<br/>
     * <b>url</b>           : 초기 페이지의 url을 넘긴다.
     */
	initPage: function(config){
		this.fireEvent(this, 'beforeinit', []);
		this.callMethod = 'initSuccess';
		this.send(config);
	},
	/**
	 * @method
     * @desc 다음 화면으로 화면을 전환한다.
     * @memberof X.util.RemoteViewController.prototype
     * @param {Object} config - 다음 화면으로 전환한다.<br/>
     * <b>url</b>           : 전환하고자 하는 page 의 url<br/>
     * <b>history</b>       : 화면전환을 history에 저장할지 여부<br/>
     * <b>transition</b>    : 화면전환에 사용할 애니메이션<br/>
     * <b>reverse</b>       : 화면전환시 방향. reverse 시 역방향. 빈값을 경우는 정방향.<br/>
     */
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
	/**
     * @desc 이전 화면으로 화면을 전환한다.
     * @memberof X.util.RemoteViewController.prototype
     * @method nextPage
     * @param {Object} config - 이전 화면으로 전환한다.<br/>
     * <b>url</b>           : 전환하고자 하는 page 의 url<br/>
     * <b>transition</b>    : 화면전환에 사용할 애니메이션<br/>
     * <b>reverse</b>       : 화면전환시 방향. reverse 시 역방향. 빈값을 경우는 정방향.<br/>
     */
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
		this.view.addItems([toView]);
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
			this.view.addItems([toView]);
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
/**
 * @namespace
 * @desc X.ui Namespace
 */
X.ui = { };
/**
 * @class 
 * @classdesc View 를 생성한다. View란 화면의 기본 단위이며 기본적인 container 역할을 수행한다.
 * @property {String | jQuery | HtmlElement} el toolbar를 생성할 엘리먼트를 지정한다.
 * @property {Number | String} width 
 * @property {Number | String} height 
 * @property {Boolean} autoSize 
 * @property {Boolean} scroll 
 * @property {Object} scrollConfig 
 * @property {String | jQuery} content 
 * @property {Array} items 
 * @property {Array} toolbars 
 * @property {Boolean} floating 
 * @property {Boolean} overlay 
 * @property {X.util.ViewController} viewController 
 * @property {String} layout 
 * @property {Boolean} flexible 
 * @property {Object} panels 
 * @property {String} className 
 * @property {String | Object} style 
 */
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
	/**
     * @method 
     * @desc View 를 화면에 렌더한다.
     * @memberof X.View.prototype
     * @example
     * view.render();
     */
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
			this.createInitItems();
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
		
		if(this.config.scroll){
		    this.scrollCreate();
		}

		X.getWindow().on(X.events.orientationchange, { me: this }, this.onOrientationChange);

		this.fireEvent(this, 'afterrender', [this]);
	},
	/**
     * @method 
     * @desc View 에 생성된 스크롤을 재갱신한다.
     * @memberof X.View.prototype
     * @example
     * view.scrollRefresh();
     */
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
	/**
     * @method 
     * @desc View 에 생성된 패널을 오픈한다. 'left' 나 'right' 를 입력하여 해당 위치의 패널을 연다.
     * @memberof X.View.prototype
     * @param {String} type 오픈할 패널의 위치를 지정한다.
     * @example
     * view.panelsOpen();
     */
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
	/**
     * @method 
     * @desc View 에 생성된 패널을 닫는다. 'left' 나 'right' 를 입력하여 해당 위치의 패널을 닫는다.
     * @memberof X.View.prototype
     * @param {String} type 오픈할 패널의 위치를 지정한다.
     * @example
     * view.panelsClose();
     */
	panelsClose: function(){
		if(this.panelsRight || this.panelsLeft){
			this.body.removeClass('ui-view-panels-open ui-view-panels-open-left ui-view-panels-open-right').addClass('ui-view-panels-close');
			
			this.currentPanel = null
			this.fireEvent(this, 'panelsclose', [this]);
			
			this.body.off('vclick');
		}
	},
	/**
     * @method 
     * @desc View 에 생성된 패널의 열림상태를 반전시킨다.. 'left' 나 'right' 를 입력하여 해당 위치의 패널을 반전시킨다.
     * @memberof X.View.prototype
     * @param {String} type 오픈할 패널의 위치를 지정한다.
     * @example
     * view.panelsToggle();
     */
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
	/**
     * @method 
     * @desc View 안에 새로운 html 을 넣어 표현한다. 이때 data-role 을 해석하여 x-ui 의 컴포넌트를 생성한다.
     * @memberof X.View.prototype
     * @param {String} content 
     * @example
     * view.setContent('&lt;div&gt;New HTML&lt;/div&gt;');
     */
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
	/**
     * @method 
     * @desc View 의 레이아웃 형태를 변경한다. 'x' 나 'y' 로 가로 또는 세로 방향의 형태로 레이아웃을 변경할 수 있다. <br/>
     *      'x' 일 경우 자식 view 들이 가로 방향으로 배열되며 'y' 일 경우 세로 방향으로 배열된다.
     * @memberof X.View.prototype
     * @param {String} layout 
     * @example
     * view.setLayout('x');
     */
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
	/**
     * @method 
     * @desc View 를 플렉서블 view 로 만들 것인지 유무를 지정한다. <br/>
     *      true 일 경우 view는 동적으로 자기의 크기를 정하여 화면을 채우게 된다. <br/>
     *      false 일 경우 view가 명시적인 크기를 가져야하며 해당 크기로 view 가 생성된다.
     * @memberof X.View.prototype
     * @param {Boolean} flex 
     * @example
     * view.setFlexible(false);
     */
	setFlexible: function(flex){
		if(flex){
			this.el.addClass('ui-view-flexible');
		}
		else{
			this.el.removeClass('ui-view-flexible');
		}
	},
	/**
     * @method 
     * @desc View 의 size 를 지정한다. 인자로 true 를 넘기면 명시적인 사이즈를 지정하지 않는다. <br/>
     *      false 시에 명시적 사이즈를 지정한다. 해당 사이즈는 config.width, config.height 의 값으로 지정된다.
     * @memberof X.View.prototype
     * @param {Boolean} autoSize 
     * @example
     * view.setSize(false);
     */
	setSize: function(autoSize){
		this.setWidth(autoSize);
		this.setHeight(autoSize);
	},
	/**
     * @method 
     * @desc View 의 width 를 지정한다. <br/>
     *      200과 같이 형태의 인자를 넘기면, 자동으로 setFlexible(false) 를 호출하여 flexible layout 를 해제하고 해당 width 를 명시적으로 지정한다.
     * @memberof X.View.prototype
     * @param {Number} width 
     * @example
     * view.setWidth(100);
     */
	setWidth: function(width){
		if(X.type(width) !== 'boolean' || width !== true){
			this.setFlexible(false);
			var w = width || this.config.width;
			this.el.width(w);
		}
	},
	/**
     * @method 
     * @desc View 의 height 를 지정한다. <br/>
     *      200과 같이 형태의 인자를 넘기면, 자동으로 setFlexible(false) 를 호출하여 flexible layout 를 해제하고 해당 height 를 명시적으로 지정한다.
     * @memberof X.View.prototype
     * @param {Number} height 
     * @example
     * view.setHeight(100);
     */
	setHeight: function(height){
		if(X.type(height) !== 'boolean' || height !== true){
			this.setFlexible(false);
			var h = height || this.config.height;
			this.el.css('min-height', 'none').height(h);
		}
	},
	/**
     * @method 
     * @desc View 의 border, margin, padding 을 포함한 width를 반환한다.
     * @memberof X.View.prototype
     * @return {Number} width 
     * @example
     * view.getWidth();
     */
	getWidth: function(){
		var width = this.el.outerWidth();
		return width;
	},
	/**
     * @method 
     * @desc View 의 border, margin, padding 을 포함한 height를 반환한다.
     * @memberof X.View.prototype
     * @return {Number} height 
     * @example
     * view.getHeight();
     */
	getHeight: function(){
		var height = this.el.outerHeight();
		return height;
	},
	/**
     * @method 
     * @desc View 에 scroll을 생성한다.
     * @memberof X.View.prototype
     * @example
     * view.scrollCreate();
     */
	scrollCreate: function(){
		this.scroll = new iScroll(this.body.get(0), this.config.scrollConfig);
	},
	/**
     * @method 
     * @desc View 에 생성된 스크롤을 제거한다.
     * @memberof X.View.prototype
     * @example
     * view.scrollDestroy();
     */
	scrollDestroy: function(){
		if(this.scroll){
			this.scroll.destroy();
		}
	},
	onOrientationChange: function(e){
		var me = e.data.me;
		me.fireEvent(me, 'orientationchange', []);
	},
	/**
     * @method 
     * @desc View 를 화면에 show 시킨다. 인자로 true를 넘기면 pop 애니메이션이 동작한다.
     * @memberof X.View.prototype
     * @param {Boolean} transition
     * @example
     * view.show();
     */
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
	},
	/**
     * @method 
     * @desc View 를 화면에 hide 시킨다. 인자로 true를 넘기면 pop 애니메이션이 동작한다.
     * @memberof X.View.prototype
     * @param {Boolean} transition
     * @example
     * view.hide();
     */
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
	},
	/**
     * @method 
     * @desc View 를 화면에 toggle 시킨다. 인자로 true를 넘기면 pop 애니메이션이 동작한다.
     * @memberof X.View.prototype
     * @param {Boolean} transition
     * @example
     * view.toggle();
     */
	toggle: function(transition){
		if(this.el.hasClass('ui-view-hide')){
			this.show(transition);
		}
		else{
			this.hide(transition);
		}
	},
	/**
     * @method 
     * @desc View 의 최상위 Element 를 반환한다.
     * @memberof X.View.prototype
     * @return {jQuery} el
     * @example
     * view.getEl();
     */
	getEl: function(){
		return this.el;
	},
	/**
     * @method 
     * @desc View 의 id 를 반환한다.
     * @memberof X.View.prototype
     * @return {String} id
     * @example
     * view.getId();
     */
	getId: function(){
		return this.el.attr('id');
	},
	/**
     * @method 
     * @desc View 의 viewController를 반환한다.
     * @memberof X.View.prototype
     * @return {X.util.ViewController} vc
     * @example
     * view.getViewController();
     */
	getViewController: function(){
		return this.config.viewController;
	},
	/**
     * @method 
     * @desc View 에 viewController를 지정한다.
     * @memberof X.View.prototype
     * @param {X.util.ViewController | String} vc X.util.ViewController 또는 X.util.ViewController 의 id.
     * @example
     * view.setViewController(new X.util.RemoteViewController);
     */
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
	/**
     * @method 
     * @desc View 를 제거한다.
     * @memberof X.View.prototype
     * @example
     * view.destroy();
     */
	destroy: function(){
	    this.scrollDestroy();

		this.el.remove();
		X.getWindow().off(X.events.orientationchange, this.onOrientationChange);

		this.fireEvent(this, 'destroy', [this]);
	},
	createInitItems: function(){
    	var el = this.body.children('.ui-scrollview-view');
    	if(el.length < 1){
    		el = this.body;
    	}
    	var items = X.util.cm.create(el, this.config.items);
    
    	this.config.items = items;
    },
    /**
     * @method 
     * @desc View 안에 새로운 컴포넌트를 자식으로 추가한다.
     * @memberof X.View.prototype
     * @param {Array} items
     * @example
     * view.addItems([new X.View(), new X.ui.ListView(), new X.ui.TextBox()]);
     */
	addItems: function(items){
		var el = this.body.children('.ui-scrollview-view');
		if(el.length < 1){
			el = this.body;
		}
		items = X.util.cm.create(el, items);
		this.config.items = $.unique(this.config.items.concat(items));
		this.config.items.reverse();
		
		return items;
	},
	/**
     * @method 
     * @desc View 안에 있는 컴포넌트를 삭제한다.
     * @memberof X.View.prototype
     * @param {Number} index
     * @example
     * view.removeItem(1);
     */
	removeItem: function(index){
		this.config.items[index].destroy();
		this.config.items.remove(index);
	},
	/**
     * @method 
     * @desc View 에 새로운 toolbar 를 생성한다.
     * @memberof X.View.prototype
     * @param {Array} toolbars
     * @return {Array} toolbars
     * @example
     * view.addToolbar([
     *      new X.ui.Toolbar()
     * ]);
     */
	addToolbar: function(toolbars){
		toolbars = X.util.cm.create(this.el, toolbars);
		
		this.config.toolbars = $.unique(this.config.toolbars.concat(toolbars));
		this.config.toolbars.reverse();

		return toolbars;
	},
	/**
     * @method 
     * @desc View 를 팝업 형태로 화면에 띄울 수 있도록 만들거나 반대로 팝업 형태를 제거한다.
     * @memberof X.View.prototype
     * @param {Boolean} float true 일 경우는 팝업 형태, false 일 경우는 팝업 형태가 제거된다.
     * @example
     * view.setFloating(true);
     */
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
	/**
     * @method 
     * @desc View 를 팝업 형태로 화면에 띄울때 배경을 회색으로 덮을 div 를 생성한다.
     * @memberof X.View.prototype
     * @param {Boolean} overlay true 일 경우는 배경 생성, false 일 경우는 배경을 생성하지 않는다.
     * @example
     * view.setOverlay(true);
     */
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
	/**
     * @method 
     * @desc View 안에 바인딩 되어 있는 html 들 중 data-role 로 기술된 컴포넌트들을 해석하여 x-ui 컴포넌트로 변경한다.
     * @memberof X.View.prototype
     * @example
     * 
     * //view content
     * &lt;div data-role="toolbar"&gt;
     *  &lt;h1&gt;Toolbar&lt;/h1&gt;
     * &lt;/div&gt;
     * &lt;div data-role="listview"&gt;
     *  &lt;ul&gt;
     *      &lt;li&gt;A&lt;/li&gt;
     *      &lt;li&gt;B&lt;/li&gt;
     *      &lt;li&gt;C&lt;/li&gt;
     *  &lt;/ul&gt;
     * &lt;/div&gt;
     * &lt;div data-role="textbox"&gt;&lt;/div&gt;
     * 
     * //view 컴포넌트 해석
     * view.createHtmlComponent();
     */
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
/**
 * @class 
 * @classdesc X.ui.Accordion 클래스는 Accordion ui 를 생성한다.
 * @property {Array} config.titles 각 탭의 title 을 설정한다.
 * @property {Array} config.items 각 탭의 view를 설정한다.
 * @property {Number} config.activeIndex 초기 open될 탭을 설정한다. Default : 0
 * @example
 * var accordion = new X.ui.Accordion({
 *      titles: ["Tab 1", "Tab 2", "Tab 3"],
 *      activeIndex: 0,
 *      items: [new X.View(), new X.View(), new X.View()]
 * });
 * accordion.render();
 * <pre><code>
 * &lt;div data-role="accordion" data-active-index="0"&gt;
 *      &lt;div data-role="view" data-title="Tabs 1"&gt;
 *          &lt;!-- Someting Html --&gt;
 *      &lt;/div&gt;
 *      &lt;div data-role="view" data-title="Tabs 2"&gt;
 *          &lt;!-- Someting Html --&gt;
 *      &lt;/div&gt;
 *      &lt;div data-role="view" data-title="Tabs 3"&gt;
 *          &lt;!-- Someting Html --&gt;
 *      &lt;/div&gt;
 * &lt;/div&gt;
 * &lt;</code></pre>
 */
X.ui.Accordion = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			titles: [],
			items: [],
			activeIndex: 0
		};
		this.config.scroll = false;
		X.apply(this.config, config);
		X.ui.Accordion.base.initialize.call(this, this.config);
	},
	/**
     * @method 
     * @desc Accordion 을 화면에 렌더한다.
     * @memberof X.ui.Accordion.prototype
     * @example
     * accordion.render();
     */
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
	/**
	 * @method
     * @desc 주어진 인덱스에 해당하는 탭으로 전환한다.
     * @memberof X.ui.Accordion.prototype
     * @param {Number} index - 이동할 인덱스에 해당하는 탭
     * @example
     * accordion.change(1);
     */
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
	/**
     * @method 
     * @desc 마지막에 탭 하나를 추가한다.
     * @memberof X.ui.Accordion.prototype
     * @param {Component} comp X.View 등의 component를 지정한다.
     * @param {String} title 새로 생성될 탭의 title 을 지정한다.
     * @return {Array} array 추가된 타이틀과 component를 배열로 반환한다.
     * @example
     * accordion.append(new X.View(), "New Tab");
     */
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
	/**
	 * @method
     * @desc 차음에 탭 하나를 추가한다.
     * @memberof X.ui.Accordion.prototype
     * @param {Component} comp - X.View 등의 component를 지정한다.
     * @param {String} title - 새로 생성될 탭의 title 을 지정한다.
     * @return {Array} array 추가된 타이틀과 component를 배열로 반환한다.
     * @example
     * accordion.prepend(new X.View(), "New Tab");
     */
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
	/**
	 * @method
     * @desc 인자로 받은 인덱스에 해당하는 탭을 삭제한다.
     * @memberof X.ui.Accordion.prototype
     * @param {Number} index - 삭제할 인덱스를 넘긴다.
     * @example
     * accordion.remove(1);
     */
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
	/**
	 * @method
     * @desc 탭을 모두 삭제 한다.
     * @memberof X.ui.Accordion.prototype
     * @example
     * accordion.removeAll();
     */
	removeAll: function(){
		this.body.empty();
		this.config.activeIndex = null;
	},
	/**
	 * @method
     * @desc 인자로 받은 해당 탭에 새로운 타이틀을 설정한다.
     * @memberof X.ui.Accordion.prototype
     * @param {String} title - 새로 변경할 타이틀.
     * @param {Number} index - 변경할 탭.
     * @example
     * accordion.changeTitle(0, "New Title");
     */
	changeTitle: function(title, index){
		index = index || 0;
		var view = this.body.children('.ui-accordion-views')
			.eq(index);
		
		view
			.children('.ui-accordion-title')
			.html(title);
		
		this.config.titles[index] = title;
	},
	/**
	 * @method
     * @desc 인자로 받은 해당 탭을 반환한다.
     * @function getItem
     * @memberof X.ui.Accordion.prototype
     * @param {Number} index - 반환할 탭 인덱스.
     * @return {Component} 
     * @example
     * accordion.getItem(0);
     */
	getItem: function(index){
		return this.config.items[index];
	}
});

X.util.cm.addCString('accordion', X.ui.Accordion);
/**
 * @class 
 * @classdesc X.ui.Carousel 클래스는 Carousel ui 를 생성한다.
 * @property {String} config.direction carousel 의 이동방향을 지정한다. x 또는 y 로 가로 세로 방향을 지정한다. Default: 'x'
 * @property {Number} config.activeIndex 초기 활성화될 아이템을 지정한다. Defautl: 0.
 * @property {Number} config.duration 애니메이션 이동 속도를 지정한다. Defautl: 200.
 * @property {Array} config.items 각 탭의 view를 설정한다.
 * @example
 * var carousel = new X.ui.Carousel({
 *      direction: "x",
 *      activeIndex: 0,
 *      duration: 200,
 *      items: [new X.View(), new X.View(), new X.View()]
 * });
 * carousel.render();
 * 
 * <pre><code>
 * &lt;div data-role="carousel"&gt;
 *		&lt;div data-role="view" style="background-color: #8E8E93;" data-scroll="false"&gt;
 *			&lt;!-- Someting Html --&gt;
 *		&lt;/div&gt;
 *		&lt;div data-role="view" style="background-color: #34AADC;" data-scroll="false"&gt;
 *			&lt;!-- Someting Html --&gt;
 *		&lt;/div&gt;
 *		&lt;div data-role="view" style="background-color: #007AFF;" data-scroll="false"&gt;
 *			&lt;!-- Someting Html --&gt;
 *		&lt;/div&gt;
 * &lt;/div&gt;
 * </code></pre>
 */
X.ui.Carousel = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			direction: 'x',
			activeIndex: 0,
			duration: 200
		};
		this.config.scroll = false;
		X.apply(this.config, config);
		X.ui.Carousel.base.initialize.call(this, this.config);

		this.endPos = 0;
		this.dragging = false;
		this.activeIndex = this.config.activeIndex;
	},
	/**
     * @method 
     * @desc Carousel 을 화면에 렌더한다.
     * @memberof X.ui.Carousel.prototype
     * @example
     * carousel.render();
     */
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
		    itemSize = this.getWidth();
		    pos = (-1 * activeIndex) * itemSize;
		    
			style.webkitTransform = 'translateX(' + (pos) + 'px)';
			style.msTransform = 'translateX(' + (pos) + 'px)';
			style.transform = 'translateX(' + (pos) + 'px)';
			
			views.each(function(i){
			    this.style.left = (i * 100) + '%';
			});
		}
		else{
		    itemSize = this.getHeight();
		    pos = (-1 * activeIndex) * itemSize;
		    
			style.webkitTransform = 'translateY(' + (pos) + 'px)';
			style.msTransform = 'translateY(' + (pos) + 'px)';
			style.transform = 'translateY(' + (pos) + 'px)';
			
			views.each(function(i){
			    this.style.top = (i * 100) + '%';
			});
		}

		this.carouselBody.bind(X.events.start, {me: this}, this.onStart);
		
		X.getWindow().on(X.events.orientationchange, { me: this }, this.orientationChange);
	},
	orientationChange: function(e){
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
		me.moveLimit = 0;

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
	/**
	 * @method
     * @desc 현재 활성화되어 있는 아이템을 반환한다.
     * @memberof X.ui.Carousel.prototype
     * @return {Component} component 
     * @example
     * var car = new X.ui.Carousel({
     *      direction: "x",
     *      activeIndex: 0,
     *      duration: 200,
     *      items: [new X.View(), new X.View(), new X.View()]
     * });
     * 
     * car.getActiveView();
     */
	getActiveView: function(){
		return this.config.items[this.activeIndex];
	},
	/**
	 * @method
     * @desc 마지막에 새로운 요소를 추가한다.
     * @memberof X.ui.Carousel.prototype
     * @param {Component} component 
     * @return {Component} component 
     * @example
     * carousel.append(new X.View());
     */
	append: function(comp){
		var comps = X.util.cm.create(this.carouselBody, [comp]),
		    position;
		
		this.config.items.push(comps[0]);
		comps[0].getEl().addClass('ui-carousel-views');
		
		if(this.config.direction === 'x'){
		    position = 'left';
		}
		else{
		    position = 'top';
		}
		
		comps[0].getEl().css(position, ((this.config.items.length-1) * 100) + '%');
		
		return comps[0];
	},
	/**
	 * @method
     * @desc 지정한 인덱스에 해당하는 요소를 삭제한다.
     * @memberof X.ui.Carousel.prototype
     * @param {Component} component 
     * @example
     * carousel.remove(0);
     */
	remove: function(index){
		this.config.items[index].destroy();
		this.config.items.remove(index);
	},
	destroy: function(){
		X.ui.Carousel.base.destroy.call(this);
		X.getWindow().off(X.events.orientationchange, this.orientationChange);
	},
	/**
	 * @method
     * @desc 바로 다음 요소로 이동시킨다.
     * @memberof X.ui.Carousel.prototype
     * @example
     * carousel.next();
     */
	next: function(){
		var index = this.activeIndex + 1,
			style = this.carouselBody.get(0).style;
			
		if(index === this.config.items.length){
		    return false;
		}

		style.webkitTransitionDuration = this.config.duration + 'ms';
        style.msTransitionDuration = this.config.duration + 'ms';
		style.transitionDuration = this.config.duration + 'ms';

		if(this.config.direction === 'x'){
			style.webkitTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
			style.msTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
			style.transform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
		}
		else{
			style.webkitTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
			style.msTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
			style.transform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
		}

		this.activeIndex = index;
		this.fireEvent(this, 'change', [this, this.activeIndex, this.getActiveView()]);
	},
	/**
	 * @method
     * @desc 바로 이전 요소로 이동시킨다.
     * @memberof X.ui.Carousel.prototype
     * @example
     * carousel.prev();
     */
	prev: function(){
		var index = this.activeIndex - 1,
			style = this.carouselBody.get(0).style;

		if(index === -1){
		    return false;
		}

        style.webkitTransitionDuration = this.config.duration + 'ms';
        style.msTransitionDuration = this.config.duration + 'ms';
		style.transitionDuration = this.config.duration + 'ms';

		if(this.config.direction === 'x'){
			style.webkitTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
			style.msTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
			style.transform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
		}
		else{
			style.webkitTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
			style.msTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
			style.transform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
		}

		this.activeIndex = index;
		this.fireEvent(this, 'change', [this, this.activeIndex, this.getActiveView()]);
	}
});

X.util.cm.addCString('carousel', X.ui.Carousel);
/**
 * @class 
 * @classdesc 리스트 형태의 UI를 생성한다.
 * @property {Boolean} activeRow Row 을 선택할 수 있도록 할 것인지를 지정한다.
 * @example
 * var html = "&lt;ul&gt;";
 * for (var i = 0; i<100; i++) {
 *      html = html + "&lt;li&gt;Acura&lt;/li&gt;"
 * };
 * html = html + "&lt;/ul&gt;"
 * var listview = new X.ui.ListView({
 * 		content: html
 * });
 * listview.render();
 * <pre><code>
 * &lt;div data-role="listview"&gt;
 * 		&lt;ul&gt;
 * 			&lt;li&gt;Acura&lt;/li&gt;
 * 			&lt;li&gt;Audi&lt;/li&gt;
 * 			&lt;li&gt;BMW&lt;/li&gt;
 * 			&lt;li&gt;Cadillac&lt;/li&gt;
 * 			&lt;li&gt;Ferrari&lt;/li&gt;
 * 			&lt;li&gt;Acura&lt;/li&gt;
 * 			&lt;li&gt;Audi&lt;/li&gt;
 * 			&lt;li&gt;BMW&lt;/li&gt;
 * 			&lt;li&gt;Cadillac&lt;/li&gt;
 * 			&lt;li&gt;Ferrari&lt;/li&gt;
 * 			&lt;li&gt;Acura&lt;/li&gt;
 * 			&lt;li&gt;Audi&lt;/li&gt;
 * 			&lt;li&gt;BMW&lt;/li&gt;
 * 			&lt;li&gt;Cadillac&lt;/li&gt;
 * 			&lt;li&gt;Ferrari&lt;/li&gt;
 * 			&lt;li&gt;Acura&lt;/li&gt;
 * 			&lt;li&gt;Audi&lt;/li&gt;
 * 			&lt;li&gt;BMW&lt;/li&gt;
 * 			&lt;li&gt;Cadillac&lt;/li&gt;
 * 			&lt;li&gt;Ferrari&lt;/li&gt;
 * 		&lt;/ul&gt;
 * &lt;/div&lt;
 *  </code></pre>
 */
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
	/**
     * @method 
     * @desc 리스트뷰를 화면에 render한다.
     * @memberof X.ui.ListView.prototype
     * @example
     * listview.render();
     */
	render: function(){
		X.ui.ListView.base.render.call(this);
		this.el.addClass('ui-listview');

		this.ul = this.body.children('.ui-scrollview-view').children('ul');
		this.ul.children('li').addClass('ui-listview-item');

		this.ul.on('vclick', 'li', {me: this}, this.rowClick);
		this.scrollEvent();
	},
	//구현되지 않음
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
	/**
     * @method 
     * @desc 리스트뷰의 마지막에 새로운 Row을 추가한다.
     * @memberof X.ui.ListView.prototype
     * @param {String | jQuery} 추가할 row을 문자열 또는 jquery객체로 넘긴다.
     * @example
     * listview.append('<li>Acura1</li>');
     */
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
	/**
     * @method 
     * @desc 리스트뷰의 제일 윗쪽에 새로운 Row을 추가한다.
     * @memberof X.ui.ListView.prototype
     * @param {String | jQuery} 추가할 row을 문자열 또는 jquery객체로 넘긴다.
     * @example
     * listview.prepend('<li>Acura1</li>');
     */
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
	/**
     * @method 
     * @desc 리스트뷰의 특정 Row을 새로운 Row로 교체한다.
     * @memberof X.ui.ListView.prototype
     * @param {Number} index 교체 대상이 되는 Row 의 인덱스.
     * @param {String | jQuery} row을 문자열 또는 jquery객체로 넘긴다.
     * @example
     * listview.replaceWith('<li>Acura1</li>', 10);
     */
	replaceWith: function(index, row){
		var type = X.type(row);
		if(type === 'string'){
			row = $(row).addClass('ui-listview-item');
		}
		else if(type === 'jquery'){
			row.addClass('ui-listview-item');
		}
	
		this.ul.children('li:eq(' + index + ')').replaceWith(row);
	},
	/**
     * @method 
     * @desc 특정 Row을 삭제한다.
     * @memberof X.ui.ListView.prototype
     * @param {Number} index 삭제할 Row의 인덱스
     * @example
     * listview.remove(10);
     */
	remove: function(index){
		if(X.type(index) !== 'number'){
			throw new Error('arguments must be number ');
		}
		this.ul.children('li:eq(' + index + ')').remove();
		this.scrollRefresh();
	},
	/**
     * @method 
     * @desc 전체 Row을 삭제한다.
     * @memberof X.ui.ListView.prototype
     * @example
     * listview.removeAll();
     */
	removeAll: function(){
	    this.ul.children('li').remove();
	    this.scrollRefresh();
	}
});

X.util.cm.addCString('listview', X.ui.ListView);
/**
 * @class 
 * @classdesc Tab 형태의 화면을 생성한다.
 * @property {String} position 'top' 나 'bottom'. 탭바의 위치를 지정한다. Default: 'top'
 * @property {Number} activeIndex on 기본으로 화면에 나타날 하위 view의 인덱스를 지정한다. Default: 0
 * @property {Array} titles 탭바의 각 탭 요소의 타이틀을 지정한다.
 * @property {String} transition 애니메이션 종류를 지정한다. viewcontroller의 애니메이션과 종류가 같다. Default: 'slide'
 * @property {Array} items 각 탭에 들어갈 view를 지정한다.
 * @example
 * var tabs = new X.ui.Tabs({
 *      position: 'top',
 *		activeIndex: 0,
 *		titles: ['Tabs 1', 'Tabs 2', 'Tabs 3'],
 *		transition: 'slide',
 *		items: [
 *          new X.View(), new X.View(), new X.View()
 *      ]
 * });
 * tabs.render();
 * 
 * &lt;div data-role="tabs"&gt;
 *		&lt;div data-role="view" data-title="Tabs 1" style="background:red;"&gt;Tabs 1&lt;/div&gt;
 *		&lt;div data-role="view" data-title="Tabs 2" style="background:blue;"&gt;Tabs 2&lt;/div&gt;
 *		&lt;div data-role="view" data-title="Tabs 3" style="background:yellow;"&gt;Tabs 3&lt;/div&gt;
 *	&lt;/div&gt;
 */
X.ui.Tabs = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			position: 'top',
			activeIndex: 0,
			titles: [],
			transition: 'slide',
			items: []
		};
		this.config.scroll = false;
		X.apply(this.config, config);
		X.ui.Tabs.base.initialize.call(this, this.config);
	},
	/**
     * @method 
     * @desc Tabs을 화면에 렌더한다.
     * @memberof X.ui.Tabs.prototype
     * @example
     * tabs.render();
     */
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
	/**
     * @method 
     * @desc 인자로 받은 인덱스에 해당하는 view를 활성화 시킨다.
     * @memberof X.ui.Tabs.prototype
     * @param {Number} index
     * @example
     * tabs.change(1);
     */
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
	/**
     * @method 
     * @desc 현재 활성화되어 있는 view 를 반환한다.
     * @memberof X.ui.Tabs.prototype
     * @return {X.View} view 
     * @example
     * tabs.getActiveView();
     */
	getActiveView: function(){
		return this.activeView;
	},
	/**
     * @method 
     * @desc view 현재 활성화되어 있는 view의 인덱스를 반환한다.
     * @memberof X.ui.Tabs.prototype
     * @return {Number} index
     * @example
     * tabs.getActiveViewIndex();
     */
	getActiveViewIndex: function(){
		var active = this.getActiveView();
		for(var i=0; i<this.config.items.length; i++){
			if(active === this.config.items[i]){
				return i;
			}
		}
	},
	/**
     * @method 
     * @desc 인자로 받은 인덱스에 해당하는 view를 반환한다.
     * @memberof X.ui.Tabs.prototype
     * @return {X.View} index
     * @example
     * tabs.getView();
     */
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
	/**
     * @method 
     * @desc 마지막에 새로운 탭을 생성한다.
     * @memberof X.ui.Tabs.prototype
     * @param {View} view
     * @param {String} title
     * @return {Array} 새롭게 추가된 view와 title
     * @example
     * tabs.append(new X.View, 'New Tab');
     */
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
	/**
     * @method 
     * @desc 처음에 새로운 탭을 생성한다.
     * @memberof X.ui.Tabs.prototype
     * @param {View} view
     * @param {String} title
     * @return {Array} 새롭게 추가된 view와 title
     * @example
     * tabs.prepend(new X.View, 'New Tab');
     */
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
	/**
     * @method 
     * @desc 인자로 넘긴 해당 index에 해당하는 탭을 제거한다.
     * @memberof X.ui.Tabs.prototype
     * @param {Number} index
     * @example
     * tabs.remove(1);
     */
	remove: function(index){
		this.config.items[index].destroy();
		this.config.items.remove(index);

		this.tabBar.children('.ui-tabs-bar-items').eq(index).remove();
	}
});
X.util.cm.addCString('tabs', X.ui.Tabs);
/**
 * @class 
 * @classdesc Toolbar 를 생성한다.
 * @property {String | jQuery | HtmlElement} el toolbar를 생성할 엘리먼트를 지정한다.
 * @property {String} position 'top' 나 'bottom'. 툴바의 위치를 지정한다. Default: 'top'
 * @property {String} title 텍스트박스의 타이틀을 지정한다.
 * @example
 * var toolbar = new X.ui.Toolbar({
 *      position: 'top',
 *		title: 'Header'
 * });
 * toolbar.render();
 * 
 * &lt;div data-role="toolbar"&gt;
 *      Title
 * &lt;/div&gt;
 */
X.ui.Toolbar = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
		    el: null,
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
	/**
     * @method 
     * @desc Toolbar 화면에 렌더한다.
     * @memberof X.ui.Toolbar.prototype
     * @example
     * toolbar.render();
     */
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
	/**
     * @method 
     * @desc Toolbar 에 새로운 타이틀을 지정한다.
     * @memberof X.ui.Toolbar.prototype
     * @param {String} title
     * @example
     * toolbar.setTitle('New Title');
     */
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
	/**
     * @method 
     * @desc Toolbar 의 타이틀을 반환한다.
     * @memberof X.ui.Toolbar.prototype
     * @return {String} title
     * @example
     * toolbar.getTitle();
     */
	getTitle: function(){
		if(this.title){
			return this.title.text();
		}
	},
	/**
     * @method 
     * @desc Toolbar 을 파괴한다.
     * @memberof X.ui.Toolbar.prototype
     * @example
     * toolbar.destroy();
     */
	destroy: function(){
		this.el.remove();
	}
});

X.util.cm.addCString('toolbar', X.ui.Toolbar);
/**
 * @class 
 * @classdesc Form 컴포넌트를 묶어 하나의 View를 생성한다.
 * @property {Object} minSize 각 west, east, south, nouth 의 최소 사이즈를 지정한다.
 * @property {Object} maxSize 각 west, east, south, nouth 의 최고 사이즈를 지정한다.
 * @property {Object} size 각 west, east, south, nouth 의 초기 사이즈를 지정한다.
 * @property {Object} regions 각 west, east, south, nouth 에 해당하는 view를 지정한다.
 * 
 * @example
 * var layoutview = new X.ui.LayoutView({
 * 		autoSize: true,
 * 		maxSize: { west: 700, east: 700, south: 100, nouth: 100 },
 *      minSize: { west: 200, east: 200, south: 50, nouth: 50 }, 
 *      size: { west: 300, east: 300, south: 150, nouth: 150 }, 
 * 		regions : {
 * 		    south: new X.View(),
 * 			nouth: new X.View(),
 * 			west: new X.View(),
 * 			center: new X.View(),
 * 			east: new X.View()
 * 		},
 * 		listener: {
 * 			resize: function(){
 * 				
 * 			}
 *      }
 * });
 * layoutview.render();
 * 
 *  &lt;div data-role="layoutview" data-max-size='{"west": 800, "east": 800}'&gt;
 *      &lt;div data-role="view" data-regions="nouth" style="background-color:green;" data-height="100"&gt;
 *          nouth
 *      &lt;/div&gt;
 *      &lt;div data-role="view" data-regions="south" style="background-color:green;" data-height="100"&gt;
 *          south
 *      &lt;/div&gt;
 *      &lt;div data-role="view" data-regions="west" style="background-color:red;"&gt;
 *          west
 *      &lt;/div&gt;
 *      &lt;div data-role="view" data-regions="east" style="background-color:yellow;"&gt;
 *          east
 *      &lt;/div&gt;
 *      &lt;div data-role="view" data-regions="center" style="background-color:blue;"&gt;
 *          center
 *      &lt;/div&gt;
 *  &lt;/div&gt;
 * 
 */
X.ui.LayoutView = X.extend(X.View, {
	initialize: function(config){
		this.config = {
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
		this.config.scrol = false;
		X.apply(true, this.config, config);
		
		this.resizeing = false;
		this.region = null;
		this.spliters = { };
		this.currentResizeing = null;

		X.ui.LayoutView.base.initialize.call(this, this.config);
		X.ui.LayoutView.Manager.add(this);
	},
	/**
     * @method 
     * @desc layoutview 를 화면에 렌더한다.
     * @memberof X.ui.LayoutView.prototype
     * @example
     * layoutview.render();
     */
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
		
		this.resizeSplitter();
		
		X.getWindow().on(X.events.orientationchange, { me: this }, this.orientationChange);
	},
	orientationChange: function(e){
	    var me = e.data.me;
	    me.resizeSplitter();
	    me.fire(me, 'orientationchange', [me]);
	},
	/**
     * @method 
     * @desc 생성된 LayoutView를 파괴한다.
     * @memberof X.ui.LayoutView.prototype
     * @example
     * layout.destroy();
     */
	destroy: function(){
		X.ui.LayoutView.base.destroy.call(this);
		X.ui.LayoutView.Manager.remove(this);
		X.getWindow().off(X.events.orientationchange, this.orientationChange);
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
		var direction,
            div = X.util.em.get()
                .addClass('ui-layout-spliter ' + region);
                
        if(region === 'west' || region === 'east'){
            direction = 'x';
        }
        else if(region === 'nouth' || region === 'south'){
            direction = 'y';
        }
        

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

        this[region].el.on('webkitTransitionEnd transitionend', {me: this}, this.animationEnd);
	},
	animationEnd: function(e){
        var me = e.data.me;
        X.ui.LayoutView.Manager.notice();
        
        me.fireEvent(me, 'resize', [me]);
        return false;
	},
	resizeSplitter: function(){
        var view = null,
            position = null,
            style = null,
            sw = this.spliters.west,
            se = this.spliters.east,
            sn = this.spliters.nouth,
            ss = this.spliters.south;

        if(sw){
            view = this.west;
            position = view.el.position();

            style = sw.get(0).style;
            style.height = view.getHeight() + 'px';
            style.top = position.top + 'px';
            style.left = (view.getWidth() - 10) + 'px';
        }

        if(se){
            view = this.east;
            position = view.el.position();

            style = se.get(0).style;
            style.height = view.getHeight() + 'px';
            style.top = position.top + 'px';
            style.left = position.left + 'px';
        }

        if(sn){
            view = this.nouth;

            style = sn.get(0).style;
            style.top = (view.getHeight() - 10) + 'px';
        }

        if(ss){
            view = this.south;
            position = view.el.position();

            style = ss.get(0).style;
            style.top = position.top + 'px';
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
        var size = 0;

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
        }
	}
});


X.ui.LayoutView.Manager = {
    views: { },
    add: function(view){
        var id = view.getId();
        this.views[id] = view;
    },
    remove: function(view){
        var id = view.getId();
        delete this.views[id];
    },
    notice: function(){
        var views = this.views;
        for(var view in views){
            views[view].resizeSplitter();
        }
    }
};
/**
 * @class 
 * @classdesc form 요소들의 Base 클래스 이다.
 * @property {String} config.name 넘어온 문자열을 키로 삼아 FormView에서 serialize 하게 된다. name을 넘기지 않을 경우 id 를 사용한다.
 * @property {Boolean} config.disabled 폼요소의 비활성화 상태를 나타낸다.
 * @property {String | Number} config.defaultValue 폼요소의 초기값을 설정한다.
 * @property {String} config.label 폼 요소의 label을 설정한다.
 * @property {Object | String} style 엘리먼트에 적용할 인라인 스타일을 지정한다.
 */
X.ui.Form = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
		    name: null,
			required: false,    //구현안됨
			disabled: false,
			defaultValue: null,
			label: null,
			style: { }
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
	/**
	 * @method
     * @desc 폼 요소의 name 값을 반환한다. 설정하지 않았을 경우 null 을 반환한다.
     * @memberof X.ui.Form.prototype
     * @return name 폼요소의 name 값 또는 null
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test'
     * });
     * 
     * txt.getName();
     */
	getName: function(){
		return this.config.name;
	},
	/**
	 * @method
     * @desc 폼 요소의 value 값을 지정한다. 해당 method 는 하위 클래스의 종류에 따라 오버라이드 된다.
     * @memberof X.ui.Form.prototype
     * @param val 
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test',
     *      defaultValue: 'first'
     * });
     * 
     * txt.setValue('second');
     */
	setValue: function(val){
		if (this.form.attr('disabled')) {
			return;
		}
		this.form.val(val);
		this.fireEvent(this, 'setvalue', [this, val]);
	},
	/**
	 * @method
     * @desc 폼 요소의 value 값을 반환한다. 해당 method 는 하위 클래스의 종류에 따라 오버라이드 된다.
     * @memberof X.ui.Form.prototype
     * @param val 
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test',
     *      defaultValue: 'first'
     * });
     * 
     * txt.getValue();
     */
	getValue: function(){
		return this.form.val();
	},
	labelCreate: function(){
		this.formlabel = X.util.em.get()
			.addClass('ui-form-label').html(this.config.label);
		
		this.el.append(this.formlabel);
	},
	/**
	 * @method
     * @desc 폼 요소의 화면에 show 시킨다.
     * @memberof X.ui.Form.prototype
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test',
     * });
     * 
     * txt.show();
     */
	show: function(){
		this.el.show();
		this.fireEvent(this, 'show', [this]);
	},
	/**
	 * @method
     * @desc 폼 요소의 화면에 hide 시킨다.
     * @memberof X.ui.Form.prototype
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test',
     * });
     * 
     * txt.hide();
     */
	hide: function(){
		this.el.hide();
		this.fireEvent(this, 'hide', [this]);
	},
	/**
	 * @method
     * @desc 폼 요소의 화면에 hide 시킨다.
     * @memberof X.ui.Form.prototype
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test',
     * });
     * 
     * txt.toggle();
     */
	toggle: function(){
		if(this.el.css('display') !== 'none'){
			this.hide();
		}
		else{
			this.show();
		}
	},
	/**
	 * @method
     * @desc 폼 컴포넌트의 루트 엘리먼트(jquery)를 반환한다.
     * @memberof X.ui.Form.prototype
     * @return {Object} el jquery 엘리먼트 반환
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test',
     * });
     * 
     * txt.getEl();
     */
	getEl: function(){
		return this.el;
	},
	/**
	 * @method
     * @desc 폼 컴포넌트의 아이디를 반환한다.
     * @memberof X.ui.Form.prototype
     * @return {String} id
     * @example
     * var txt = new X.ui.TextBox({
     * });
     * 
     * txt.getId();
     */
	getId: function(){
		return this.el.attr('id');
	},
	/**
	 * @method
     * @desc 폼 요소를 비활성화 상태로 변경한다.
     * @memberof X.ui.Form.prototype
     * @example
     * var txt = new X.ui.TextBox({
     *      
     * });
     * 
     * txt.disabled();
     */
	disabled: function(){
		this.el.addClass('ui-disabled');
		this.form.attr('disabled', true);
		this.fireEvent(this, 'disabled', [this]);
	},
	/**
	 * @method
     * @desc 폼 요소를 활성화 상태로 변경한다.
     * @memberof X.ui.Form.prototype
     * @example
     * var txt = new X.ui.TextBox({
     *      
     * });
     * 
     * txt.enabled();
     */
	enabled: function(){
		this.el.removeClass('ui-disabled');
		this.form.attr('disabled', false);
		this.fireEvent(this, 'enabled', [this]);
	},
	/**
	 * @method
     * @desc 폼 요소를 제거한다.
     * @memberof X.ui.Form.prototype
     * @example
     * var txt = new X.ui.TextBox({
     *      
     * });
     * 
     * txt.destroy();
     */
	destroy: function(){
		this.el.remove();
	}
});
/**
 * @class 
 * @classdesc Form 컴포넌트를 묶어 하나의 View를 생성한다.
 * @example
 * var formView = new X.ui.Form({
 *      items: [
 *          new X.ui.TextBox(),
 *          new X.ui.ProgressBar(),
 *          new X.ui.Slider(),
 *          new X.ui.Switchbox(),
 *          new X.ui.Spinner()
 *      ]
 * });
 * <pre><code>
 * 	&lt;div data-role="formview"&gt;
 * 		&lt;div data-role="textbox" data-label="text" data-name="text"&gt;&lt;/div&gt;
 * 		&lt;div data-role="progress" data-label="progress"&gt;&lt;/div&gt;
 * 		&lt;div data-role="slider" data-label="slider"&gt;&lt;/div&gt;
 * 		&lt;div data-role="textbox" data-label="password" data-type="password"&gt;&lt;/div&gt;
 * 		&lt;div data-role="switchbox" data-label="switchbox" data-checked="true"&gt;&lt;/div&gt;
 * 	&lt;/div&gt;
 * </code></pre>
 */
X.ui.FormView = X.extend(X.View, {
	initialize: function(config){
		this.config = {	};
		X.apply(this.config, config);
		X.ui.FormView.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.FormView.base.render.call(this);
	},
	/**
	 * @method
     * @desc 내부에 가지고 있는 폼 컨트롤들을 문자열 형태로 직렬화한다.
     * @memberof X.ui.Form.prototype
     * @return {String} 직렬화된 문자열
     * @example
     * var formView = new X.ui.Form({
     *      items: [
     *          new X.ui.TextBox(),
     *          new X.ui.ProgressBar(),
     *          new X.ui.Slider(),
     *          new X.ui.Switchbox(),
     *          new X.ui.Spinner()
     *      ]
     * });
     * 
     * formView.serialize();
     */
	serialize: function(){
		return $.param(this.getJSON());
	},
	/**
	 * @method
     * @desc 내부에 가지고 있는 폼 컨트롤들을 문자열 형태로 직렬화한다.
     * @memberof X.ui.Form.prototype
     * @return {Object} 직렬화된 json 객체
     * @example
     * var formView = new X.ui.Form({
     *      items: [
     *           new X.ui.TextBox(),
     *          new X.ui.ProgressBar(),
     *          new X.ui.Slider(),
     *          new X.ui.Switchbox(),
     *          new X.ui.Spinner()
     *      ]
     * });
     * 
     * formView.getJSON();
     */
	getJSON: function(){
		var params = { },
			items = this.config.items,
			len = items.length;
		
		for(var i=0; i<len; i++){
			params[items[i].getName() || items[i].getId()] = items[i].getValue();
		}

		return params;
	}
});
/**
 * @class 
 * @classdesc TextBox 를 생성한다.
 * @property {String} placeholder placeholder를 지정한다. Default: 'please..'
 * @property {String} type 텍스트박스의 type를 지정한다. Default: 'text'
 * @example
 * var textbox = new X.ui.TextBox({
 *      placeholder: 'please..',
 *		type: 'text'
 * });
 * textbox.render();
 * 
 * &lt;div data-role="textbox"&gt;&lt;/div&gt;
 */
X.ui.TextBox = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
		    placeholder: 'please..',
			type: 'text'
		};
		X.apply(this.config, config);
		X.ui.TextBox.base.initialize.call(this, this.config);
	},
	/**
     * @method 
     * @desc TextBox를 화면에 렌더한다.
     * @memberof X.ui.TextBox.prototype
     * @example
     * textbox.render();
     */
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
	/**
     * @method 
     * @desc TextBox의 type 를 변경한다.
     * @memberof X.ui.TextBox.prototype
     * @param {String} type
     * @example
     * textbox.setType('password');
     */
	setType: function(type){
		this.form.prop('type', type);
	},
	/**
     * @method 
     * @desc TextBox의 placeholder 를 변경한다.
     * @memberof X.ui.TextBox.prototype
     * @param {String} placeholder
     * @example
     * textbox.setType('please your id..');
     */
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
/**
 * @class 
 * @classdesc 슬라이더바를 생성한다.
 * @property {Number} min 슬라이더의 최소값을 지정한다. Default: 0
 * @property {Number} max 슬라이더의 최고값을 지정한다. Default: 100
 * @property {Number} 한번에 이동할 슬라이더의 step을 지정한다. Default: 1
 * @property {Number} defaultValue 슬라이더의 기본값을 지정한다. Default: 50
 * @property {String} direction 'x' 나 'y'. 슬라이더의 방향을 지정한다. Default: 'x'
 * @property {Boolean} subhandle 두개의 핸들을 생성할지 여부를 지정한다. Default: false
 * @example
 * var slider = new X.ui.Slider({
 *      min: 0,
 *		max: 100,
 *		step: 1,
 *		defaultValue: 50,
 *		direction: 'x',
 *		subhandle: false
 * });
 * slider.render();
 * <pre><code>
 * &lt;div data-role="slider" style="width: 300px;margin:30px;" data-default-value="25"&gt;&lt;/div&gt;
 * </code></pre>
 */
X.ui.Slider = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			min: 0,
			max: 100,
			step: 1,
			defaultValue: 50,
			direction: 'x',
			subhandle: false
		};
		X.apply(this.config, config);
		X.ui.Slider.base.initialize.call(this, this.config);
	},
	/**
     * @method 
     * @desc 슬라이더를 화면에 렌더한다.
     * @memberof X.ui.Slider.prototype
     * @example
     * slider.render();
     */
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
	/**
     * @method 
     * @desc 슬라이더에 새로운 value를 업데이트한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.setValue(50);
     */
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
			max = this.getMax(),
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
	/**
     * @method 
     * @desc 슬라이더에 value를 반환한다.
     * @memberof X.ui.Slider.prototype
     * @return {Number} val
     * @example
     * slider.getValue();
     */
	getValue: function(){
		if(this.subhandle){
			return [this.handle.data('data'), this.subhandle.data('data')];
		}
		else{
			return this.handle.data('data');
		}
	},
	/**
     * @method 
     * @desc 슬라이더를 disabled 상태로 변환한다.
     * @memberof X.ui.Slider.prototype
     * @example
     * slider.disabled();
     */
	disabled: function(){
		this.el.addClass('ui-disabled');
		this.handle.addClass('ui-disabled');
		if(this.subhandle){
			this.subhandle.addClass('ui-disabled');
		}
		this.form.attr('disabled', true);
		this.fireEvent(this, 'disabled', [this]);
	},
	/**
     * @method 
     * @desc 슬라이더를 enabled 상태로 변환한다.
     * @memberof X.ui.Slider.prototype
     * @example
     * slider.enabled();
     */
	enabled: function(){
		this.el.removeClass('ui-disabled');
		this.handle.removeClass('ui-disabled');
		if(this.subhandle){
			this.subhandle.removeClass('ui-disabled');
		}
		this.form.attr('disabled', false);
		this.fireEvent(this, 'enabled', [this]);
	},
	/**
     * @method 
     * @desc 프로그래스 바의 최소값을 변경한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} min
     * @example
     * slider.setMin(0);
     */
	setMin: function(min){
		this.config.min = min;
	},
	/**
     * @method 
     * @desc 프로그래스 바의 최고값을 변경한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} max
     * @example
     * slider.setMax(100);
     */
	setMax: function(max){
		this.config.max = max;
	},
	/**
     * @method 
     * @desc 프로그래스 바의 최소값을 반환한다.
     * @memberof X.ui.Slider.prototype
     * @return {Number} min
     * @example
     * slider.getMin();
     */
	getMin: function(){
		return this.config.min;
	},
	/**
     * @method 
     * @desc 프로그래스 바의 최고값을 반환한다.
     * @memberof X.ui.Slider.prototype
     * @return {Number} max
     * @example
     * slider.getMax();
     */
	getMax: function(){
		return this.config.max;
	}
});

X.util.cm.addCString('slider', X.ui.Slider);
/**
 * @class 
 * @classdesc spinner 를 생성한다.
 * @property {Number} min 최소값을 지정한다. Default: 0
 * @property {Number} max 최고값을 지정한다. Default: 100
 * @property {Number} step step을 지정한다. Default: 1
 * @property {Number} defaultValue 기본값을 지정한다. Default: 0
 * @example
 * var spinner = new X.ui.Spinner({
 *      min: 0,
 *		max: 100,
 *		step: 1,
 *		defaultValue: 0
 * });
 * spinner.render();
 * 
 * &lt;div data-role="spinner"&gt;&lt;/div&gt;
 */
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
	/**
     * @method 
     * @desc spinner를 화면에 렌더한다.
     * @memberof X.ui.Spinner.prototype
     * @example
     * spinner.render();
     */
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
	/**
     * @method 
     * @desc 슬라이더의 value를 업데이트한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.setValue(50);
     */
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
	/**
     * @method 
     * @desc 슬라이더의 최고값을 변경한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.setMax(100);
     */
	setMax: function(max){
		this.config.max = max;
		this.form.attr('max', max);
	},
	/**
     * @method 
     * @desc 슬라이더의 최소값을 변경한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.setMin(0);
     */
	setMin: function(min){
		this.config.min = min;
		this.form.attr('min', min);
	},
	/**
     * @method 
     * @desc 슬라이더의 최고값을 반환한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.getMax();
     */
	getMax: function(){
		return this.config.max;
	},
	/**
     * @method 
     * @desc 슬라이더의 최소값을 반환한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.getMin();
     */
	getMin: function(){
		return this.config.min;
	},
	/**
     * @method 
     * @desc 슬라이더의 step 값을 변경한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.setStep(5);
     */
	setStep: function(step){
		this.config.step = step;
		this.form.attr('step', step);
	}
});

X.util.cm.addCString('spinner', X.ui.Spinner);
/**
 * @class 
 * @classdesc 프로그레스 바를 생성한다.
 * @property {Number} max 최고값을 지정한다.
 * @property {Number} defaultValue 기본값을 지정한다.
 * @example
 * var progress = new X.ui.Progressbar({
 *      max: 100,
 *		defaultValue: 0
 * });
 * progress.render();
 * 
 * <pre><code>
 *      &lt;div data-role="progress" data-max="100" data-default-value="0"&gt;&lt;/div&gt;
 * </code></pre>
 */
X.ui.Progressbar = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			max: 100,
			defaultValue: 0
		};
		X.apply(this.config, config);
		X.ui.Progressbar.base.initialize.call(this, this.config);
	},
	/**
     * @method 
     * @desc 프로그래스 바를 화면에 렌더한다.
     * @memberof X.ui.Progressbar.prototype
     * @example
     * progress.render();
     */
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
	/**
     * @method 
     * @desc 프로그래스 바의 value를 업데이트한다.
     * @memberof X.ui.Progressbar.prototype
     * @param {Number} val
     * @example
     * progress.setValue(50);
     */
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
	/**
     * @method 
     * @desc 프로그래스 바의 최고값을 변경한다.
     * @memberof X.ui.Progressbar.prototype
     * @param {Number} max
     * @example
     * progress.setMax(100);
     */
	setMax: function(max){
		this.config.max = max;
	},
	/**
     * @method 
     * @desc 프로그래스 바의 최고값을 반환한다.
     * @memberof X.ui.Progressbar.prototype
     * @return {Number} max
     * @example
     * progress.getMax();
     */
	getMax: function(max){
		return this.config.max;
	}
});

X.util.cm.addCString('progressbar', X.ui.Progressbar);
/**
 * @class 
 * @classdesc SwitchBox 를 생성한다.
 * @property {Boolean} checked 체크 상태를 지정한다. Default: false
 * @property {String} on on 상태의 텍스트를 지정한다. Default: 'ON'
 * @property {String} off off 상태의 텍스트를 지정한다. Default: 'OFF'
 * @example
 * var sb = new X.ui.SwitchBox({
 *      checked: false,
 *		on: 'ON',
 *		off: 'OFF'
 * });
 * sb.render();
 * 
 * &lt;div data-role="switchbox"&gt;&lt;/div&gt;
 */
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
	/**
     * @method 
     * @desc SwitchBox 화면에 렌더한다.
     * @memberof X.ui.SwitchBox.prototype
     * @example
     * sb.render();
     */
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
	/**
     * @method 
     * @desc on 상태의 텍스트를 변경한다.
     * @memberof X.ui.SwitchBox.prototype
     * @param {String} on
     * @example
     * sb.setOn('A');
     */
	setOn: function(on){
		this.config.on = on;

		this.setText();
	},
	/**
     * @method 
     * @desc off 상태의 텍스트를 변경한다.
     * @memberof X.ui.SwitchBox.prototype
     * @param {String} off
     * @example
     * sb.setOff('B');
     */
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
	/**
     * @method 
     * @desc 체크 상태를 반전 시킨다.
     * @memberof X.ui.SwitchBox.prototype
     * @example
     * sb.toggleChecked();
     */
	toggleChecked: function(){
		if(this.el.hasClass('on')){
			this.unchecked();
		}
		else{
			this.checked();
		}
	},
	/**
     * @method 
     * @desc 체크 상태로 변경한다.
     * @memberof X.ui.SwitchBox.prototype
     * @example
     * sb.checked();
     */
	checked: function(){
		if(this.el.hasClass('ui-disabled')){
			return;
		}
		
		this.el.removeClass('off').addClass('on');
		
		this.setText();
		this.form.attr('checked', true);

		this.fireEvent(this, 'change', [this, true]);
	},
	/**
     * @method 
     * @desc 체크 상태를 해제한다.
     * @memberof X.ui.SwitchBox.prototype
     * @example
     * sb.unchecked();
     */
	unchecked: function(){
		if(this.el.hasClass('ui-disabled')){
			return;
		}
		
		this.el.removeClass('on').addClass('off');
		
		this.setText();
		this.form.attr('checked', false);
		this.fireEvent(this, 'change', [this, false]);
	},
	/**
     * @method 
     * @desc 체크 상태 유무를 반환한다. checked 일 경우 true, 아닐경우 false.
     * @memberof X.ui.SwitchBox.prototype
     * @example
     * sb.getValue();
     */
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

	function SetLink(rel, icon, size){
		var link = $('<link />');
		link.attr('rel', rel);
		link.attr('href', icon);
		
		if (size) {
			link.setAttribute('sizes', size + 'x' + size);
		}
		head.eq(0).append(link);
	}	
	
	/**
     * @static
     * @memberof X
     * @desc x ui Application 을 시작한다.
     * @property {String} config.id 어플리케이션의 ID를 지정한다. 해당 아이디는 최상위 View의 ID 이다. Defautl: Application
     * @property {String} config.icon 아이콘을 지정한다. Defautl: null
     * @property {String} config.iconsize 아이콘 사이즈를 지정한다. 144×144 (iPad retina), 114×114 (iPhone retina), 72×72 (iPad), 57×57 (iPhone, Android). Defautl: null
     * @property {String} config.splash 스플래시 이미지를 지정한다. Defautl: null
     * @property {Boolean} config.viewport viewport 를 사용할지를 지정한다. Defautl: true
     * @property {String} config.statusbar statusbar 색상을 지정한다. <br/>
     * @property {Function} config.readyapplication 생성이 준비되면 호출되는 함수를 지정한다.
     * @property {String} config.initialScale initialScale 을 지정한다. Default: 1
     * @property {Number} config.maximumScale maximumScale 을 지정한다. Default: 1
     * @property {Number} config.minimumScale minimumScale 을 지정한다. Default: 1
     * @property {Number} config.userScalable userScalable 을 지정한다. Default: 'no'
     * @property {String} config.targetDensityDpi 안드로이드에서 사용되는 targetDensityDpi 을 지정한다. Default: 'device-dpi'
     */
	X.App = function(config){
		var default_config = {
		    id: 'Application',
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
			userScalable: 'no',
			targetDensityDpi: 'device-dpi'
		};
		config = X.apply(default_config, config);

		if(config.viewport){
			SetMeta('viewport', 'initial-scale=' + default_config.initialScale + 
					', maximum-scale=' + default_config.maximumScale + 
					', minimum-scale=' + default_config.minimumScale + 
					', user-scalable=' + default_config.userScalable +
					', target-densitydpi=' + default_config.targetDensityDpi);
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
	
	/**
     * @static
     * @memberof X
     * @desc Application 생성 후 가장 최상위에 생성되는 View를 반환한다.
     * @returns {X.View} X.View 를 반환한다.
     */
	X.getApp = function(){
		if(X.App.View){
			return X.App.View;
		}
		return null;
	};
})();