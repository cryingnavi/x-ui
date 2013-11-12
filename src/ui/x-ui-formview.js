X.ui.FormView = X.extend(X.View, {
	initialize: function(config){
		this.config = {	};
		X.apply(this.config, config);
		X.ui.FormView.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.FormView.base.render.call(this);
	},
	serialize: function(){
		return $.param(this.getJSON());
	},
	getJSON: function(){
		var params = { },
			items = this.config.items,
			len = items.length;
		
		for(var i=0; i<len; i++){
			params[items[i].getName()] = items[i].getValue();
		}

		return params;
	}
});