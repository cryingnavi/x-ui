/**
 * @class 
 * @classdesc Toolbar 를 생성한다.
 * @property {String | jQuery | HtmlElement} el toolbar를 생성할 엘리먼트를 지정한다.
 * @property {String} position 'top' 나 'bottom'. 툴바의 위치를 지정한다. Default: 'top'
 * @property {String} title 텍스트박스의 타이틀을 지정한다.
 * @example
 * var toolbar = new X.ui.Toolbar({
 *      position: 'top',
 *		title: 'Header'
 * });
 * toolbar.render();
 * 
 * &lt;div data-ui="toolbar"&gt;
 *      Title
 * &lt;/div&gt;
 */
X.ui.Toolbar = X.extend(X.util.Observer, {
	initialize: function(config){
		this.config = {
		    el: null,
			position: 'top',
			title: null
		};
		X.apply(this.config, config);
		
		var listener = { };
		if(this.config.listener){
			listener = this.config.listener;
		}
		X.ui.Toolbar.base.initialize.call(this, listener);
		
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
	/**
     * @method 
     * @desc Toolbar 화면에 렌더한다.
     * @memberof X.ui.Toolbar.prototype
     * @example
     * toolbar.render();
     */
	render: function(){
		this.fireEvent(this, 'beforerender', [this]);
		
		this.el.addClass('ui-toolbar ' + this.config.position);

		this.inner = X.util.em.get()
			.addClass('ui-toolbar-inner');

		this.el.append(this.inner);

		this.setTitle(this.config.title);
		
		var parent = this.el.parent();
		if(this.config.position === 'bottom'){
			parent.append(this.el);
		}
		else{
			parent.prepend(this.el);
		}
		
		this.fireEvent(this, 'afterrender', [this]);
	},
	/**
     * @method 
     * @desc Toolbar 에 새로운 타이틀을 지정한다.
     * @memberof X.ui.Toolbar.prototype
     * @param {String} title
     * @example
     * toolbar.setTitle('New Title');
     */
	setTitle: function(title){
		if(!this.title){
			this.title = X.util.em.get().
				addClass('ui-toolbar-title');

			this.inner.append(this.title);
			this.title.html(title);
			return;
		}
		this.title.html(title);
		this.fireEvent(this, 'changetitle', [this, title]);
	},
	/**
     * @method 
     * @desc Toolbar 의 타이틀을 반환한다.
     * @memberof X.ui.Toolbar.prototype
     * @return {String} title
     * @example
     * toolbar.getTitle();
     */
	getTitle: function(){
		if(this.title){
			return this.title.text();
		}
	},
	/**
     * @method 
     * @desc Toolbar 을 파괴한다.
     * @memberof X.ui.Toolbar.prototype
     * @example
     * toolbar.destroy();
     */
	destroy: function(){
		this.el.remove();
	}
});

X.util.cm.addCString('toolbar', X.ui.Toolbar);