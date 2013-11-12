X.ui.LayoutView = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			resize: true,
			minSize: {
				west: 100,
				east: 100,
				south: 50,
				nouth: 50
			},
			maxSize: {
				west: 400,
				east: 400,
				south: 150,
				nouth: 150
			},
			size: {
				west: 200,
				east: 200,
				south: 100,
				nouth: 100
			},
			regions: null,
			scroll: false
		};
		X.apply(true, this.config, config);
		
		this.resizeing = false;
		this.region = null;
		this.spliters = { };
		this.currentResizeing = null;

		X.ui.LayoutView.base.initialize.call(this, this.config);
	},
	render: function(){
		X.ui.LayoutView.base.render.call(this);
		this.el.addClass('ui-layout');
		
		this.contain = X.util.em.get().addClass('ui-layout-contain');
		this.body.append(this.contain);
		
		if(this.config.minSize.west > this.config.size.west){
		    this.config.size.west = this.config.minSize.west;
		}
		
		if(this.config.minSize.east > this.config.size.east){
		    this.config.size.east = this.config.minSize.east;
		}

		if(this.config.minSize.south > this.config.size.south){
		    this.config.size.south = this.config.minSize.south;
		}
		
		if(this.config.minSize.nouth > this.config.size.nouth){
		    this.config.size.nouth = this.config.minSize.nouth;
		}

		this.createView();
		
		this.maxWidth = this.el.width();
		this.maxHeight = this.el.height();

		for(var attr in this.config.regions){
			if(attr === 'center'){
				continue;
			}
			this.createSpliter(attr);
		}
		
		X.getWindow().on(X.events.orientationchange, { me: this }, this.orientationChange);
	},
	orientationChange: function(e){
	    var me = e.data.me;
	    me.resizeSplitter();
	    me.fire(me, 'orientationchange', [me]);
	},
	destroy: function(){
		X.ui.LayoutView.base.destroy.call(this);
		X.getWindow().off(X.events.orientationchange, this.orientationChange);
	},
	createView: function(){
		var hViews = [], vViews = [], 
			regions = this.config.regions;
	
		for(var attr in regions){
			if(attr === 'west' || attr === 'east'){
				regions[attr].config.width = this.config.size[attr];
				regions[attr].config.height = false;
				regions[attr].config.flexible = false;

				hViews.push(regions[attr]);
			}

			this[attr] = regions[attr];
			
			if(attr === 'south' || attr === 'nouth'){
				regions[attr].config.width = false;
				regions[attr].config.height = this.config.size[attr];
				regions[attr].config.flexible = false;
				
				vViews.push(regions[attr]);
			}
		}

		if(regions.center){
			hViews.push(regions.center);
		}

		X.util.cm.create(this.body, vViews);
		if(regions.nouth){
			regions.nouth.el.insertBefore(this.contain);
		}
		
		X.util.cm.create(this.contain, hViews);
		if(regions.east){
			regions.east.el.insertAfter(regions.center.el);
		}
		
		for(var attr in regions){
			regions[attr].el.addClass('ui-layout-items ' + attr);
		}
	},
	createSpliter: function(region){
		var position,
		    direction,
		    div = X.util.em.get()
			    .addClass('ui-layout-spliter ' + region);
			
		if(region === 'west'){
		    position = 'left';
		    direction = 'x';
		}
		else if(region === 'east'){
		    position = 'right';
		    direction = 'x';
		}
		else if(region === 'south'){
		    position = 'bottom';
		    direction = 'y';
		}
		else{
		    position = 'top';
		    direction = 'y';
		}
		
		this.resizeSplitter();
		
		div.css(position, this.config.size[region] - 10);

		this.spliters[region] = div;
		this.el.append(div);

		new X.util.Draggable({
		    el: div,
		    direction: direction,
		    scope: this,
		    listener: {
		        start: this.onStart,
		        move: this.onMove,
		        end: this.onEnd
		    },
		    constrain: this.el
		});
		
		
		
		this[region].el.on('webkitTransitionEnd', {me: this}, function(e){
		    var me = e.data.me;
		    me.resizeSplitter();
            return false;
        });
	},
	resizeSplitter: function(){
	    var west = this.spliters.west,
	        east = this.spliters.east;

	    if(west){
	        west.css({
                height: this.west.getHeight(),
                top: this.west.el.position().top
            });
	    }
	    
	    if(east){
	        east.css({
                height: this.east.getHeight(),
                top: this.east.el.position().top
            });
	    }
	    
	},
	onStart: function(drag){
	    var currentResizeing;
	    if(drag.el.hasClass('west')){
	        currentResizeing = 'west';
	    }
	    else if(drag.el.hasClass('east')){
	        currentResizeing = 'east';
	    }
	    else if(drag.el.hasClass('nouth')){
	        currentResizeing = 'nouth';
	    }
	    else{
	        currentResizeing = 'south';
	    }
	    this.currentResizeing = currentResizeing;
	},
	onMove: function(drag, region){
	    if(this.currentResizeing === 'west'){
	        if(region.r <= this.config.minSize.west || region.r >= this.config.maxSize.west){
	           return false;
	        }
	    }
	    else if(this.currentResizeing === 'east'){
            var l = this.getWidth() - region.l;
	        if(l <= this.config.minSize.east || l >= this.config.maxSize.east){
				return false;
			}
	    }
	    else if(this.currentResizeing === 'nouth'){
	        if(region.b <= this.config.minSize.nouth || region.b >= this.config.maxSize.nouth){
				return false;
			}
	    }
	    else {
	        var t = this.getHeight() - region.t;
	        if(t <= this.config.minSize.south || t >= this.config.maxSize.south){
				return false;
			}
	    }
    },
	onEnd: function(drag, region){
	    var size = 0,
	        resizeView = null;

        if(this.currentResizeing === 'west'){
	        if(region.r <= this.config.minSize.west){
	           size = this.config.minSize.west;
	        }
	        else if(region.r >= this.config.maxSize.west){
	            size = this.config.maxSize.west;
	        }
	        else{
	            size = region.r;
	        }
	        this.west.setWidth(size);
	        resizeView = this.west;
	    }
	    else if(this.currentResizeing === 'east'){
	        var l = this.getWidth() - region.l;
            if(l <= this.config.minSize.east){
	           size = this.config.minSize.east;
	        }
	        else if(l >= this.config.maxSize.east){
	            size = this.config.maxSize.east;
	        }
	        else{
	            size = l;
	        }
	        this.east.setWidth(size);
	        resizeView = this.east;
	    }
	    else if(this.currentResizeing === 'nouth'){
	        if(region.b <= this.config.minSize.nouth){
	           size = this.config.minSize.nouth;
	        }
	        else if(region.b >= this.config.maxSize.nouth){
	            size = this.config.maxSize.nouth;
	        }
	        else{
	            size = region.b;
	        }
	        this.nouth.setHeight(size);
	        resizeView = this.nouth;
	    }
	    else {
	        var t = this.getHeight() - region.t;
            if(t <= this.config.minSize.south){
	           size = this.config.minSize.south;
	        }
	        else if(t >= this.config.maxSize.south){
	            size = this.config.maxSize.south;
	        }
	        else{
	            size = t;
	        }
	        this.south.setHeight(size);
	        resizeView = this.south;
        }

	    this.fireEvent(this, 'resize', [this, resizeView]);
	}
});