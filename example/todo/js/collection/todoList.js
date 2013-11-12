define([
	"underscore",
	"backbone",
	"../models/todo",
	"backbone.localStorage"
], function(_, Backbone, model){
	var TodoList = Backbone.Collection.extend({
		model: model,
		localStorage: new Backbone.LocalStorage("todos-backbone")
	});

	return new TodoList();
});