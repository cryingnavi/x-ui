define([
    "x-ui",
    "./views/mainView",
], function(X, mainView){
    return {
        initialize: function(){
            X.App({
                ready: function(appView){
        			appView.setContent();
        			
        			var o = new mainView();
		            o.render();
        		}
            });
        }
    };
});