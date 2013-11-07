X.ui.Toolbar = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
			position: 'top',
			title: null
		};
		X.apply(this.config, config);
		
		var listener = { };
		if(this.config.listener){
			listener = this.config.listener;
		}
		X.ui.Toolbar.base.initialize.call(this, listener);
		
		if(!this.config.el){
			this.config.el = {
				tag: 'div',
				id: this.config.id
			};
		}
		this.el = X.util.em.get(this.config.el);
		
		if(!X.util.cm.get(this.el.get(0).id)){
			X.util.cm.set(this.el.get(0).id, this);
		}

		if(this.config.autoRender){
			this.render();
		}
	},
	render: function(){
		this.fireEvent(this, 'beforerender', [this]);
		
		this.el.addClass('ui-toolbar ' + this.config.position);

		this.inner = X.util.em.get()
			.addClass('ui-toolbar-inner');

		this.el.append(this.inner);

		this.setTitle(this.config.title);
		
		var parent = this.el.parent();
		if(this.config.position === 'bottom'){
			parent.append(this.el);
		}
		else{
			parent.prepend(this.el);
		}
		
		this.fireEvent(this, 'afterrender', [this]);
	},
	setTitle: function(title){
		if(!this.title){
			this.title = X.util.em.get().
				addClass('ui-toolbar-title');

			this.inner.append(this.title);
			this.title.html(title);
			return;
		}
		this.title.html(title);
		this.fireEvent(this, 'changetitle', [this, title]);
	},
	getTitle: function(){
		if(this.title){
			return this.title.text();
		}
	},
	destroy: function(){
		this.el.remove();
	}
});

X.util.cm.addCString('toolbar', X.ui.Toolbar);