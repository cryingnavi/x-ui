(function(){
var html = '<h1>nextPage</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'다음 페이지를 불러온다.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>index : Number</span>' +
				'<div><p>다음 페이지로 불러올 view의 index를 기술한다.</p></div>' +
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
		'</pre>' +
	'</div>' +
'</div>';

window["vcm/get"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["vcm/get"].render();
})();
