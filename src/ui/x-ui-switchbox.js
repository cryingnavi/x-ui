X.ui.SwitchBox = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			checked: false,
			on: 'ON',
			off: 'OFF'
		};
		X.apply(this.config, config);
		X.ui.SwitchBox.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.SwitchBox.base.render.call(this);
		this.el.addClass('ui-switchbox').width(this.config.width);
		this.formCreate();

		this.handle = X.util.em.get().addClass('ui-switchbox-handle');
		this.text = X.util.em.get({tag: 'span'}).addClass('ui-switchbox-text');
		

		this.formcontin.append(this.text)
			.append(this.handle);
		
		this.formcontin.on('vclick', { me: this }, this._change);

		if(this.config.checked){
			this.el.addClass('on');
		}
		else{
			this.el.addClass('off');
		}

		this.setText();

		if(this.config.disabled){
			this.disabled();
		}
		
		this.fireEvent(this, 'afterrender', [this]);
	},
	formCreate: function(){
		this.form = X.util.em.get({
			tag: 'input',
			type: 'checkbox',
			checked: this.config.checked
		}).hide();
		this.formcontin.append(this.form);
	},
	_change: function(e){
		var me = e.data.me,
			el = me.el;

		if(me.el.hasClass('on')){
			me.unchecked();
		}
		else{
			me.checked();
		}
		
		return false;
	},
	setOn: function(on){
		this.config.on = on;

		this.setText();
	},
	setOff: function(off){
		this.config.off = off;

		this.setText();
	},
	setText: function(){
		var text;
		if(this.el.hasClass('on')){
			text = this.config.on;
		}
		else{
			text = this.config.off;
		}

		this.text.html(text);
	},
	toggleChecked: function(){
		if(this.el.hasClass('on')){
			this.unchecked();
		}
		else{
			this.checked();
		}
	},
	checked: function(){
		if(this.el.hasClass('ui-disabled')){
			return;
		}
		
		this.el.removeClass('off').addClass('on');
		
		this.setText();
		this.form.attr('checked', true);

		this.fireEvent(this, 'change', [this, true]);
	},
	unchecked: function(){
		if(this.el.hasClass('ui-disabled')){
			return;
		}
		
		this.el.removeClass('on').addClass('off');
		
		this.setText();
		this.form.attr('checked', false);
		this.fireEvent(this, 'change', [this, false]);
	},
	getValue: function(){
		return this.form.is(':checked');
	}
});

X.util.cm.addCString('switchbox', X.ui.SwitchBox);