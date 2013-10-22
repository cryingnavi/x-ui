define([
    "jquery",
    "x-ui",
    "underscore",
    "backbone",
    "../collection/todoList",
    "../views/recordView",
    "text!../../tpl/mainTpl.html"
], function($, X, _, Backbone, Todos, RecordView, mainTpl){
    var View = Backbone.View.extend({
        el: $("#main-view"),
        events: {
            "submit form": "createOn"
        },
        initialize: function() {
            this.listenTo(Todos, 'add', this.addOne);
            this.listenTo(Todos, 'reset', this.addAll);
            
            var view = X.util.cm.get("main-view");
            view.setContent(mainTpl);

            this.input = this.$("#new-todo");
            
            Todos.fetch();
        },
        render: function(){
            
        },
        createOn: function(e){
            var val = this.input.val();
            if (!val) {
                return false;
            }
            
            Todos.create({
                title: val 
            });
            
            this.input.val("");
            return false;
        },
        addOne: function(model){
            var record = new RecordView({
                model: model
            });
            record.render();
            X.util.cm.get("listview").prepend(record.$el);
        },
        addAll: function(){
            Todos.each(this.addOne, this);
        }
    });
    
    
    return View;
})