define([
    "x-ui",
    "backbone",
    "./views/mainView"
], function(X, Backbone, MainView){
    return {
        initialize: function(){
            X.App({
                ready: function(appView){
        			appView.setContent();

        			var mainViwe = X.util.cm.get("main-view");
                    mainViwe.setViewController(new X.util.RemoteViewController({
                        listener: {
                            afterinit: function(){
                                var v = new MainView();
                                v.render();
                            }
                        }
                    }));
                    mainViwe.getViewController().initPage({
                        url: "./tpl/mainTpl.html"
                    });
        		}
            });
        }
    };
});
