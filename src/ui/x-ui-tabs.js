X.ui.Tabs = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			position: 'top',
			activeIndex: 0,
			titles: [],
			autoSize: true,
			transition: 'slide',
			scroll: false,
			items: []
		};
		X.apply(this.config, config);
		X.ui.Tabs.base.initialize.call(this, this.config);
	},
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
	getActiveView: function(){
		return this.activeView;
	},
	getActiveViewIndex: function(){
		var active = this.getActiveView();
		for(var i=0; i<this.config.items.length; i++){
			if(active === this.config.items[i]){
				return i;
			}
		}
	},
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
	remove: function(index){
		this.config.items[index].destroy();
		this.config.items.remove(index);

		this.tabBar.children('.ui-tabs-bar-items').eq(index).remove();
	}
});
X.util.cm.addCString('tabs', X.ui.Tabs);