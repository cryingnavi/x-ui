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
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "2.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "3.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "4.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "5.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "6.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "김",
	    lastName: "하나",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});

	return users;
});