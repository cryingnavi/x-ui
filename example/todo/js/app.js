define([
    "x-ui",
    "router"
], function(X, router){
    return {
        initialize: function(){
            X.App({
                ready: function(appView){
        			appView.setContent();
        			
        			router.initialize();
        		}
            });
        }
    };
});