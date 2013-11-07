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
	render: function(){
		X.ui.ListView.base.render.call(this);
		this.el.addClass('ui-listview');

		this.ul = this.body.children('.ui-scrollview-view').children('ul');
		this.ul.children('li').addClass('ui-listview-item');

		this.ul.on('vclick', 'li', {me: this}, this.rowClick);
		this.scrollEvent();
	},
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
	replaceWith: function(index, row){
		if(X.type(index) !== 'number'){
			throw new Error('arguments must be number ');
		}

		var type = X.type(row);
		if(type === 'string'){
			row = $(row).addClass('ui-listview-item');
		}
		else if(type === 'jquery'){
			row.addClass('ui-listview-item');
		}
	
		this.ul.children('li:eq(' + index + ')').replaceWith(row);
	},
	remove: function(index){
		if(X.type(index) !== 'number'){
			throw new Error('arguments must be number ');
		}
		this.ul.children('li:eq(' + index + ')').remove();
		this.scrollRefresh();
	},
	removeAll: function(){
	    this.ul.children('li').remove();
	    this.scrollRefresh();
	}
});

X.util.cm.addCString('listview', X.ui.ListView);