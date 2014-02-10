/**
 * @class 
 * @classdesc form 요소들의 Base 클래스 이다.
 * @property {String} config.name 넘어온 문자열을 키로 삼아 FormView에서 serialize 하게 된다. name을 넘기지 않을 경우 id 를 사용한다.
 * @property {Boolean} config.disabled 폼요소의 비활성화 상태를 나타낸다.
 * @property {String | Number} config.defaultValue 폼요소의 초기값을 설정한다.
 * @property {String} config.label 폼 요소의 label을 설정한다.
 * @property {Object | String} style 엘리먼트에 적용할 인라인 스타일을 지정한다.
 */
X.ui.Form = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
		    name: null,
			required: false,    //구현안됨
			disabled: false,
			defaultValue: null,
			label: null,
			style: { }
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
	/**
	 * @method
     * @desc 폼 요소의 name 값을 반환한다. 설정하지 않았을 경우 null 을 반환한다.
     * @memberof X.ui.Form.prototype
     * @return name 폼요소의 name 값 또는 null
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test'
     * });
     * 
     * txt.getName();
     */
	getName: function(){
		return this.config.name;
	},
	/**
	 * @method
     * @desc 폼 요소의 value 값을 지정한다. 해당 method 는 하위 클래스의 종류에 따라 오버라이드 된다.
     * @memberof X.ui.Form.prototype
     * @param val 
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test',
     *      defaultValue: 'first'
     * });
     * 
     * txt.setValue('second');
     */
	setValue: function(val){
		if (this.form.attr('disabled')) {
			return;
		}
		this.form.val(val);
		this.fireEvent(this, 'setvalue', [this, val]);
	},
	/**
	 * @method
     * @desc 폼 요소의 value 값을 반환한다. 해당 method 는 하위 클래스의 종류에 따라 오버라이드 된다.
     * @memberof X.ui.Form.prototype
     * @param val 
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test',
     *      defaultValue: 'first'
     * });
     * 
     * txt.getValue();
     */
	getValue: function(){
		return this.form.val();
	},
	labelCreate: function(){
		this.formlabel = X.util.em.get()
			.addClass('ui-form-label').html(this.config.label);
		
		this.el.append(this.formlabel);
	},
	/**
	 * @method
     * @desc 폼 요소의 화면에 show 시킨다.
     * @memberof X.ui.Form.prototype
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test',
     * });
     * 
     * txt.show();
     */
	show: function(){
		this.el.show();
		this.fireEvent(this, 'show', [this]);
	},
	/**
	 * @method
     * @desc 폼 요소의 화면에 hide 시킨다.
     * @memberof X.ui.Form.prototype
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test',
     * });
     * 
     * txt.hide();
     */
	hide: function(){
		this.el.hide();
		this.fireEvent(this, 'hide', [this]);
	},
	/**
	 * @method
     * @desc 폼 요소의 화면에 hide 시킨다.
     * @memberof X.ui.Form.prototype
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test',
     * });
     * 
     * txt.toggle();
     */
	toggle: function(){
		if(this.el.css('display') !== 'none'){
			this.hide();
		}
		else{
			this.show();
		}
	},
	/**
	 * @method
     * @desc 폼 컴포넌트의 루트 엘리먼트(jquery)를 반환한다.
     * @memberof X.ui.Form.prototype
     * @return {Object} el jquery 엘리먼트 반환
     * @example
     * var txt = new X.ui.TextBox({
     *      name: 'test',
     * });
     * 
     * txt.getEl();
     */
	getEl: function(){
		return this.el;
	},
	/**
	 * @method
     * @desc 폼 컴포넌트의 아이디를 반환한다.
     * @memberof X.ui.Form.prototype
     * @return {String} id
     * @example
     * var txt = new X.ui.TextBox({
     * });
     * 
     * txt.getId();
     */
	getId: function(){
		return this.el.attr('id');
	},
	/**
	 * @method
     * @desc 폼 요소를 비활성화 상태로 변경한다.
     * @memberof X.ui.Form.prototype
     * @example
     * var txt = new X.ui.TextBox({
     *      
     * });
     * 
     * txt.disabled();
     */
	disabled: function(){
		this.el.addClass('ui-disabled');
		this.form.attr('disabled', true);
		this.fireEvent(this, 'disabled', [this]);
	},
	/**
	 * @method
     * @desc 폼 요소를 활성화 상태로 변경한다.
     * @memberof X.ui.Form.prototype
     * @example
     * var txt = new X.ui.TextBox({
     *      
     * });
     * 
     * txt.enabled();
     */
	enabled: function(){
		this.el.removeClass('ui-disabled');
		this.form.attr('disabled', false);
		this.fireEvent(this, 'enabled', [this]);
	},
	/**
	 * @method
     * @desc 폼 요소를 제거한다.
     * @memberof X.ui.Form.prototype
     * @example
     * var txt = new X.ui.TextBox({
     *      
     * });
     * 
     * txt.destroy();
     */
	destroy: function(){
		this.el.remove();
	}
});