(function(){
var html = '<h1>prevPage</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'생성된 viewController 의 객체를 반환한다.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>id : String</span>' +
				'<div><p>viewController의 id 를 문자열로 넘긴다.</p></div>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Returns</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>vc</span> : viewController' +
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
	}
};

window["lvc/prevPage"].render();
})();
