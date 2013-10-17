(function(){
var html = '<h1>backPage</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'바로 이전 view 로 돌아간다' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>없음</span>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Returns</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>void</span>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Usags</h3>' +
	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'var view = new X.View({\n' + 
			'	viewController: new X.util.remoteViewController(),\n'+
			'});\n' +
			'var vc = view.getViewController();\n' +
			'vc.initPage({\n' +
			'	url: "a.html"\n' +
			'});\n' +
			'vc.nextPage({\n' +
			'	url: "b.html"\n' +
			'});\n' +
			'vc.backPage();\n' +
		'</pre>' +
	'</div>' +
'</div>';

window["rvc/backPage"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["rvc/backPage"].render();
})();
