(function(){
var html = '<h1>nextPage</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'���� �������� ��ȯ�Ѵ�.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>config</span> : Object' +
				'<div>url, history, transition, revers, params �� ������Ƽ�� ���� ��ü�� �ѱ��.</div>' + 
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
			'//Ư�� �̺�Ʈ�� �Ʒ� �ڵ带 �����Ѵ�.\n' +
			'vc.nextPage({\n' +
			'	url: "b.html"\n' +
			'});\n' +
		'</pre>' +
	'</div>' +
'</div>';

window["rvc/nextPage"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["rvc/nextPage"].render();
})();
