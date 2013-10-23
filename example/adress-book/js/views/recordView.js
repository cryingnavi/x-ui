define([
    "jquery",
    "underscore",
    "backbone",
    "text!../../tpl/recordTpl.html"
], function($, _, Backbone, recordTpl){
    $("body").append(recordTpl);

    var View = Backbone.View.extend({
        tagName:  "li",
        template: _.template($('#item-template').html()),
        events:{
            "vclick": "rowClick"
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            /*
            var me = this;
            X.util.cm.get("main-view").getViewController().on({
                afternextchange: function(){
                    me.afterNextChange();
                }
            });
            */
        },
        rowClick: function(){
            X.util.cm.get("main-view").getViewController().nextPage({
                url: "./tpl/detailTpl.html",
                callback: {
                    scope: this,
                    success: this.afterNextChange
                }
            });
        },
        afterNextChange: function(){
            alert(this.model);
        }
    });

    return View;
});