define([
    "jquery",
    "underscore",
    "backbone",
    "text!../../tpl/recordTpl.html",
    "../views/detailView",
], function($, _, Backbone, recordTpl, DetailView){
    var View = Backbone.View.extend({
        tagName:  "li",
        template: _.template($(recordTpl).html()),
        events:{
            "vclick": "rowClick"
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
        },
        rowClick: function(){
            X.util.cm.get("main-view").getViewController().nextPage({
                url: "./html/detail.html",
                transition: transition[i],
                listener: {
                    scope: this,
                    beforenextchange: this.beforeNextChange
                }
            });
        },
        beforeNextChange: function(from, to){
            var d = new DetailView({
                model: this.model,
                toView: to
            });
            d.render();
        }
    });

    return View;
});