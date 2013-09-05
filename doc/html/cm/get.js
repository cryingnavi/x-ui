(function(){
var html = '<h1>get</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'생성된 UI Component를 반환한다.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>id</span> : String' +
				'<div><p>Component 의 id.</p></div>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Returns</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>ui</span> : Object' +
				'<div><p>생성된 UI Component를 반환한다.</p></div>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Usags</h3>' +
	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'new X.View({\n' +
			'	id: "view"\n,' +
			'	scroll: true\n' +
			'});\n\n' +
			'var view = X.util.cm.get("view");\n' +
		'</pre>' +
	'</div>' +

	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'<div data-role="view" data-scroll="true" id="view"></div>\n' +
			'var view = X.util.cm.get("view");\n' +
		'</pre>' +
	'</div>' +
'</div>';

window["core/get"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["core/get"].render();
})();
