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