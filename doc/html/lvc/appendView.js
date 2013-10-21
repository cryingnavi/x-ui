(function(){
var html = '<h1>appendView</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'viewController 에 이동할 수 있는 새로운 view 를 추가한다.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>view</span> : X.View' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Returns</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>view</span> : X.View' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Usags</h3>' +
	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'var view = new X.View({\n' + 
			'	viewController: new X.util.localViewController(),\n'+
			'	items: [\n' + 
			'		new X.View()\n' +
			'	]\n'+
			'});\n' +
			'var newView = X.View();\n' +
			'view.add(newView);\n' +
			'var vc = view.getViewController();\n' +
			'vc.appendView(newView);\n' +
		'</pre>' +
	'</div>' +
'</div>';


window["lvc/appendView"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["lvc/appendView"].render();
})();
