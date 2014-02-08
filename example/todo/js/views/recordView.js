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
        events: {
            "vclick": "rowClick",
            "vclick a": "deleteClick"
        },
        initialize: function(){
            this.listenTo(this.model, "destroy", this.deleteRow);
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
        },
        rowClick: function(){
            var listview = X.util.cm.get("listview");
            listview.ul.find("a").hide();
            
            this.$el.find("a").show();
        },
        deleteClick: function(){
            this.model.destroy();
            return false;
        },
        deleteRow: function(){
            var listview = X.util.cm.get("listview");
            var index = listview.ul.children("li").index(this.el);

            listview.remove(index);
        }
    });

    return View;
});