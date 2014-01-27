/**
 * @class 
 * @classdesc X.ui.Carousel 클래스는 Carousel ui 를 생성한다.
 * @property {String} config.direction carousel 의 이동방향을 지정한다. x 또는 y 로 가로 세로 방향을 지정한다. Default: 'x'
 * @property {Number} config.activeIndex 초기 활성화될 아이템을 지정한다. Defautl: 0.
 * @property {Number} config.duration 애니메이션 이동 속도를 지정한다. Defautl: 200.
 * @property {Array} config.children 각 탭의 view를 설정한다.
 * @example
 * var carousel = new X.ui.Carousel({
 *      direction: "x",
 *      activeIndex: 0,
 *      duration: 200,
 *      children: [new X.View(), new X.View(), new X.View()]
 * });
 * carousel.render();
 * 
 * <pre><code>
 * &lt;div data-ui="carousel"&gt;
 *		&lt;div data-ui="view" style="background-color: #8E8E93;" data-scroll="false"&gt;
 *			&lt;!-- Someting Html --&gt;
 *		&lt;/div&gt;
 *		&lt;div data-ui="view" style="background-color: #34AADC;" data-scroll="false"&gt;
 *			&lt;!-- Someting Html --&gt;
 *		&lt;/div&gt;
 *		&lt;div data-ui="view" style="background-color: #007AFF;" data-scroll="false"&gt;
 *			&lt;!-- Someting Html --&gt;
 *		&lt;/div&gt;
 * &lt;/div&gt;
 * </code></pre>
 */
X.ui.Carousel = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			direction: 'x',
			activeIndex: 0,
			duration: 200,
			children: []
		};
		this.config.scroll = false;
		X.apply(this.config, config);
		X.ui.Carousel.base.initialize.call(this, this.config);

		this.endPos = 0;
		this.dragging = false;
		this.activeIndex = this.config.activeIndex;
	},
	/**
     * @method 
     * @desc Carousel 을 화면에 렌더한다.
     * @memberof X.ui.Carousel.prototype
     * @example
     * carousel.render();
     */
	render: function(){
		X.ui.Carousel.base.render.call(this);
		this.el.addClass('ui-carousel');
		this.carouselBody = X.util.em.get().addClass('ui-carousel-body');

		var views = this.body.children('.ui-view').addClass('ui-carousel-views'),
			activeIndex = this.activeIndex,
			style = this.carouselBody.get(0).style,
			pos = 0, 
			viewSize = 0;
		
		if(views.length > 0){
			views.wrapAll(this.carouselBody);
		}
		else{
			this.el.append(this.carouselBody);
		}

		this.carouselBody = this.body.children('.ui-carousel-body');

		if(this.config.direction === 'x'){
		    viewSize = this.getWidth();
		    pos = (-1 * activeIndex) * viewSize;
		    
			style.webkitTransform = 'translateX(' + (pos) + 'px)';
			style.msTransform = 'translateX(' + (pos) + 'px)';
			style.transform = 'translateX(' + (pos) + 'px)';
			
			views.each(function(i){
			    this.style.left = (i * 100) + '%';
			});
		}
		else{
		    viewSize = this.getHeight();
		    pos = (-1 * activeIndex) * viewSize;
		    
			style.webkitTransform = 'translateY(' + (pos) + 'px)';
			style.msTransform = 'translateY(' + (pos) + 'px)';
			style.transform = 'translateY(' + (pos) + 'px)';
			
			views.each(function(i){
			    this.style.top = (i * 100) + '%';
			});
		}

		this.carouselBody.bind(X.events.start, {me: this}, this.onStart);
		
		X.getWindow().on(X.events.orientationchange, { me: this }, this.orientationChange);
	},
	orientationChange: function(e){
		var me = e.data.me,
		    endPos = me.endPos,
		    style;
		    
		if(endPos === 0){
		    return false;
		}
		
        style = me.carouselBody.get(0).style;

        style.webkitTransitionDuration = "0";
		if(me.config.direction === 'x'){
            endPos = (me.getWidth() * me.activeIndex) * -1;

            style.webkitTransform = 'translateX(' + endPos + 'px)';
		    style.msTransform = 'translateX(' + endPos + 'px)';
			style.transform = 'translateX(' + endPos + 'px)';
		}
		else{
		    endPos = (me.getHeight() * me.activeIndex) * -1;

            style.webkitTransform = 'translateY(' + endPos + 'px)';
		    style.msTransform = 'translateY(' + endPos + 'px)';
			style.transform = 'translateY(' + endPos + 'px)';
		}
		
		me.endPos = endPos;
		return false;
	},
	onStart: function(e){
		var me = e.data.me;

		var pageX = e.originalEvent.touches ? 
				e.originalEvent.touches[0].pageX : e.originalEvent.pageX,
			pageY = e.originalEvent.touches ? 
				e.originalEvent.touches[0].pageY : e.originalEvent.pageY;

		me.startPageX = pageX;
		me.startPageY = pageY;
		me.dragging = true;
		me.moveLimit = 0;

		me.carouselBody.on(X.events.move, { me: me }, me.onMove);
		me.carouselBody.on(X.events.end, { me: me }, me.onEnd);
	},
	onMove: function(e){
		var me = e.data.me;
		
		if(me.dragging){
			var pageX = e.originalEvent.touches ? 
					e.originalEvent.touches[0].pageX : e.originalEvent.pageX;

			var	pageY = e.originalEvent.touches ? 
					e.originalEvent.touches[0].pageY : e.originalEvent.pageY;

			var style = me.carouselBody.get(0).style;

			style.webkitTransitionDuration = "0";
			if(me.config.direction === 'x'){
				me.movePos  = (pageX - me.startPageX) + (-1 * me.activeIndex) * me.getWidth();
				me.moveLimit = Math.abs(pageX - me.startPageX);

				style.webkitTransform = 'translateX(' + me.movePos + 'px)';
				style.msTransform = 'translateX(' + me.movePos + 'px)';
				style.transform = 'translateX(' + me.movePos + 'px)';
			}
			else{
				me.movePos  = (pageY - me.startPageY) + (-1 * me.activeIndex) * me.getHeight();
				me.moveLimit = Math.abs(pageY - me.startPageY);

				style.webkitTransform = 'translateY(' + me.movePos + 'px)';
				style.msTransform = 'translateY(' + me.movePos + 'px)';
				style.transform = 'translateY(' + me.movePos + 'px)';
			}
		}
		
		return false;
	},
	onEnd: function(e){
		var me = e.data.me, 
			endPos = 0,
			style = me.carouselBody.get(0).style;

		if(me.moveLimit > 30){
			if(me.movePos > 0){
				me.activeIndex = 0;
			}
			else{
				if(Math.abs(me.movePos) > Math.abs(me.endPos)){
					me.activeIndex++;
					if(me.activeIndex >= (me.config.children.length - 1)){
						me.activeIndex = me.config.children.length - 1;
					}
				}
				else{
					me.activeIndex--;
				}
			}

			if(me.activeIndex === 0){
				endPos = 0;
			}
			else if(me.activeIndex > 0){
				if(me.config.direction === 'x'){
					endPos = (me.getWidth() * me.activeIndex) * -1;
				}
				else{
					endPos = (me.getHeight() * me.activeIndex) * -1;
				}
			}
			me.endPos = endPos;
		}
		else{
			endPos = me.endPos;	
		}
		
		style.webkitTransitionDuration = me.config.duration + 'ms';
		if(me.config.direction === 'x'){
			style.webkitTransform = 'translateX(' + endPos + 'px)';
			style.msTransform = 'translateX(' + endPos + 'px)';
			style.transform = 'translateX(' + endPos + 'px)';
		}
		else{
			style.webkitTransform = 'translateY(' + endPos + 'px)';
			style.mozTransform = 'translateY(' + endPos + 'px)';
			style.transform = 'translateY(' + endPos + 'px)';
		}

		me.fireEvent(me, 'change', [me, me.activeIndex, me.getActiveView()]);

		me.carouselBody.off(X.events.move, me.onMove);
		me.carouselBody.off(X.events.end, me.onEnd);
		
		me.dragging = false;
	},
	/**
	 * @method
     * @desc 현재 활성화되어 있는 아이템을 반환한다.
     * @memberof X.ui.Carousel.prototype
     * @return {Component} component 
     * @example
     * var car = new X.ui.Carousel({
     *      direction: "x",
     *      activeIndex: 0,
     *      duration: 200,
     *      children: [new X.View(), new X.View(), new X.View()]
     * });
     * 
     * car.getActiveView();
     */
	getActiveView: function(){
		return this.config.children[this.activeIndex];
	},
	/**
	 * @method
     * @desc 마지막에 새로운 요소를 추가한다.
     * @memberof X.ui.Carousel.prototype
     * @param {Component} component 
     * @return {Component} component 
     * @example
     * carousel.append(new X.View());
     */
	append: function(comp){
		var comps = X.util.cm.create(this.carouselBody, [comp]),
		    position;
		
		this.config.children.push(comps[0]);
		comps[0].getEl().addClass('ui-carousel-views');
		
		if(this.config.direction === 'x'){
		    position = 'left';
		}
		else{
		    position = 'top';
		}
		
		comps[0].getEl().css(position, ((this.config.children.length-1) * 100) + '%');
		
		return comps[0];
	},
	/**
	 * @method
     * @desc 지정한 인덱스에 해당하는 요소를 삭제한다.
     * @memberof X.ui.Carousel.prototype
     * @param {Component} component 
     * @example
     * carousel.remove(0);
     */
	remove: function(index){
		this.config.children[index].destroy();
		this.config.children.remove(index);
	},
	destroy: function(){
		X.ui.Carousel.base.destroy.call(this);
		X.getWindow().off(X.events.orientationchange, this.orientationChange);
	},
	/**
	 * @method
     * @desc 바로 다음 요소로 이동시킨다.
     * @memberof X.ui.Carousel.prototype
     * @example
     * carousel.next();
     */
	next: function(){
		var index = this.activeIndex + 1,
			style = this.carouselBody.get(0).style;
			
		if(index === this.config.children.length){
		    return false;
		}

		style.webkitTransitionDuration = this.config.duration + 'ms';
        style.msTransitionDuration = this.config.duration + 'ms';
		style.transitionDuration = this.config.duration + 'ms';

		if(this.config.direction === 'x'){
			style.webkitTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
			style.msTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
			style.transform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
		}
		else{
			style.webkitTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
			style.msTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
			style.transform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
		}

		this.activeIndex = index;
		this.fireEvent(this, 'change', [this, this.activeIndex, this.getActiveView()]);
	},
	/**
	 * @method
     * @desc 바로 이전 요소로 이동시킨다.
     * @memberof X.ui.Carousel.prototype
     * @example
     * carousel.prev();
     */
	prev: function(){
		var index = this.activeIndex - 1,
			style = this.carouselBody.get(0).style;

		if(index === -1){
		    return false;
		}

        style.webkitTransitionDuration = this.config.duration + 'ms';
        style.msTransitionDuration = this.config.duration + 'ms';
		style.transitionDuration = this.config.duration + 'ms';

		if(this.config.direction === 'x'){
			style.webkitTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
			style.msTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
			style.transform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
		}
		else{
			style.webkitTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
			style.msTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
			style.transform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
		}

		this.activeIndex = index;
		this.fireEvent(this, 'change', [this, this.activeIndex, this.getActiveView()]);
	}
});

X.util.cm.addCString('carousel', X.ui.Carousel);