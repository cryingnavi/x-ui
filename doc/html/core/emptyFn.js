(function(){
var html = '<h1>emptyFn</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'jquery 의 $.noop 와 같다.' +
	'</div>' +
'</div>';

window["core/emptyFn"] = {
	render: function(){
		$("#content").html(html);
	}
};

window["core/emptyFn"].render();
})();
