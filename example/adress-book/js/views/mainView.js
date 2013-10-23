define([
    "jquery",
    "x-ui",
    "underscore",
    "backbone",
    "text!../../tpl/mainTpl.html",
    "../collection/users",
    "../views/recordView",
], function($, X, _, Backbone, mainTpl, Users, RecordView){
    var View = Backbone.View.extend({
        el: $("#main-view"),
        initialize: function() {
            this.listenTo(Users, "add", this.onAdd);
        },
        render: function(){
            var view = X.util.cm.get("main-view");
            var newView = new X.View({
                scroll: false,
                content: mainTpl
            });
            
            view.add([newView]);
            view.getViewController().appendView(newView);
            
            this.onCreate();
        },
        onCreate: function(){
            Users.each(this.onAdd, this);
        },
        onAdd: function(model){
            var r = new RecordView({
                model: model
            });
            r.render();
            X.util.cm.get("address-list").append(r.$el);
        }
    });
    
    
    return View;
})