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