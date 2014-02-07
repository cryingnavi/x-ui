/**
 * X namespace
 * @namespace
 * @version @@version
 */
X = {
    version : '@@version'
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