(function(){
var html = '<h1>getWindowSize</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'현재 브라우저 크기를 반환한다' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>없음</span>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Returns</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>size</span> : json' +
				'<div><p>{width: 300, height: 300} 형태와 같은 json 객체를 반환한다.</div>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Usags</h3>' +
	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'X.getWindowSize()\n' +
		'</pre>' +
	'</div>' +

'</div>';

window["core/getWindowSize"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["core/getWindowSize"].render();
})();