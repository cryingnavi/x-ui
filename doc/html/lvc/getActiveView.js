(function(){
var html = '<h1>getActiveView</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'현재 활성화된 view를 반환한다.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>없음</span> ' +
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
			'	viewController: new X.util.localViewController()\n'+
			'});\n' +
			'var vc = view.getViewController();\n' +
			'var activeView = vc.getActiveView();\n' +
		'</pre>' +
	'</div>' +
'</div>';

window["lvc/getActiveView"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["lvc/getActiveView"].render();
})();
