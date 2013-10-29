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
	    lastName: "연아",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "2.jpeg",
	    firstName: "박",
	    lastName: "지성",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "3.jpeg",
	    firstName: "원",
	    lastName: "빈",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "4.jpeg",
	    firstName: "장",
	    lastName: "동건",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "5.jpeg",
	    firstName: "반",
	    lastName: "기문",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "6.jpeg",
	    firstName: "박",
	    lastName: "찬호",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "손",
	    lastName: "흥민",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "유",
	    lastName: "재석",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "박",
	    lastName: "명수",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "홍",
	    lastName: "명보",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "한",
	    lastName: "가인",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "손",
	    lastName: "예진",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "권",
	    lastName: "지용",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "이",
	    lastName: "하늬",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "조",
	    lastName: "인성",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});
	
	users.add({
	    pic: "7.jpeg",
	    firstName: "조",
	    lastName: "용필",
	    cellPhone: "010-1234-1234",
	    homePhone: "02-1234-1234",
	    workPhone: "031-1234-1234",
	    country: "한국",
	    city: "서울"
	});

	return users;
});