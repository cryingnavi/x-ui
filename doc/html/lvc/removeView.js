(function(){
var html = '<h1>removeView</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'viewController 에서 view 하나를 삭제 한다.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>index : Number or id : String</span>' +
				'<div><p>index 나 view 에 속하는 id를 넘겨 해당 view를 viewController에서 삭제 한다.</p></div>' +
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
			'view.config.items[2].destroy();\n' +
			'vc.removeView(2);\n' +
		'</pre>' +
	'</div>' +
'</div>';

window["vcm/removeView"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["vcm/removeView"].render();
})();
