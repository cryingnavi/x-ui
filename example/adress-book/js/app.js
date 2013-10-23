define([
    "x-ui",
    "backbone",
    "router"
], function(X, Backbone, Router){
    return {
        initialize: function(){
            X.App({
                ready: function(appView){
        			appView.setContent();
        			
        			
        			var mainViwe = X.util.cm.get("main-view");
        			mainViwe.setViewController(new X.util.RemoteViewController());
        			mainViwe.getViewController().initPage({
        			    url: ""
        			});
        			
        			//new Router();
                    //Backbone.history.start();
        		}
            });
        }
    };
});
