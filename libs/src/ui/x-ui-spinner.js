X.ui.Spinner = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			min: 0,
			max: 100,
			step: 1,
			defaultValue: 0
		};
		X.apply(this.config, config);
		X.ui.Spinner.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.Spinner.base.render.call(this);
		this.el.addClass('ui-spinner').width(this.config.width);
		
		this.formCreate();
		this.handleCreate();
		
		this.fireEvent(this, 'afterrender', []);
	},
	formCreate: function(){
		this.form = X.util.em.get({
			tag: 'input',
			type: 'number',
			min: this.config.min,
			max: this.config.max,
			value: this.config.defaultValue,
			step: this.config.step
		});
		this.formcontin.append(this.form);
		
		this.form.bind('change', { me: this }, this._change);
	},
	_change: function(e){
		var me = e.data.me,
			val = parseFloat(me.form.val(), 10) || 0;
		
		if(val < me.config.min){
			val = me.config.min
			me.form.val(val);
		}
		else if(val > me.config.max){
			val = me.config.max;
			me.form.val(val);
		}
		
		me.fireEvent(me, 'change', [me,  val]);
	},
	handleCreate: function(){
		var plus = X.util.em.get()
			.html('+').addClass('ui-spinner-btn ui-spinner-plus');

		this.formcontin.append(plus);
		
		
		var minus = X.util.em.get()
			.html('-').addClass('ui-spinner-btn ui-spinner-minus');

		this.formcontin.append(minus);
		
		plus.on(X.events.start, { me: this }, this.plus);
		minus.on(X.events.start, { me: this }, this.minus);
	},
	end: function(e){
		var me = e.data.me;
		me.clearTimer();
		
		return false;
	},
	clearTimer: function(){
		if(this.interval){
			window.clearInterval(this.interval);
			this.interval = null;
			
			X.getDoc().off(X.events.end, this.end);
		}
	},
	timer: function(e, flag){
		if(!this.interval){
			var me = this;
			this.interval = window.setInterval(function(){
				me[flag](e);
			}, 100);
			
			X.getDoc().on(X.events.end, {me: this}, this.end);
		}
	},
	plus: function(e){
		var me = e.data.me,
			val = parseFloat(me.form.val(), 10) || 0;
		
		var result = val + me.config.step;
		
		if(result > me.config.max){
			result = me.config.max;
		}
		
		result = parseFloat(result.toFixed(1), 10);
		me.form.val(result);

		me.timer(e, 'plus');
		return false;
	},
	minus: function(e){
		var me = e.data.me,
			val = parseFloat(me.form.val(), 10) || 0;
		
		var result = val - me.config.step;
		
		if(result < me.config.min){
			result = me.config.min;
		}
		
		result = parseFloat(result.toFixed(1), 10);
		me.form.val(result);
		
		me.timer(e, 'minus');
		return false;
	},
	setValue: function(val){
		if (this.el.hasClass('ui-disabled')) {
			return;
		}
		if(!val){
			val = 0;
		}

		if(val < this.config.min){
			val = this.config.min;
		}
		if(val > this.config.max){
			val = this.config.max;
		}
		
		this.form.val(val);
		
		this.fireEvent(this, 'change', [this,  val]);
	},
	setMax: function(max){
		if(X.type(max) !== 'number'){
			return;
		}
		
		this.config.max = max;
		this.form.attr('max', max);
	},
	setMin: function(min){
		if(X.type(min) !== 'number'){
			return;
		}
		
		this.config.min = min;
		this.form.attr('min', min);
	},
	getMax: function(){
		return this.config.max;
	},
	getMin: function(){
		return this.config.min;
	},
	setStep: function(step){
		if(X.type(step) !== 'number'){
			return;
		}
		
		this.config.step = step;
		this.form.attr('step', step);
	}
});

X.util.cm.addCString('spinner', X.ui.Spinner);