require.config({
    paths: {
        "jquery": "../../../libs/jquery-1.10.2.min",
        "x-ui": "../../../build/x-ui.min",
        "x-event": "../../../build/x-event.min",
        "x-scroll": "../../../build/x-scroll.min",
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