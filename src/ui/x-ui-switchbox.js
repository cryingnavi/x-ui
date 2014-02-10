/**
 * @class 
 * @classdesc SwitchBox 를 생성한다.
 * @property {Boolean} checked 체크 상태를 지정한다. Default: false
 * @property {String} on on 상태의 텍스트를 지정한다. Default: 'ON'
 * @property {String} off off 상태의 텍스트를 지정한다. Default: 'OFF'
 * @example
 * var sb = new X.ui.SwitchBox({
 *      checked: false,
 *		on: 'ON',
 *		off: 'OFF'
 * });
 * sb.render();
 * 
 * &lt;div data-ui="switchbox"&gt;&lt;/div&gt;
 */
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
	/**
     * @method 
     * @desc SwitchBox 화면에 렌더한다.
     * @memberof X.ui.SwitchBox.prototype
     * @example
     * sb.render();
     */
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
	/**
     * @method 
     * @desc on 상태의 텍스트를 변경한다.
     * @memberof X.ui.SwitchBox.prototype
     * @param {String} on
     * @example
     * sb.setOn('A');
     */
	setOn: function(on){
		this.config.on = on;

		this.setText();
	},
	/**
     * @method 
     * @desc off 상태의 텍스트를 변경한다.
     * @memberof X.ui.SwitchBox.prototype
     * @param {String} off
     * @example
     * sb.setOff('B');
     */
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
	/**
     * @method 
     * @desc 체크 상태를 반전 시킨다.
     * @memberof X.ui.SwitchBox.prototype
     * @example
     * sb.toggleChecked();
     */
	toggleChecked: function(){
		if(this.el.hasClass('on')){
			this.unchecked();
		}
		else{
			this.checked();
		}
	},
	/**
     * @method 
     * @desc 체크 상태로 변경한다.
     * @memberof X.ui.SwitchBox.prototype
     * @example
     * sb.checked();
     */
	checked: function(){
		if(this.el.hasClass('ui-disabled')){
			return;
		}
		
		this.el.removeClass('off').addClass('on');
		
		this.setText();
		this.form.attr('checked', true);

		this.fireEvent(this, 'change', [this, true]);
	},
	/**
     * @method 
     * @desc 체크 상태를 해제한다.
     * @memberof X.ui.SwitchBox.prototype
     * @example
     * sb.unchecked();
     */
	unchecked: function(){
		if(this.el.hasClass('ui-disabled')){
			return;
		}
		
		this.el.removeClass('on').addClass('off');
		
		this.setText();
		this.form.attr('checked', false);
		this.fireEvent(this, 'change', [this, false]);
	},
	/**
     * @method 
     * @desc 체크 상태 유무를 반환한다. checked 일 경우 true, 아닐경우 false.
     * @memberof X.ui.SwitchBox.prototype
     * @example
     * sb.getValue();
     */
	getValue: function(){
		return this.form.is(':checked');
	}
});

X.util.cm.addCString('switchbox', X.ui.SwitchBox);