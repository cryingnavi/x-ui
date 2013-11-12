X.ui.Accordion = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			titles: [],
			items: [],
			scroll: false,
			activeIndex: 0
		};
		X.apply(this.config, config);
		X.ui.Accordion.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.Accordion.base.render.call(this);
		this.el.addClass('ui-accordion');
		
		this.createItems();
		this.createTitle();

		views = this.body.on('vclick', '.ui-accordion-views > .ui-accordion-title', { me: this }, function(e){
			var me = e.data.me;
			
			var index = me.body.children('.ui-accordion-views').index($(this).parent());
			me.change(index);
			return false;
		});
	},
	createItems: function(){
		this.body.children('.ui-view').each(function(){
			var div = X.util.em.get()
				.addClass('ui-accordion-views ui-accordion-close');
			
			$(this).wrap(div);
		});

		var items = this.body.children('.ui-accordion-views');
		items.eq(this.config.activeIndex)
			.removeClass('ui-accordion-close')
			.addClass('ui-accordion-open');

		var me = this;
		this.config.items.forEach(function(view, i){
			if(me.config.activeIndex !== i){
				view.hide();
			}
		});
	},
	createTitle: function(){
		var views = this.body.children('.ui-accordion-views'),
			titles = this.config.titles;
		views.each(function(i){
			if(titles[i]){
				div = X.util.em.get()
					.addClass('ui-accordion-title')
					.html(titles[i]);
				
				$(this).prepend(div);
			}
		});

		titles = null;		
	},
	change: function(index){
		if(this.config.activeIndex === index){
			return;
		}
		
		this.body.children('.ui-accordion-views')
			.removeClass('ui-accordion-open')
			.addClass('ui-accordion-close')
			.eq(index).addClass('ui-accordion-open')
			.removeClass('ui-accordion-close');


		this.config.items.forEach(function(view, i){
			if(index !== i){
				view.hide();
			}
			else{
				view.show();
			}
		});
		
		this.config.activeIndex = index;

		this.fireEvent(this, 'change', [this]);
	},
	append: function(comp, title){
		var div = X.util.em.get()
				.addClass('ui-accordion-views ui-accordion-close');

		var titleDiv = X.util.em.get()
					.addClass('ui-accordion-title')
					.html(title);

		this.body.append(div);
		comp = X.util.cm.create(div, [comp]);
		div.prepend(titleDiv);

		this.config.activeIndex = null;

		return [comp[0], title];
	},
	prepend: function(comp, title){
		var div = X.util.em.get()
				.addClass('ui-accordion-views ui-accordion-close');

		var titleDiv = X.util.em.get()
					.addClass('ui-accordion-title')
					.html(title);

		this.body.prepend(div);
		comp = X.util.cm.create(div, [comp]);
		div.prepend(titleDiv);

		this.config.activeIndex = null;

		return [comp[0], title];
	},
	remove: function(index){
		this.body.children('.ui-accordion-views').eq(index).remove();
		this.config.items = this.config.items.filter(function(el, i){
			return (index !== i);
		});

		this.config.titles = this.config.titles.filter(function(el, i){
			return (index !== i);
		});
		this.config.activeIndex = null;
	},
	removeAll: function(){
		this.body.empty();
		this.config.activeIndex = null;
	},
	changeTitle: function(title, index){
		index = index || 0;
		var view = this.body.children('.ui-accordion-views')
			.eq(index);
		
		view
			.children('.ui-accordion-title')
			.html(title);
		
		this.config.titles[index] = title;
	},
	getItem: function(index){
		return this.config.items[index];
	}
});

X.util.cm.addCString('accordion', X.ui.Accordion);