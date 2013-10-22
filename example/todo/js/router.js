define([
    "jquery",
	"underscore",
	"backbone",
	"./views/mainView",
], function($, _, Backbone, mainView){
    var Router = Backbone.Router.extend({
        
    });
    
    var router = new Router();
    router.on("route:defaultRoute", function(){
		debugger;
		
	});
	
	router.on("todoadd", function(){
		debugger;
		
	});
    
    return {
        initialize: function(){
            var o = new mainView();
		    o.render();
        }
    };
});