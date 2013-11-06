X.ui.Progressbar = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			max: 100,
			defaultValue: 0
		};
		X.apply(this.config, config);
		X.ui.Progressbar.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.Progressbar.base.render.call(this);
		
		this.el.addClass('ui-progressbar');
	
		this.formCreate();
		
		this.setValue(this.config.defaultValue);
		
		this.fireEvent(this, 'afterrender', [this]);
	},
	formCreate: function(){
		this.form = X.util.em.get({
			tag: 'progress',
			'class': 'ui-progress',
			max: this.config.max,
			value: this.config.defaultValue
		});
		
		this.gauge = X.util.em.get().addClass('ui-progress-gauge');
		this.bar = X.util.em.get().addClass('ui-progress-bar');
		this.formcontin.append(this.gauge, this.bar);
		this.formcontin.append(this.form);
	},
	setValue: function(val){
		if (this.el.hasClass('ui-disabled')) {
			return;
		}
		
		var w = this.el.width(),
			percent = (w / this.config.max) * val;

		if(isNaN(percent)){
			return;
		}
		
		if(percent > w){
			percent = w;
		}		
		
		if(val < 0){
			val = 0;
		}
		
		if(val > this.config.max){
			val = this.config.max;
		}
		this.form.val(val);
		
		this.gauge.width(percent);
		this.fireEvent(this, 'update', [this, val]);
	},
	setMax: function(max){
		this.config.max = max;
	},
	getMax: function(max){
		return this.config.max;
	},
	disabled: function(){
		this.el.addClass('ui-disabled');
		this.fireEvent(this, 'disabled', [this]);
	},
	enabled: function(){
		this.el.removeClass('ui-disabled');
		this.fireEvent(this, 'enabled', [this]);
	}
});

X.util.cm.addCString('progressbar', X.ui.Progressbar);