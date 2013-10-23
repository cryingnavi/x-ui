define([
    "underscore",
    "backbone",
    "./views/mainView"
], function(_, Backbone, MainView){
    var Router = Backbone.Router.extend({
        routes: {
			//url router
			"/add": "showAdd",
			"/detail": "showDetail",
			"*actions": "defaultRoute"
		},
		defaultRoute: function(){
		   var v = new MainView();
		   v.render();
		},
		showAdd: function(){
		    
		},
		showDetail: function(){
		    
		}
    });
    return Router;
});