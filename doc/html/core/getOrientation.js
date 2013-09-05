(function(){
var html = '<h1>type</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'기기의 방향의 landscape 인지 portrait 인지를 문자열로 반환한다.' +
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
				'<span>orientation</span> : String' +
				'<div><p>기기의 방향의 landscape 인지 portrait 인지를 문자열로 반환한다.</p></div>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Usags</h3>' +
	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'X.getOrientation()\n' +
		'</pre>' +
	'</div>' +

'</div>';

window["core/getOrientation"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["core/getOrientation"].render();
})();