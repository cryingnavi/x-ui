if(!window.Todo){
    Todo = { };
}

require.config({
    paths: {
        "jquery": "../../../libs/x-ui/js/jquery-1.10.2.min",
        "x-ui": "../../../libs/x-ui/js/x-ui",
        "x-event": "../../../libs/x-ui/js/x-event",
        "x-sroll": "../../../libs/x-ui/js/x-scroll",
        "underscore": "./libs/underscore-min",
        "backbone": "./libs/backbone-min"
    },
    shim: {
        "x-ui": {
            deps: ["jquery"],
            exports: "X"
        },
        "x-scroll": {
            exports: "iScroll"
        },
        "underscore": {
            exports: function() { return _; }
        },
        'backbone': {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});

require(["app"], function(app){
	app.initialize();
});