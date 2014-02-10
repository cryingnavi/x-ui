/**
 * @class 
 * @classdesc View 를 생성한다. View란 화면의 기본 단위이며 기본적인 container 역할을 수행한다.
 * @memberof X
 * @property {String | jQuery | HtmlElement} el view 를 생성할 엘리먼트를 지정한다.
 * @property {Number | String} width view 의 가로 사이즈를 지정한다. autoSize 가 true 일 경우 무시된다.
 * @property {Number | String} height view 의 세로 사이즈를 지정한다. autoSize 가 true 일 경우 무시된다.
 * @property {Boolean} autoSize 자동으로 부모 요소를 가득 채울지를 결정한다. 기본값이 True 이다
 * @property {Boolean} scroll 스크롤을 생성할지 여부를 지정한다.
 * @property {Object} scrollConfig 스크롤 options 을 지정한다.
 * @property {String | jQuery} content view 가 가질 content 를 지정한다. html 문자열 또는 jquery 객체를 받는다.
 * @property {Array} children 하위에 포함할 다른 controll 들을 지정한다.
 * @property {Array} toolbars view 가 포함할 툴바를 지정한다.
 * @property {Boolean} floating view 를 팝업형태로 화면에 띄울지를 지정한다.
 * @property {Boolean} overlay floating true 일때 회색 배경을 덮을지를 지정한다.
 * @property {X.util.ViewController} viewController 
 * @property {String} layout 하위 view 들이 가로 또는 세로로 배열되도록 한다. 기본값은 세로이다. 'x' | 'y'.
 * @property {Boolean} flexible view 가 flexible 하게 자신의 크기를 결정할지 여부이다. false 로 지정하고 width, height 를 지정하면 해당 크기대로 view 가 결정된다.
 * @property {Object} panels 왼쪽, 오른쪽에 숨겨진 view를 지정한다.
 * @property {String} className view 에 지정할 클래스이름
 * @property {String | Object} style view 에 적용할 style
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
			children: [ ],
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
		
		if(this.config.children.length > 0){
			this.createInitChildren();
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
     * @desc View 안에 새로운 html 을 넣어 표현한다. 이때 data-ui 을 해석하여 x-ui 의 컴포넌트를 생성한다.
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
	createInitChildren: function(){
    	var el = this.body.children('.ui-scrollview-view');
    	if(el.length < 1){
    		el = this.body;
    	}
    	var children = X.util.cm.create(el, this.config.children);
    
    	this.config.children = children;
    },
    /**
     * @method 
     * @desc View 안에 새로운 컴포넌트를 자식으로 추가한다.
     * @memberof X.View.prototype
     * @param {Array} children
     * @example
     * view.addChildren([new X.View(), new X.ui.ListView(), new X.ui.TextBox()]);
     */
	addChildren: function(children){
		var el = this.body.children('.ui-scrollview-view');
		if(el.length < 1){
			el = this.body;
		}
		children = X.util.cm.create(el, children);
		this.config.children = $.unique(this.config.children.concat(children));
		this.config.children.reverse();
		
		return children;
	},
	/**
     * @method 
     * @desc View 안에 있는 컴포넌트를 삭제한다.
     * @memberof X.View.prototype
     * @param {Number} index
     * @example
     * view.removeChildren(1);
     */
	removeChildren: function(index){
		this.config.children[index].destroy();
		this.config.children.remove(index);
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
     * @desc View 안에 바인딩 되어 있는 html 들 중 data-ui 로 기술된 컴포넌트들을 해석하여 x-ui 컴포넌트로 변경한다.
     * @memberof X.View.prototype
     * @example
     * 
     * //view content
     * &lt;div data-ui="toolbar"&gt;
     *  &lt;h1&gt;Toolbar&lt;/h1&gt;
     * &lt;/div&gt;
     * &lt;div data-ui="listview"&gt;
     *  &lt;ul&gt;
     *      &lt;li&gt;A&lt;/li&gt;
     *      &lt;li&gt;B&lt;/li&gt;
     *      &lt;li&gt;C&lt;/li&gt;
     *  &lt;/ul&gt;
     * &lt;/div&gt;
     * &lt;div data-ui="textbox"&gt;&lt;/div&gt;
     * 
     * //view 컴포넌트 해석
     * view.createHtmlComponent();
     */
	createHtmlComponent: function(){
		var	views = this.el.find('[data-ui="view"]');
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

		var panels = this.el.find('[data-ui="view"][data-panels="true"]');
		panels.each(function(){
			var id = this.id,
				view = X.util.cm.get(id),
				panels = { }, left, right;

			if(!view.scroll){
				left = view.body.children('[data-ui="view"][data-panels="left"]');
				right = view.body.children('[data-ui="view"][data-panels="right"]');

				if(left.length > 0){
					panels.left = X.util.cm.get(left.get(0).id);
				}

				if(right.length > 0){
					panels.right = X.util.cm.get(right.get(0).id);
				}
			}

			view.panelsCreate(panels);
		});

		var	comps = this.el.find('[data-ui]').not('[data-ui="view"]');
		var charts = [];
		
		comps.each(function(){
			var el = $(this),
				comp = el.data('ui');

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
				var tabs = el.children('[data-ui="view"]'),
					children = [ ], titles = [ ];
				
				tabs.each(function(){
					children.push(X.util.cm.get(this.id));
					titles.push(this.dataset.title);
				});

				config.children = children;
				config.titles = titles;
				
				new X.ui.Tabs(config);
			}

			if(comp === 'carousel'){
				var views = el.children('[data-ui="view"]'),
					children = [ ];
				
				views.each(function(){
					children.push(X.util.cm.get(this.id));
				});

				config.children = children;
				new X.ui.Carousel(config);
			}

			if(comp === 'listview'){
				new X.ui.ListView(config);
			}

			if(comp === 'accordion'){
				var views = el.children('[data-ui="view"]'),
					children = [ ], titles = [ ];

				views.each(function(i){
					children.push(X.util.cm.get(this.id));
					titles.push(this.dataset.title);
				});

				config.children = children;
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

		var	formView = this.el.find('[data-ui="formview"]');
		formView.each(function(){
			var el = $(this),
				children = [],
				selector = '[data-ui="textbox"],' +
					'[data-ui="slider"],' +
					'[data-ui="spinner"],' + 
					'[data-ui="switchbox"],' +
					'[data-ui="progress"]';
			
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
				children.push(X.util.cm.get(this.id));
			});

			config.el = el;
			config.children = children;
			config.autoRender = true;

			new X.ui.FormView(config);
		});
	}	
});

X.util.cm.addCString('view', X.View);