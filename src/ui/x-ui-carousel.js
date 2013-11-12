X.ui.Carousel = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			direction: 'x',
			scroll: false,
			activeIndex: 0,
			duration: 200
		};
		X.apply(this.config, config);
		X.ui.Carousel.base.initialize.call(this, this.config);

		this.endPos = 0;
		this.dragging = false;
		this.activeIndex = this.config.activeIndex;
	},
	render: function(){
		X.ui.Carousel.base.render.call(this);
		this.el.addClass('ui-carousel');
		this.carouselBody = X.util.em.get().addClass('ui-carousel-body');

		var views = this.body.children('.ui-view').addClass('ui-carousel-views'),
			activeIndex = this.activeIndex,
			style = this.carouselBody.get(0).style,
			pos = 0, 
			itemSize = 0;
		
		if(views.length > 0){
			views.wrapAll(this.carouselBody);
		}
		else{
			this.el.append(this.carouselBody);
		}

		this.carouselBody = this.body.children('.ui-carousel-body');
		
		if(this.config.direction === 'x'){
			this.carouselBody.addClass('ui-carousel-horizontal');
		}
		else{
			this.carouselBody.addClass('ui-carousel-vertical');
		}

		if(this.config.direction === 'x'){
		    itemSize = this.getWidth();
		    pos = (-1 * activeIndex) * itemSize;
		    
			style.webkitTransform = 'translateX(' + (pos) + 'px)';
			style.msTransform = 'translateX(' + (pos) + 'px)';
			style.transform = 'translateX(' + (pos) + 'px)';
		}
		else{
		    itemSize = this.getHeight();
		    pos = (-1 * activeIndex) * itemSize;
		    
			style.webkitTransform = 'translateY(' + (pos) + 'px)';
			style.msTransform = 'translateY(' + (pos) + 'px)';
			style.transform = 'translateY(' + (pos) + 'px)';
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
					if(me.activeIndex >= (me.config.items.length - 1)){
						me.activeIndex = me.config.items.length - 1;
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
	getActiveView: function(){
		return this.config.items[this.activeIndex];
	},
	append: function(comp){
		var comps = X.util.cm.create(this.carouselBody, [comp]);
		this.config.items.push(comps[0]);
		comps[0].addClass('ui-carousel-views');
		
		return comps[0];
	},
	remove: function(index){
		this.config.items[index].destroy();
		this.config.items.remove(index);
	},
	destroy: function(){
		X.ui.Carousel.base.destroy.call(this);
		X.getWindow().off(X.events.orientationchange, this.orientationChange);
	},
	next: function(){
		var index = this.activeIndex + 1,
			style = this.carouselBody.get(0).style;

		style.webkitTransitionDuration = '200ms';
		if(this.config.direction === 'x'){
			style.webkitTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
			style.msTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
		}
		else{
			style.webkitTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
			style.msTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
		}

		this.activeIndex = index;
		this.fireEvent(this, 'change', [this, this.activeIndex, this.getActiveView()]);
	},
	prev: function(){
		var index = this.activeIndex - 1,
			style = this.carouselBody.get(0).style;

		style.webkitTransitionDuration = '200ms';
		if(this.config.direction === 'x'){
			style.webkitTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
			style.msTransform = 'translateX(' + ((-1 * index) * this.getWidth()) + 'px)';
		}
		else{
			style.webkitTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
			style.msTransform = 'translateY(' + ((-1 * index) * this.getHeight()) + 'px)';
		}

		this.activeIndex = index;
		this.fireEvent(this, 'change', [this, this.activeIndex, this.getActiveView()]);
	}
});

X.util.cm.addCString('carousel', X.ui.Carousel);