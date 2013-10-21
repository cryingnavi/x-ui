define([
    "jquery",
    "x-ui",
    "underscore",
    "backbone",
    "text!../../tpl/main.html"
], function($, X, _, Backbone, tpl){
    var View = Backbone.View.extend({
        el: $("#main-view"),
        render: function(){
            debugger;
            var view = X.util.cm.get("main-view");
            view.setContent(_.template(tpl, {}));
        }
    });
    
    
    return View;
});