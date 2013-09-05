(function(){
var html = '<h1>backPage</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'' +
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
			'	items: [\n'+
			'		new X.View(),\n' +
			'		new X.View(),\n' +
			'		new X.View()\n' +
			'	]\n' +
			'});\n' +
			'var vc = view.getViewController();\n' +
			'vc.nextPage({\n' +
			'	index: 1\n' +
			'});\n' +
			'vc.backPage();\n' +
		'</pre>' +
	'</div>' +
'</div>';

window["lvc/backPage"] = {
	render: function(){
		$("#content").html(html);
	}
};

window["lvc/backPage"].render();
})();
