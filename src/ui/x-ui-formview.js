/**
 * @class 
 * @classdesc Form 컴포넌트를 묶어 하나의 View를 생성한다.
 * @example
 * var formView = new X.ui.Form({
 *      items: [
 *          new X.ui.TextBox(),
 *          new X.ui.ProgressBar(),
 *          new X.ui.Slider(),
 *          new X.ui.Switchbox(),
 *          new X.ui.Spinner()
 *      ]
 * });
 * <pre><code>
 * 	&lt;div data-role="formview"&gt;
 * 		&lt;div data-role="textbox" data-label="text" data-name="text"&gt;&lt;/div&gt;
 * 		&lt;div data-role="progress" data-label="progress"&gt;&lt;/div&gt;
 * 		&lt;div data-role="slider" data-label="slider"&gt;&lt;/div&gt;
 * 		&lt;div data-role="textbox" data-label="password" data-type="password"&gt;&lt;/div&gt;
 * 		&lt;div data-role="switchbox" data-label="switchbox" data-checked="true"&gt;&lt;/div&gt;
 * 	&lt;/div&gt;
 * </code></pre>
 */
X.ui.FormView = X.extend(X.View, {
	initialize: function(config){
		this.config = {	};
		X.apply(this.config, config);
		X.ui.FormView.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.FormView.base.render.call(this);
	},
	/**
	 * @method
     * @desc 내부에 가지고 있는 폼 컨트롤들을 문자열 형태로 직렬화한다.
     * @memberof X.ui.Form.prototype
     * @return {String} 직렬화된 문자열
     * @example
     * var formView = new X.ui.Form({
     *      items: [
     *          new X.ui.TextBox(),
     *          new X.ui.ProgressBar(),
     *          new X.ui.Slider(),
     *          new X.ui.Switchbox(),
     *          new X.ui.Spinner()
     *      ]
     * });
     * 
     * formView.serialize();
     */
	serialize: function(){
		return $.param(this.getJSON());
	},
	/**
	 * @method
     * @desc 내부에 가지고 있는 폼 컨트롤들을 문자열 형태로 직렬화한다.
     * @memberof X.ui.Form.prototype
     * @return {Object} 직렬화된 json 객체
     * @example
     * var formView = new X.ui.Form({
     *      items: [
     *           new X.ui.TextBox(),
     *          new X.ui.ProgressBar(),
     *          new X.ui.Slider(),
     *          new X.ui.Switchbox(),
     *          new X.ui.Spinner()
     *      ]
     * });
     * 
     * formView.getJSON();
     */
	getJSON: function(){
		var params = { },
			items = this.config.items,
			len = items.length;
		
		for(var i=0; i<len; i++){
			params[items[i].getName() || items[i].getId()] = items[i].getValue();
		}

		return params;
	}
});