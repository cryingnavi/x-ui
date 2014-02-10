/**
 * @class 
 * @classdesc Tab 형태의 화면을 생성한다.
 * @property {String} position 'top' 나 'bottom'. 탭바의 위치를 지정한다. Default: 'top'
 * @property {Number} activeIndex on 기본으로 화면에 나타날 하위 view의 인덱스를 지정한다. Default: 0
 * @property {Array} titles 탭바의 각 탭 요소의 타이틀을 지정한다.
 * @property {String} transition 애니메이션 종류를 지정한다. viewcontroller의 애니메이션과 종류가 같다. Default: 'slide'
 * @property {Array} children 각 탭에 들어갈 view를 지정한다.
 * @example
 * var tabs = new X.ui.Tabs({
 *      position: 'top',
 *		activeIndex: 0,
 *		titles: ['Tabs 1', 'Tabs 2', 'Tabs 3'],
 *		transition: 'slide',
 *		children: [
 *          new X.View(), new X.View(), new X.View()
 *      ]
 * });
 * tabs.render();
 * 
 * &lt;div data-ui="tabs"&gt;
 *		&lt;div data-ui="view" data-title="Tabs 1" style="background:red;"&gt;Tabs 1&lt;/div&gt;
 *		&lt;div data-ui="view" data-title="Tabs 2" style="background:blue;"&gt;Tabs 2&lt;/div&gt;
 *		&lt;div data-ui="view" data-title="Tabs 3" style="background:yellow;"&gt;Tabs 3&lt;/div&gt;
 *	&lt;/div&gt;
 */
X.ui.Tabs = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			position: 'top',
			activeIndex: 0,
			titles: [],
			transition: 'slide',
			children: []
		};
		this.config.scroll = false;
		X.apply(this.config, config);
		X.ui.Tabs.base.initialize.call(this, this.config);
	},
	/**
     * @method 
     * @desc Tabs을 화면에 렌더한다.
     * @memberof X.ui.Tabs.prototype
     * @example
     * tabs.render();
     */
	render: function(){
		X.ui.Tabs.base.render.call(this);
		this.el.addClass('ui-tabs');

		this.createTabBar();
		
		var activeIndex = this.config.activeIndex;
		
		this.tabBar
			.children('.ui-tabs-bar-items')
			.eq(activeIndex)
			.addClass('ui-tabs-bar-items-active');
		
		this.activeView = this.config.children[activeIndex];
		for(var i=0,len=this.config.children.length; i<len; i++){
			if(i === activeIndex){
				continue;
			}

			this.config.children[i].hide();
		}
	},
	createTabBar: function(){
		this.tabBar = X.util.em.get()
			.addClass('ui-tabs-bar ui-tabs-bar-' + this.config.position);
		
		var children = this.config.children,
			len = children.length,
			o, html = '';

		for(var i=0; i<len; i++){
			html += '<div class="ui-tabs-bar-items"><span>' + children[i].config.title + '</span></div>'; 
		}
		this.tabBar.html(html);
		
		if(this.config.position === 'top'){
			this.el.prepend(this.tabBar);
		}
		else{
			this.el.append(this.tabBar);
		}
		
		this.tabBar.on('vclick', '.ui-tabs-bar-items', { me: this }, this._click);
	},
	_click: function(e){
		var me = e.data.me,
			bar = $(this), parent = bar.parent(),
			index = parent.find('.ui-tabs-bar-items').index(bar);
		
		parent.find('.ui-tabs-bar-items').removeClass('ui-tabs-bar-items-active');
		bar.addClass('ui-tabs-bar-items-active');
		
		me.change(index);
		return false;
	},
	/**
     * @method 
     * @desc 인자로 받은 인덱스에 해당하는 view를 활성화 시킨다.
     * @memberof X.ui.Tabs.prototype
     * @param {Number} index
     * @example
     * tabs.change(1);
     */
	change: function(index){
		var fromView = this.getActiveView(),
			toView = this.config.children[index];
			
		if(fromView === toView){
			return;
		}	
	
		if(fromView.el.nextAll('#' + toView.getId()).length > 0){
			this.right(fromView, toView);
		}
		else{
			this.left(fromView, toView);
		}
	},
	fromStart: function (fromView, transition, reverse, fn) {
		var fel = null;

		fel = fromView.getEl();
		fel.addClass(transition + ' out ' + reverse + ' ui-transitioning');

		if(transition !== 'none' && fn){
			fel.animationComplete(fn);
		}
		else if(fn){
			fn();
		}
	},
	toStart: function(toView, transition, reverse, fn){
		var tel = null;

		tel = toView.getEl();
		tel.addClass(transition + ' in ' + reverse + ' ui-transitioning ui-vc-active').removeClass('ui-view-hide');

		if(transition !== 'none' && fn){
			tel.animationComplete(fn);
		}
		else if(fn){	
			fn();
		}
	},
	done: function(fromView, toView, transition, reverse, deferred){
		var tel = null,
	        fel = null;
	        
		tel = toView.getEl();
		tel.removeClass(transition + ' in ' + reverse + ' ui-transitioning');

		fel = fromView.getEl();
		fel.removeClass(transition + ' out ' + reverse + ' ui-transitioning ui-vc-active');

		fromView.hide();
		deferred.resolve(this, [fromView, toView]);
	},
	transitionStart: function(fromView, toView, transition, reverse){
		var deferred = new $.Deferred(),
			transitionHandler = null;

		if(transition !== 'flow'){
			this.fromStart(fromView, transition, reverse);			
			this.toStart(toView, transition, reverse, $.proxy(function(){
				this.done(fromView, toView, transition, reverse, deferred);

				fromView = null, toView = null, transition = null, reverse = null, deferred = null;
			}, this));
		}
		else{
			this.fromStart(fromView, transition, reverse, $.proxy(function(){
				this.toStart(toView, transition, reverse, $.proxy(function(){
					this.done(fromView, toView, transition, reverse, deferred);

					fromView = null, toView = null, transition = null, reverse = null, deferred = null;
				}, this));
			}, this));
		}
		
		return deferred;
	},
	setActiveView: function(view){
		this.activeView = view;
	},
	/**
     * @method 
     * @desc 현재 활성화되어 있는 view 를 반환한다.
     * @memberof X.ui.Tabs.prototype
     * @return {X.View} view 
     * @example
     * tabs.getActiveView();
     */
	getActiveView: function(){
		return this.activeView;
	},
	/**
     * @method 
     * @desc view 현재 활성화되어 있는 view의 인덱스를 반환한다.
     * @memberof X.ui.Tabs.prototype
     * @return {Number} index
     * @example
     * tabs.getActiveViewIndex();
     */
	getActiveViewIndex: function(){
		var active = this.getActiveView();
		for(var i=0; i<this.config.children.length; i++){
			if(active === this.config.children[i]){
				return i;
			}
		}
	},
	/**
     * @method 
     * @desc 인자로 받은 인덱스에 해당하는 view를 반환한다.
     * @memberof X.ui.Tabs.prototype
     * @return {X.View} index
     * @example
     * tabs.getView();
     */
	getView: function(index){
		return this.config.children[index];
	},
	right: function(fromView, toView){
		this.fireEvent(this, 'beforechange', [this, this.getActiveView(), this.getActiveViewIndex(), toView]);

		var promise = this.transitionStart(fromView, toView, this.config.transition, ''), me = this;
		promise.done(function(){
			fromView.hide();
			me.setActiveView(toView);

			me.fireEvent(me, 'afterchange', [me.getActiveView(), me.getActiveViewIndex(), fromView]);
			me = null, fromView = null, toView = null;
		});
	},
	left: function(fromView, toView){
		this.fireEvent(this, 'beforechange', [this, this.getActiveView(), this.getActiveViewIndex(), toView]);

		var promise = this.transitionStart(fromView, toView, this.config.transition, 'reverse'), me = this;
		promise.done(function(){
			fromView.hide();
			me.setActiveView(toView);

			me.fireEvent(me, 'afterchange', [me.getActiveView(), me.getActiveViewIndex(), fromView]);
			me = null, fromView = null, toView = null;
		});
	},
	/**
     * @method 
     * @desc 마지막에 새로운 탭을 생성한다.
     * @memberof X.ui.Tabs.prototype
     * @param {View} view
     * @param {String} title
     * @return {Array} 새롭게 추가된 view와 title
     * @example
     * tabs.append(new X.View, 'New Tab');
     */
	append: function(comp, title){
		comp = X.util.cm.create(this.body, [comp]);
		this.config.children.push(comp[0]);
		comp[0].hide();

		var titleDiv = X.util.em.get()
			.addClass('ui-tabs-bar-items')
			.html('<span>' + title + '</span>');

		this.tabBar.append(titleDiv);
		return [comp[0], title];
	},
	/**
     * @method 
     * @desc 처음에 새로운 탭을 생성한다.
     * @memberof X.ui.Tabs.prototype
     * @param {View} view
     * @param {String} title
     * @return {Array} 새롭게 추가된 view와 title
     * @example
     * tabs.prepend(new X.View, 'New Tab');
     */
	prepend: function(comp, title){
		comp = X.util.cm.create(this.body, [comp]);
		this.config.children = comp.concat(this.config.children);
		comp[0].hide();
		this.body.prepend(comp[0].el);

		var titleDiv = X.util.em.get()
			.addClass('ui-tabs-bar-items')
			.html('<span>' + title + '</span>');

		this.tabBar.prepend(titleDiv);
		return [comp[0], title];
	},
	/**
     * @method 
     * @desc 인자로 넘긴 해당 index에 해당하는 탭을 제거한다.
     * @memberof X.ui.Tabs.prototype
     * @param {Number} index
     * @example
     * tabs.remove(1);
     */
	remove: function(index){
		this.config.children[index].destroy();
		this.config.children.remove(index);

		this.tabBar.children('.ui-tabs-bar-items').eq(index).remove();
	}
});
X.util.cm.addCString('tabs', X.ui.Tabs);