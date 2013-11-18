(function(){
	
	var head = $('head');
	function SetMeta(name, content){
		var meta = $('<meta />');
		meta.attr('name', name);
		meta.attr('content', content);
		head.eq(0).append(meta);
    }
	
	/*
	    144×144 (iPad retina)
        114×114 (iPhone retina)
        72×72 (iPad)
        57×57 (iPhone, Android)
	*/
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
	
	
	/**
     * Application 생성 후 가장 최상위에 생성되는 View를 반환한다.
     * @returns {X.View} X.View 를 반환한다.
     */
	X.getApp = function(){
		if(X.App.View){
			return X.App.View;
		}
		return null;
	};
})();