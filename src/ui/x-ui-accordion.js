/**
 * @class 
 * @classdesc X.ui.Accordion 클래스는 Accordion ui 를 생성한다.
 * @property {Array} config.titles 각 탭의 title 을 설정한다.
 * @property {Array} config.items 각 탭의 view를 설정한다.
 * @property {Number} config.activeIndex 초기 open될 탭을 설정한다. Default : 0
 * @example
 * var acc = new X.ui.Accordion({
 *      titles: ["Tab 1", "Tab 2", "Tab 3"],
 *      activeIndex: 0,
 *      items: [new X.View(), new X.View(), new X.View()]
 * });
 * <pre><code>
 * &#60div data-role="accordion" data-active-index="0"&#62
 *      &#60div data-role="view" data-title="Tabs 1"&#62
 *          &#60!-- Someting Html --&#62
 *      &#60/div>
 *      &#60div data-role="view" data-title="Tabs 2"&#62
 *          &#60!-- Someting Html --&#62
 *      &#60/div>
 *      &#60div data-role="view" data-title="Tabs 3"&#62
 *          &#60!-- Someting Html --&#62
 *      &#60/div&#62
 * &#60/div&#62
 * &#60/code></pre>
 */
X.ui.Accordion = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			titles: [],
			items: [],
			activeIndex: 0
		};
		this.config.scroll = false;
		X.apply(this.config, config);
		X.ui.Accordion.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.Accordion.base.render.call(this);
		this.el.addClass('ui-accordion');
		
		this.createItems();
		this.createTitle();

		views = this.body.on('vclick', '.ui-accordion-views > .ui-accordion-title', { me: this }, function(e){
			var me = e.data.me;
			
			var index = me.body.children('.ui-accordion-views').index($(this).parent());
			me.change(index);
			return false;
		});
	},
	createItems: function(){
		this.body.children('.ui-view').each(function(){
			var div = X.util.em.get()
				.addClass('ui-accordion-views ui-accordion-close');
			
			$(this).wrap(div);
		});

		var items = this.body.children('.ui-accordion-views');
		items.eq(this.config.activeIndex)
			.removeClass('ui-accordion-close')
			.addClass('ui-accordion-open');

		var me = this;
		this.config.items.forEach(function(view, i){
			if(me.config.activeIndex !== i){
				view.hide();
			}
		});
	},
	createTitle: function(){
		var views = this.body.children('.ui-accordion-views'),
			titles = this.config.titles;
		views.each(function(i){
			if(titles[i]){
				div = X.util.em.get()
					.addClass('ui-accordion-title')
					.html(titles[i]);
				
				$(this).prepend(div);
			}
		});

		titles = null;		
	},
	/**
	 * @method
     * @desc 주어진 인덱스에 해당하는 탭으로 전환한다.
     * @memberof X.ui.Accordion.prototype
     * @param {Number} index - 이동할 인덱스에 해당하는 탭
     * @example
     * var acc = new X.ui.Accordion({
     *      titles: ["Tab 1", "Tab 2", "Tab 3"],
     *      activeIndex: 0,
     *      items: [new X.View(), new X.View(), new X.View()]
     * });
     * 
     * acc.change(1);
     */
	change: function(index){
		if(this.config.activeIndex === index){
			return;
		}
		
		this.body.children('.ui-accordion-views')
			.removeClass('ui-accordion-open')
			.addClass('ui-accordion-close')
			.eq(index).addClass('ui-accordion-open')
			.removeClass('ui-accordion-close');


		this.config.items.forEach(function(view, i){
			if(index !== i){
				view.hide();
			}
			else{
				view.show();
			}
		});
		
		this.config.activeIndex = index;

		this.fireEvent(this, 'change', [this]);
	},
	/**
     * @method 
     * @desc 마지막에 탭 하나를 추가한다.
     * @memberof X.ui.Accordion.prototype
     * @param {Component} comp X.View 등의 component를 지정한다.
     * @param {String} title 새로 생성될 탭의 title 을 지정한다.
     * @return {Array} array 추가된 타이틀과 component를 배열로 반환한다.
     * @example
     * var acc = new X.ui.Accordion({
     *      titles: ["Tab 1", "Tab 2", "Tab 3"],
     *      activeIndex: 0,
     *      items: [new X.View(), new X.View(), new X.View()]
     * });
     * 
     * acc.append(new X.View(), "New Tab");
     */
	append: function(comp, title){
		var div = X.util.em.get()
				.addClass('ui-accordion-views ui-accordion-close');

		var titleDiv = X.util.em.get()
					.addClass('ui-accordion-title')
					.html(title);

		this.body.append(div);
		comp = X.util.cm.create(div, [comp]);
		div.prepend(titleDiv);

		this.config.activeIndex = null;

		return [comp[0], title];
	},
	/**
	 * @method
     * @desc 차음에 탭 하나를 추가한다.
     * @memberof X.ui.Accordion.prototype
     * @param {Component} comp - X.View 등의 component를 지정한다.
     * @param {String} title - 새로 생성될 탭의 title 을 지정한다.
     * @return {Array} array 추가된 타이틀과 component를 배열로 반환한다.
     * @example
     * var acc = new X.ui.Accordion({
     *      titles: ["Tab 1", "Tab 2", "Tab 3"],
     *      activeIndex: 0,
     *      items: [new X.View(), new X.View(), new X.View()]
     * });
     * 
     * acc.prepend(new X.View(), "New Tab");
     */
	prepend: function(comp, title){
		var div = X.util.em.get()
				.addClass('ui-accordion-views ui-accordion-close');

		var titleDiv = X.util.em.get()
					.addClass('ui-accordion-title')
					.html(title);

		this.body.prepend(div);
		comp = X.util.cm.create(div, [comp]);
		div.prepend(titleDiv);

		this.config.activeIndex = null;

		return [comp[0], title];
	},
	/**
	 * @method
     * @desc 인자로 받은 인덱스에 해당하는 탭을 삭제한다.
     * @memberof X.ui.Accordion.prototype
     * @param {Number} index - 삭제할 인덱스를 넘긴다.
     * @example
     * var acc = new X.ui.Accordion({
     *      titles: ["Tab 1", "Tab 2", "Tab 3"],
     *      activeIndex: 0,
     *      items: [new X.View(), new X.View(), new X.View()]
     * });
     * 
     * acc.remove(1);
     */
	remove: function(index){
		this.body.children('.ui-accordion-views').eq(index).remove();
		this.config.items = this.config.items.filter(function(el, i){
			return (index !== i);
		});

		this.config.titles = this.config.titles.filter(function(el, i){
			return (index !== i);
		});
		this.config.activeIndex = null;
	},
	/**
	 * @method
     * @desc 탭을 모두 삭제 한다.
     * @memberof X.ui.Accordion.prototype
     * @example
     * var acc = new X.ui.Accordion({
     *      titles: ["Tab 1", "Tab 2", "Tab 3"],
     *      activeIndex: 0,
     *      items: [new X.View(), new X.View(), new X.View()]
     * });
     * 
     * acc.removeAll();
     */
	removeAll: function(){
		this.body.empty();
		this.config.activeIndex = null;
	},
	/**
	 * @method
     * @desc 인자로 받은 해당 탭에 새로운 타이틀을 설정한다.
     * @memberof X.ui.Accordion.prototype
     * @param {String} title - 새로 변경할 타이틀.
     * @param {Number} index - 변경할 탭.
     * @example
     * var acc = new X.ui.Accordion({
     *      titles: ["Tab 1", "Tab 2", "Tab 3"],
     *      activeIndex: 0,
     *      items: [new X.View(), new X.View(), new X.View()]
     * });
     * 
     * acc.changeTitle(0, "New Title");
     */
	changeTitle: function(title, index){
		index = index || 0;
		var view = this.body.children('.ui-accordion-views')
			.eq(index);
		
		view
			.children('.ui-accordion-title')
			.html(title);
		
		this.config.titles[index] = title;
	},
	/**
	 * @method
     * @desc 인자로 받은 해당 탭을 반환한다.
     * @function getItem
     * @memberof X.ui.Accordion.prototype
     * @param {Number} index - 반환할 탭 인덱스.
     * @return {Component} 
     * @example
     * var acc = new X.ui.Accordion({
     *      titles: ["Tab 1", "Tab 2", "Tab 3"],
     *      activeIndex: 0,
     *      items: [new X.View(), new X.View(), new X.View()]
     * });
     * 
     * acc.getItem(0);
     */
	getItem: function(index){
		return this.config.items[index];
	}
});

X.util.cm.addCString('accordion', X.ui.Accordion);