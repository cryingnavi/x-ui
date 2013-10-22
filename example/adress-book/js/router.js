define([
    "underscore",
    "backbone"
], function(_, Backbone){
    var Router = Backbone.Router.extend({
        routes: {
			//url router
			"/add": "showAdd",
			"/detail": "showDetail",
			"*actions": "defaultRoute"
		},
		defaultRoute: function(){
		    
		},
		showAdd: function(){
		    
		},
		showDetail: function(){
		    
		}
    });
    return Router;
});