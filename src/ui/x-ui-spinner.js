/**
 * @class 
 * @classdesc spinner 를 생성한다.
 * @property {Number} min 최소값을 지정한다. Default: 0
 * @property {Number} max 최고값을 지정한다. Default: 100
 * @property {Number} step step을 지정한다. Default: 1
 * @property {Number} defaultValue 기본값을 지정한다. Default: 0
 * @example
 * var spinner = new X.ui.Spinner({
 *      min: 0,
 *		max: 100,
 *		step: 1,
 *		defaultValue: 0
 * });
 * spinner.render();
 * 
 * &lt;div data-ui="spinner"&gt;&lt;/div&gt;
 */
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
	/**
     * @method 
     * @desc spinner를 화면에 렌더한다.
     * @memberof X.ui.Spinner.prototype
     * @example
     * spinner.render();
     */
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
	/**
     * @method 
     * @desc 슬라이더의 value를 업데이트한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.setValue(50);
     */
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
	/**
     * @method 
     * @desc 슬라이더의 최고값을 변경한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.setMax(100);
     */
	setMax: function(max){
		this.config.max = max;
		this.form.attr('max', max);
	},
	/**
     * @method 
     * @desc 슬라이더의 최소값을 변경한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.setMin(0);
     */
	setMin: function(min){
		this.config.min = min;
		this.form.attr('min', min);
	},
	/**
     * @method 
     * @desc 슬라이더의 최고값을 반환한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.getMax();
     */
	getMax: function(){
		return this.config.max;
	},
	/**
     * @method 
     * @desc 슬라이더의 최소값을 반환한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.getMin();
     */
	getMin: function(){
		return this.config.min;
	},
	/**
     * @method 
     * @desc 슬라이더의 step 값을 변경한다.
     * @memberof X.ui.Slider.prototype
     * @param {Number} val
     * @example
     * slider.setStep(5);
     */
	setStep: function(step){
		this.config.step = step;
		this.form.attr('step', step);
	}
});

X.util.cm.addCString('spinner', X.ui.Spinner);