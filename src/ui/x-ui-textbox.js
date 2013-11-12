X.ui.TextBox = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			type: 'text'
		};
		X.apply(this.config, config);
		X.ui.TextBox.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.TextBox.base.render.call(this);

		this.el.addClass('ui-textbox');
		this.formCreate();
		
		this.form.bind('focus keypress blur keydown keyup', {me: this}, this.elementEvent);
		
		this.fireEvent(this, 'afterrender', [this]);
	},
	formCreate: function(){
		this.form = X.util.em.get({
			tag: 'input',
			type: this.config.type,
			'class': 'ui-text-input',
			placeholder: this.config.placeholder,
			disabled: this.config.disabled,
			value: this.config.defaultValue
		});
		this.formcontin.append(this.form);
	},
	setType: function(type){
		this.form.prop('type', type);
	},
	setPlaceholder: function(placeholder){
		this.config.placeholder = placeholder;
		this.form.attr('placeholder', placeholder);
	},
	elementEvent: function(e){
		var me = e.data.me,
			val = me.getValue(),
			type =  e.type;

		me.fireEvent(me, type, [me, val, e]);
	}
});

X.util.cm.addCString('textbox', X.ui.TextBox);