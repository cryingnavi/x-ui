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
 *      children: [
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
		this.view.addChildren([toView]);
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
			this.view.addChildren([toView]);
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