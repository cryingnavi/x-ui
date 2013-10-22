define([
    "x-ui",
    "backbone",
    "router"
], function(X, Backbone, Router){
    return {
        initialize: function(){
            new Router();
            Backbone.history.start();
        }
    };
});
