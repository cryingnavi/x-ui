X.ui.LayoutView = X.extend(X.View, {
	initialize: function(config){
		this.config = {
			resize: true,
			minSize: {
				west: 100,
				east: 100,
				south: 100,
				nouth: 100
			},
			maxSize: {
				west: 400,
				east: 400,
				south: 200,
				nouth: 200
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
		
		this.resizeing = false;
		this.region = null;
		
		this.spliters = { };		
		for(var attr in this.config.regions){
			if(attr === 'center'){
				continue;
			}
			this.createSpliter(attr);
		}
		
		if(X.platform.hasTouch){
			X.getWindow().bind('orientationchange', { me: this }, function(){
				return false;
			});
		}
		else{
			X.getWindow().bind('resize', { me: this }, function(e){
				var me = e.data.me;
				me.fire(me, 'resize', []);
				return false;
			});
		}
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
		
		this.el.bind('mousemove', { me: this }, this.mousemove);
		this.el.bind('mouseup', { me: this }, this.mouseup);
	},
	createSpliter: function(region){
		var div = X.util.em.get()
			.addClass('ui-layout-spliter ' + region);

		this.spliters[region] = div;
		this.config.regions[region].el.prepend(div);

		this.spliters[region].bind('mousedown', {me: this, region: region}, this.mousedown);
	},
	mousedown: function(e){
		var me = e.data.me,
			region = e.data.region;

		me.resizeing = true;		
		me.region = region;
	},
	mousemove: function(e){
		var me = e.data.me;
		if(!me.resizeing || !me.region){
			return;
		}

		var pageX = e.originalEvent.touches ? 
				e.originalEvent.touches[0].pageX : e.originalEvent.pageX,
			pageY = e.originalEvent.touches ? 
				e.originalEvent.touches[0].pageY : e.originalEvent.pageY;

		var region = me.region,
			view = me[region];

		if(region === 'west'){
			var left = view.getEl().offset().left,
			    originW = view.getWidth() + left,
				ww = 0;

			//left
			if(originW > pageX){
				ww = originW - pageX;
				ww = (originW - ww + 5) - left;
			}

			//right
			if(originW < pageX){
				ww = Math.abs(originW - pageX);
				ww = (originW + ww + 5) - left;
			}

			if(ww < me.config.maxSize.west && ww > me.config.minSize.west){
				view.setWidth(ww);
			}
		}
		
		else if(region === 'east'){
			var left = view.getEl().offset().left,
				originW = view.getWidth(),
				ww = 0;
			
			//left
			if(left > pageX){
				ww = originW + Math.abs(left - pageX);
			}
			
			//right
			if(left < pageX){
				ww = originW - Math.abs(left - pageX);
			}
			
			if(ww < me.config.maxSize.east && ww > me.config.minSize.east){
				view.setWidth(ww);
			}
		}
		
		else if(region === 'nouth'){
		    var top = view.getEl().offset().top
		        originH = view.getHeight() + top,
				hh = 0;

			if(originH < pageY){
				hh = Math.abs(originH - pageY);
				hh = (originH + hh) - top;
			}

			if(originH > pageY){
				hh = Math.abs(originH - pageY);
				hh = (originH - hh) - top;
			}

			if(hh < me.config.maxSize.nouth && hh > me.config.minSize.nouth){
				view.setHeight(hh);
			}
		}
		
		else if(region === 'south'){
		    var originH = view.getEl().offset().top,
				hh = 0;

			if(originH < pageY){
				hh = Math.abs(originH - pageY);
				hh = view.getHeight() - hh;
			}

			if(originH > pageY){
				hh = Math.abs(originH - pageY);
				hh = view.getHeight() + hh;
			}
			
			console.log(hh);

			if(hh < me.config.maxSize.south && hh > me.config.minSize.south){
				view.setHeight(hh);
			}
		}

		me.fireEvent(me, 'resize', []);
	},
	mouseup: function(e){
		var me = e.data.me;
		me.resizeing = false;
		me.region = null;
	}
});


X.util.cm.addCString('layoutview', X.ui.LayoutView);