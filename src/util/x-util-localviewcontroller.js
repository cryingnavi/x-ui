X.util.LocalViewController = X.extend(X.util.ViewController, {
	initialize: function(config){
		this.config = {
			activeIndex: 0,
		};
		X.apply(this.config, config);
		X.util.LocalViewController.base.initialize.call(this, this.config);

		this.views = [];
	},
	init: function(view){
		X.util.LocalViewController.base.init.call(this, view);
		
		this.views = this.view.config.items;
		this.viewsInit();
	},
	viewsInit: function(){
		if(this.views.length < 1){
			return false;
		}
		
		var views = this.views,
			len = views.length,
			activeIndex = this.config.activeIndex,
			activeView;

		activeView = views[activeIndex];

		this.setActiveView(activeView);
		this.history.initPageSave(activeView.getId(), activeView);

		views.forEach(function(view){
			view.el.addClass('ui-vc-views');
			view.hide();
		});

		activeView.show();
	},
	valid: function(fromView, toView){
		if(fromView === toView){
			return true;
		}
		else{
			return false;
		}
	},
	getActiveIndex: function(){
		var active = this.getActiveView();
		for(var i=0; i<this.views.length; i++){
			if(active === this.views[i]){
				return i;
			}
		}
	},
	getView: function(index){
		if(this.views.length < 1){
			return null;
		}
		
		var view = this.views[index];
		if(!view){
			return null;
		}
		
		return view;
	},
	nextPage: function(config){
		if(X.util.vcm.changing){
			return false;
		}
		
		if(!config){
			return false;
		}
		
		var fromView = this.getActiveView(),
			toView = this.getView(config.index);
		
		if(this.valid(fromView, toView)){
			return false;
		}
		
		X.util.vcm.changing = true;

		toView.show();
		this.nextMove(fromView, toView, config);
	},
	prevPage: function(config){
		if(X.util.vcm.changing){
			return false;
		}
		
		if(!config){
			return false;
		}
		
		var fromView = this.getActiveView(),
			toViewInfo = this.history.getViewInfo(this.getView(config.index).getId());
		
		if(this.valid(fromView, toViewInfo.view)){
			return false;
		}

		X.util.vcm.changing = true;

		toViewInfo.view.show();
		this.prevMove(fromView, toViewInfo.view, {
			transition: toViewInfo.transition
		});
	},
	appendView: function(view){
		view.el.addClass('ui-vc-active');
		this.views.push(view);

		return view;
	},
	removeView: function(view){
		var i=0,
			views = this.views,
			len = views.length,
			array = [];
		
		for(; i<len; i++){
			if(views[i] !== view){
				array.push(views[i]);
			}
		}
		this.views = array;

		this.history.removeMap(id);
		this.history.removeStack(id);

		return view;
	}
});
X.util.cm.addCString('localviewcontroller', X.util.LocalViewController);