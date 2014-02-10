/**
 * @class 
 * @classdesc TextBox 를 생성한다.
 * @property {String} placeholder placeholder를 지정한다. Default: 'please..'
 * @property {String} type 텍스트박스의 type를 지정한다. Default: 'text'
 * @example
 * var textbox = new X.ui.TextBox({
 *      placeholder: 'please..',
 *		type: 'text'
 * });
 * textbox.render();
 * 
 * &lt;div data-ui="textbox"&gt;&lt;/div&gt;
 */
X.ui.TextBox = X.extend(X.ui.Form, {
	initialize: function(config){
		this.config = {
		    placeholder: 'please..',
			type: 'text'
		};
		X.apply(this.config, config);
		X.ui.TextBox.base.initialize.call(this, this.config);
	},
	/**
     * @method 
     * @desc TextBox를 화면에 렌더한다.
     * @memberof X.ui.TextBox.prototype
     * @example
     * textbox.render();
     */
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
	/**
     * @method 
     * @desc TextBox의 type 를 변경한다.
     * @memberof X.ui.TextBox.prototype
     * @param {String} type
     * @example
     * textbox.setType('password');
     */
	setType: function(type){
		this.form.prop('type', type);
	},
	/**
     * @method 
     * @desc TextBox의 placeholder 를 변경한다.
     * @memberof X.ui.TextBox.prototype
     * @param {String} placeholder
     * @example
     * textbox.setType('please your id..');
     */
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