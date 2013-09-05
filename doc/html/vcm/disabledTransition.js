(function(){
var html = '<h1>disabledTransition</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'화면 전환시 애니메이션을 사용하지 않도록 설정한다' +
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
				'<span>void</span>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Usags</h3>' +
	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'X.util.vcm.disabledTransition()\n' +
		'</pre>' +
	'</div>' +
'</div>';

window["vcm/disabledTransition"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["vcm/disabledTransition"].render();
})();
