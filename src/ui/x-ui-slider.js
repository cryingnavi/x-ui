X.ui.Slider = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			min: 0,
			max: 100,
			step: 1,
			defaultValue: 50,
			direction: 'x',
			style: { },
			subhandle: false
		};
		X.apply(this.config, config);
		X.ui.Slider.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.Slider.base.render.call(this);
		
		this.el.addClass('ui-slider ui-slider-' + this.config.direction);
		this.formCreate();
		this.handleCreate();
		this.subHandleCreate();

		if(this.config.disabled){
			this.disabled();
		}
		
		this.dragging = false;
		this.handle.bind( X.events.start, {me: this}, function(e){
			var me = e.data.me,
				el = me.el;
			
			if(el.hasClass('ui-disabled')){
				return false;
			}
			
			me.dragging = true;
			me.subdragging = false;
			

			X.getDoc().on(X.events.move, {me: me}, me.onMove);
			X.getDoc().on(X.events.end, {me: me}, me.onEnd);
			return false;
		});

		
		if(this.subhandle){
			this.subhandle.bind( X.events.start, {me: this}, function(e){
				var me = e.data.me,
					el = me.el;
				
				if(el.hasClass('ui-disabled')){
					return false;
				}

				me.dragging = true;
				me.subdragging = true;

				X.getDoc().on(X.events.move, {me: me}, me.onMove);
				X.getDoc().on(X.events.end, {me: me}, me.onEnd);
				return false;
			});
		}

		this.setValue(this.config.defaultValue);
		this.fireEvent(this, 'afterrender', [this]);
	},
	onMove: function(e){
		var me = e.data.me;
		if ( me.dragging ) {
			me.setValue( e );
			return false;
		}
	},
	onEnd: function(e){
		var me = e.data.me;
		if ( me.dragging ) {
			me.dragging = false;
			var val = me.getValue();
			me.fireEvent(me, 'change', [val]);
			return false;
		}

		X.getDoc().off(X.events.move, me.onMove);
		X.getDoc().off(X.events.end, me.onEnd);
	},
	formCreate: function(){
		this.form = X.util.em.get({
			tag: 'input',
			type: 'range',
			'class': 'ui-slider-input',
			required: this.config.required,
			placeholder: this.config.placeholder,
			min: this.config.min,
			max: this.config.max,
			step: this.config.step,
			value: this.config.defaultValue
		});
		this.formcontin.append(this.form);
	},
	subHandleCreate: function(){
		if(this.config.subhandle){
			this.subhandle = X.util.em.get().addClass('ui-slider-subhandle');
			this.formcontin.append(this.subhandle);
			
			if(X.type(this.config.range) === 'object'){
				
			}
			else{
				this.subhandle.addClass('ui-slider-subhandle');
			}
		}
	},
	handleCreate: function(val){
		this.handle = X.util.em.get(false, false, 'a').addClass('ui-slider-handle');
		this.formcontin.append(this.handle);

		if(X.type(this.config.range) === 'object'){
			this.subhandle = X.util.em.get(false, false, 'a').addClass('ui-slider-handle ui-slider-subhandle');
			this.formcontin.append(this.subhandle);
		}
	},
	setValue: function(val){
		var percent,
			min = this.getMin(),
			max = this.getMax();	
			
		if (X.type(val) === 'object') {
			var e = val,
				tol = 8;

			if(this.config.direction === 'x'){
				var w = this.formcontin.width(),
					l = this.formcontin.offset().left,
					x = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.originalEvent.pageX;
		
    			if ( !this.dragging || x < l - tol || x > l + w + tol ) {
					return;
				}

				percent = Math.round(((x - l) / w ) * 100 );
			}
			if(this.config.direction === 'y'){
				var h = this.formcontin.height(),
					t = this.formcontin.offset().top,
					y = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.originalEvent.pageY;
					
				if ( !this.dragging || y < t - tol || y > t + h + tol ) {
					return;
				}

				percent = Math.round(((y - t) / h ) * 100);
			}
		}

		if(X.type(val) === 'number'){
			percent = this.percentValue(val);
		}
		
		var newval = Math.round( (percent / 100) * (max - min) ) + min;
		newval = this.trimValue(newval);

		percent = this.percentValue(newval);

		if(this.subdragging){
			var data = this.handle.data('data');

			if(data){
				data = parseInt(data);
				if(newval < data){
					return;
				}
			}
		}

		if(!this.subdragging && this.subhandle){
			var data = this.subhandle.data('data');
			if(data){
				data = parseInt(data);
				if(newval > data)
					return;
			}
			else{
				var subPercent = (this.config.subhandle - min) / (max - min) * 100;
				var subNewVal = Math.round( (subPercent / 100) * (max - min) ) + min;
				

				if(this.config.direction === 'x'){
					this.subhandle.css("left", subPercent + "%").data('data', subNewVal);
				}
				else{
					this.subhandle.css("top", subPercent + "%").data('data', subNewVal);
				}
			}
		}
		
		if(this.config.direction === 'x'){
			if(this.subdragging){
				this.subhandle.css("left", percent + "%").data('data', newval);
			}
			else{
				this.handle.css("left", percent + "%").data('data', newval);
			}
		}

		if(this.config.direction === 'y'){
			if(this.subdragging){
				this.subhandle.css("top", (percent) + "%").data('data', newval);
			}
			else{
				this.handle.css("top", (percent) + "%").data('data', newval);
			}
		}

		this.fireEvent(this, 'change', [this, percent, newval]);
	},
	trimValue: function(val){
		var min = this.getMin(),
			max = this.getMax();

		if ( val <= min ) {
			return min;
		}
		if ( val >= max ) {
			return max;
		}
		var step = ( this.config.step > 0 ) ? this.config.step : 1,
			stepVal = (val - min) % step,
			alignValue = val - stepVal;

		if ( Math.abs(stepVal) * 2 >= step ) {
			alignValue += ( stepVal > 0 ) ? step : ( -step );
		}

		return parseFloat(alignValue.toFixed(5));
	},
	percentValue: function(val){
		var min = this.getMin(),
			max = this.getMax();

		percent = (parseFloat(val) - min) / (max - min) * 100;
		
		if(isNaN(percent)){
			return 0;
		}
		if (percent < 0) { 
			percent = 0; 
		}
		if (percent > 100) { 
			percent = 100; 
		}

		return percent;
	},
	//override
	getValue: function(){
		if(this.subhandle){
			return [this.handle.data('data'), this.subhandle.data('data')];
		}
		else{
			return this.handle.data('data');
		}
	},
	disabled: function(){
		this.el.addClass('ui-disabled');
		this.handle.addClass('ui-disabled');
		if(this.subhandle){
			this.subhandle.addClass('ui-disabled');
		}
		this.form.attr('disabled', true);
		this.fireEvent(this, 'disabled', [this]);
	},
	enabled: function(){
		this.el.removeClass('ui-disabled');
		this.handle.removeClass('ui-disabled');
		if(this.subhandle){
			this.subhandle.removeClass('ui-disabled');
		}
		this.form.attr('disabled', false);
		this.fireEvent(this, 'enabled', [this]);
	},
	setMin: function(min){
		this.config.min = min;
	},
	setMax: function(max){
		this.config.max = max;
	},
	getMin: function(){
		return this.config.min;
	},
	getMax: function(){
		return this.config.max;
	}
});

X.util.cm.addCString('slider', X.ui.Slider);