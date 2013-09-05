(function(){
var html = '<h1>setLoadingMsg</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'화면을 불러올 동안 띄워줄 메시지를 지정한.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>msg</span> : String' +
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
			'X.util.vcm.setLoadingMsg("test");\n' +
		'</pre>' +
	'</div>' +
'</div>';

window["vcm/setLoadingMsg"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["vcm/setLoadingMsg"].render();
})();
