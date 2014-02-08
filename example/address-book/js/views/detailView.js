define([
    "jquery",
    "underscore",
    "backbone",
    "text!../../tpl/detailTpl.html"
], function($, _, Backbone, detailTpl){
    var View = Backbone.View.extend({
        template: _.template($(detailTpl).html()),
        initialize: function(config){
            this.el = X.util.cm.get("detail-view");
        },
        render: function(){
            this.el.setContent(this.template(this.model.toJSON()));
        }
    });

    return View;
});