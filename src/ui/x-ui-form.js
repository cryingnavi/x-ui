X.ui.Form = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
			placeholder: 'please..',
			required: false,
			disabled: false,
			defaultValue: null,
			label: null
		};
		X.apply(this.config, config);
			
		var listener = {};
		if(this.config.listener){
			listener = this.config.listener;
		}
		X.ui.Form.base.initialize.call(this, listener);

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
		this.el.addClass('ui-form-box');
		
		if(this.config.label){
			this.labelCreate();
		}
		
		if(this.config.style){
			this.el.css(this.config.style);
		}
		
		this.formcontin = X.util.em.get()
			.addClass('ui-form-container');
		
		this.el.append(this.formcontin);

		if(this.config.disabled){
			this.disabled();
		}
	},
	getName: function(){
		return this.config.name || this.el.get(0).id;
	},
	setValue: function(val){
		if (this.form.attr('disabled')) {
			return;
		}
		this.form.val(val);
		this.fireEvent(this, 'setvalue', [this, val]);
	},
	getValue: function(){
		return this.form.val();
	},
	labelCreate: function(){
		this.formlabel = X.util.em.get()
			.addClass('ui-form-label').html(this.config.label);
		
		this.el.append(this.formlabel);
	},
	show: function(){
		this.el.show();
		this.fireEvent(this, 'show', [this]);
	},
	hide: function(){
		this.el.hide();
		this.fireEvent(this, 'hide', [this]);
	},
	toggle: function(){
		if(this.el.css('display') !== 'none'){
			this.hide();
		}
		else{
			this.show();
		}
	},
	getEl: function(){
		return this.el;
	},
	getId: function(){
		return this.el.attr('id');
	},
	disabled: function(){
		this.el.addClass('ui-disabled');
		this.form.attr('disabled', true);
		this.fireEvent(this, 'disabled', [this]);
	},
	enabled: function(){
		this.el.removeClass('ui-disabled');
		this.form.attr('disabled', false);
		this.fireEvent(this, 'enabled', [this]);
	},
	destroy: function(){
		this.el.remove();
	}
});