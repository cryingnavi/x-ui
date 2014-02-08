define([
    "jquery",
    "x-ui",
    "underscore",
    "backbone",
    "../collection/users",
    "../views/recordView",
], function($, X, _, Backbone, Users, RecordView){
    var View = Backbone.View.extend({
        el: $("#main-view"),
        initialize: function() {
            this.listenTo(Users, "add", this.onAdd);
        },
        render: function(){
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