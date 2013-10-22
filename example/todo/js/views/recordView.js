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
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
        }
    });

    return View;
});