/**
 * @class 
 * @classdesc 리스트 형태의 UI를 생성한다.
 * @property {Boolean} activeRow Row 을 선택할 수 있도록 할 것인지를 지정한다.
 * @example
 * var html = "&lt;ul&gt;";
 * for (var i = 0; i<100; i++) {
 *      html = html + "&lt;li&gt;Acura&lt;/li&gt;"
 * };
 * html = html + "&lt;/ul&gt;"
 * var listview = new X.ui.ListView({
 * 		content: html
 * });
 * listview.render();
 * <pre><code>
 * &lt;div data-ui="listview"&gt;
 * 		&lt;ul&gt;
 * 			&lt;li&gt;Acura&lt;/li&gt;
 * 			&lt;li&gt;Audi&lt;/li&gt;
 * 			&lt;li&gt;BMW&lt;/li&gt;
 * 			&lt;li&gt;Cadillac&lt;/li&gt;
 * 			&lt;li&gt;Ferrari&lt;/li&gt;
 * 			&lt;li&gt;Acura&lt;/li&gt;
 * 			&lt;li&gt;Audi&lt;/li&gt;
 * 			&lt;li&gt;BMW&lt;/li&gt;
 * 			&lt;li&gt;Cadillac&lt;/li&gt;
 * 			&lt;li&gt;Ferrari&lt;/li&gt;
 * 			&lt;li&gt;Acura&lt;/li&gt;
 * 			&lt;li&gt;Audi&lt;/li&gt;
 * 			&lt;li&gt;BMW&lt;/li&gt;
 * 			&lt;li&gt;Cadillac&lt;/li&gt;
 * 			&lt;li&gt;Ferrari&lt;/li&gt;
 * 			&lt;li&gt;Acura&lt;/li&gt;
 * 			&lt;li&gt;Audi&lt;/li&gt;
 * 			&lt;li&gt;BMW&lt;/li&gt;
 * 			&lt;li&gt;Cadillac&lt;/li&gt;
 * 			&lt;li&gt;Ferrari&lt;/li&gt;
 * 		&lt;/ul&gt;
 * &lt;/div&lt;
 *  </code></pre>
 */
X.ui.ListView = X.extend(X.View, {
	initialize: function(config){
		this.config = {
		    activeRow: true,
			scrollConfig: {
				direction: 'y'
			}
		};
		X.apply(this.config, config);
		X.ui.ListView.base.initialize.call(this, this.config);
	},
	/**
     * @method 
     * @desc 리스트뷰를 화면에 render한다.
     * @memberof X.ui.ListView.prototype
     * @example
     * listview.render();
     */
	render: function(){
		X.ui.ListView.base.render.call(this);
		this.el.addClass('ui-listview');

		this.ul = this.body.children('.ui-scrollview-view').children('ul');
		this.ul.children('li').addClass('ui-listview-item');

		this.ul.on('vclick', 'li', {me: this}, this.rowClick);
		this.scrollEvent();
	},
	//구현되지 않음
	scrollEvent: function(){
		var me = this;
		this.scroll.options.onScrollStart = function(){
			
		};

		this.scroll.options.onScrollMove = function(){
			
		}

		this.scroll.options.onAnimationDoing = function(){
			
		};

		this.scroll.options.onScrollEnd = function(){
			
		};
	},
	rowClick: function(e){
		var me = e.data.me;
		if(me.config.activeRow){
		    me.ul.children('li').removeClass('active');
		    this.className = this.className + ' active';
		}
		
		me.fireEvent(me, 'rowclick', [me, this]);
	},
	/**
     * @method 
     * @desc 리스트뷰의 마지막에 새로운 Row을 추가한다.
     * @memberof X.ui.ListView.prototype
     * @param {String | jQuery} 추가할 row을 문자열 또는 jquery객체로 넘긴다.
     * @example
     * listview.append('<li>Acura1</li>');
     */
	append: function(rows){
		var type = X.type(rows);
		if(type === 'string'){
			rows = $(rows).addClass('ui-listview-item');
		}
		else if(type === 'jquery'){
			rows.addClass('ui-listview-item');
		}

		this.ul.append(rows);
		this.scrollRefresh();
	},
	/**
     * @method 
     * @desc 리스트뷰의 제일 윗쪽에 새로운 Row을 추가한다.
     * @memberof X.ui.ListView.prototype
     * @param {String | jQuery} 추가할 row을 문자열 또는 jquery객체로 넘긴다.
     * @example
     * listview.prepend('<li>Acura1</li>');
     */
	prepend: function(rows){
		var type = X.type(rows);
		if(type === 'string'){
			rows = $(rows).addClass('ui-listview-item');
		}
		else if(type === 'jquery'){
			rows.addClass('ui-listview-item');
		}

		this.ul.prepend(rows);
		this.scrollRefresh();
	},
	/**
     * @method 
     * @desc 리스트뷰의 특정 Row을 새로운 Row로 교체한다.
     * @memberof X.ui.ListView.prototype
     * @param {Number} index 교체 대상이 되는 Row 의 인덱스.
     * @param {String | jQuery} row을 문자열 또는 jquery객체로 넘긴다.
     * @example
     * listview.replaceWith('<li>Acura1</li>', 10);
     */
	replaceWith: function(index, row){
		var type = X.type(row);
		if(type === 'string'){
			row = $(row).addClass('ui-listview-item');
		}
		else if(type === 'jquery'){
			row.addClass('ui-listview-item');
		}
	
		this.ul.children('li:eq(' + index + ')').replaceWith(row);
	},
	/**
     * @method 
     * @desc 특정 Row을 삭제한다.
     * @memberof X.ui.ListView.prototype
     * @param {Number} index 삭제할 Row의 인덱스
     * @example
     * listview.remove(10);
     */
	remove: function(index){
		if(X.type(index) !== 'number'){
			throw new Error('arguments must be number ');
		}
		this.ul.children('li:eq(' + index + ')').remove();
		this.scrollRefresh();
	},
	/**
     * @method 
     * @desc 전체 Row을 삭제한다.
     * @memberof X.ui.ListView.prototype
     * @example
     * listview.removeAll();
     */
	removeAll: function(){
	    this.ul.children('li').remove();
	    this.scrollRefresh();
	}
});

X.util.cm.addCString('listview', X.ui.ListView);