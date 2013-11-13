X = {
    version : '1.0.1'
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