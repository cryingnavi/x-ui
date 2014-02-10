/**
 * @class 
 * @classdesc 프로그레스 바를 생성한다.
 * @property {Number} max 최고값을 지정한다.
 * @property {Number} defaultValue 기본값을 지정한다.
 * @example
 * var progress = new X.ui.Progressbar({
 *      max: 100,
 *		defaultValue: 0
 * });
 * progress.render();
 * 
 * <pre><code>
 *      &lt;div data-ui="progress" data-max="100" data-default-value="0"&gt;&lt;/div&gt;
 * </code></pre>
 */
X.ui.Progressbar = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
			max: 100,
			defaultValue: 0
		};
		X.apply(this.config, config);
		X.ui.Progressbar.base.initialize.call(this, this.config);
	},
	/**
     * @method 
     * @desc 프로그래스 바를 화면에 렌더한다.
     * @memberof X.ui.Progressbar.prototype
     * @example
     * progress.render();
     */
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
	/**
     * @method 
     * @desc 프로그래스 바의 value를 업데이트한다.
     * @memberof X.ui.Progressbar.prototype
     * @param {Number} val
     * @example
     * progress.setValue(50);
     */
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
	/**
     * @method 
     * @desc 프로그래스 바의 최고값을 변경한다.
     * @memberof X.ui.Progressbar.prototype
     * @param {Number} max
     * @example
     * progress.setMax(100);
     */
	setMax: function(max){
		this.config.max = max;
	},
	/**
     * @method 
     * @desc 프로그래스 바의 최고값을 반환한다.
     * @memberof X.ui.Progressbar.prototype
     * @return {Number} max
     * @example
     * progress.getMax();
     */
	getMax: function(max){
		return this.config.max;
	}
});

X.util.cm.addCString('progressbar', X.ui.Progressbar);