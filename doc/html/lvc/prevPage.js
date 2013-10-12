(function(){
var html = '<h1>prevPage</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'이전 페이지를 불러온다.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>index : Number</span>' +
				'<div><p>이전 페이지로 돌아갈 view의 index를 기술한다.</p></div>' +
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
			'	index: 2\n' +
			'});\n' +
			'vc.prevPage({\n' +
			'	index: 0\n' +
			'})\n' +
		'</pre>' +
	'</div>' +
'</div>';

window["lvc/prevPage"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["lvc/prevPage"].render();
})();
