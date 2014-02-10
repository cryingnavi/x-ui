X.util.ElementManager = X.util.em = {
	id: 'x-ui-',
	index: 1,
	get: function(selector){
		if(selector){
			var type = X.type(selector);
			if(type === 'string' || type === 'dom'){
				var el = $(selector),
					me = this;
				
				el.each(function(){
					if(!this.id){
						this.id = me.id + me.index++;
					}
				});

				return el;
			}
			else if(type === 'jquery'){
				var el = selector,
					me = this;
				
				el.each(function(){
					if(!this.id){
						this.id = me.id + me.index++;
					}
				});

				return el;
			}
			else if(type === 'object'){
				var config = selector,
					tag = config.tag;
				
				return this.create(tag, config);
			}
		}

		return this.create();
	},
	create: function(tag, config){
		var el = null;
		config = config || {};
		delete config.tag;
		if(tag){
			el = $('<' + tag + ' />', config);
		}
		else{
			el = $('<div />', config);
		}

		if(config.id){
			el.attr('id', config.id);
		}
		else{
			el.attr('id', this.id + this.index++);
		}

		return el;
	}
};