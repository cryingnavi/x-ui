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
            "submit form": "createOn",
            "vclick #btn-clear": "clearAll"
        },
        initialize: function() {
            this.listenTo(Todos, 'add', this.addOne);
            this.listenTo(Todos, 'reset', this.addAll);
            this.listenTo(Todos, 'destroy', this.modelDestroy);
            
            var view = X.util.cm.get("main-view");
            view.setContent(mainTpl);

            this.input = this.$("#new-todo");
            this.count = this.$("#count");
            
            Todos.fetch();
        },
        render: function(){
            this.setCount();
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
            
            this.setCount();
        },
        addAll: function(){
            Todos.each(this.addOne, this);
        },
        setCount: function(){
            this.count.html(Todos.length);
        },
        modelDestroy: function(){
            this.setCount();
        },
        clearAll: function(){
            for (var i = Todos.length - 1; i >= 0; i--){
                Todos.at(i).destroy();
            }
        }
    });
    
    
    return View;
});