if(!window.Todo){
    Todo = { };
}

require.config({
    paths: {
        "jquery": "../../../libs/x-ui/js/jquery-1.10.2.min",
        "x-ui": "../../../libs/x-ui/js/x-ui",
        "x-event": "../../../libs/x-ui/js/x-event",
        "x-scroll": "../../../libs/x-ui/js/x-scroll",
        "underscore": "../libs/underscore-min",
        "backbone": "../libs/backbone-min",
        "text": "../libs/text",
        "backbone.localStorage": "../libs/backbone.localStorage-min"
    },
    shim: {
        "x-event": {
            deps: ["jquery"] 
        },
        "x-ui": {
            deps: ["jquery", "x-event", "x-scroll"],
            exports: "X"
        },
        "x-scroll": {
            exports: "iScroll"
        },
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        "backbone.localStorage": {
            deps: ["backbone"],
            exports: "Backbone"
        }
    }
});




require(["app"], function(app){
	app.initialize();
});