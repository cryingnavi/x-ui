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
	createInitItems: function(){
	    var el = this.body.children('.ui-scrollview-view');
		if(el.length < 1){
			el = this.body;
		}
		var comps = X.util.cm.create(el, this.config.items);

		this.config.items = comps;
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