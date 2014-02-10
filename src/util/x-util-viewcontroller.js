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
	fromStart: function (fromView, transition, reverse, fn) {
		var fel = null;

		fel = fromView.getEl();
		fel.addClass(transition + ' out ' + reverse + ' ui-transitioning');

		if(transition !== 'none' && fn){
			fel.animationComplete(fn);
		}
		else if(fn){
			fn();
		}
	},
	toStart: function(toView, transition, reverse, fn){
		var tel = null;

		tel = toView.getEl();
		tel.addClass(transition + ' in ' + reverse + ' ui-transitioning ui-vc-active').removeClass('ui-view-hide');

		if(transition !== 'none' && fn){
			tel.animationComplete(fn);
		}
		else if(fn){	
			fn();
		}
	},
	done: function(fromView, toView, transition, reverse, deferred){
		var tel = null,
	        fel = null;
	        
		tel = toView.getEl();
		tel.removeClass(transition + ' in ' + reverse + ' ui-transitioning');

		fel = fromView.getEl();
		fel.removeClass(transition + ' out ' + reverse + ' ui-transitioning ui-vc-active');

		fromView.hide();
		deferred.resolve(this, [fromView, toView]);
	},
	transitionStart: function(fromView, toView, transition, reverse){
		var deferred = new $.Deferred(),
			transitionHandler = null;

		if(transition !== 'flow'){
			this.fromStart(fromView, transition, reverse);			
			this.toStart(toView, transition, reverse, $.proxy(function(){
				this.done(fromView, toView, transition, reverse, deferred);

				fromView = null, toView = null, transition = null, reverse = null, deferred = null;
			}, this));
		}
		else{
			this.fromStart(fromView, transition, reverse, $.proxy(function(){
				this.toStart(toView, transition, reverse, $.proxy(function(){
					this.done(fromView, toView, transition, reverse, deferred);

					fromView = null, toView = null, transition = null, reverse = null, deferred = null;
				}, this));
			}, this));
		}
		
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