define([
	"underscore",
	"backbone",
	"../models/user"
], function(_, Backbone, User){
	var Users = Backbone.Collection.extend({
		model: User
	});
	
	var users = new Users();
	
	users.add({
	    pic: "1.jpeg",
	    name: "김하나"
	});
	
	users.add({
	    pic: "2.jpeg",
	    name: "김하나"
	});
	
	users.add({
	    pic: "3.jpeg",
	    name: "김하나"
	});
	
	users.add({
	    pic: "4.jpeg",
	    name: "김하나"
	});
	
	users.add({
	    pic: "5.jpeg",
	    name: "김하나"
	});
	
	users.add({
	    pic: "6.jpeg",
	    name: "김하나"
	});
	
	users.add({
	    pic: "7.jpeg",
	    name: "김하나"
	});

	return users;
});