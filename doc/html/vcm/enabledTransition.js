(function(){
var html = '<h1>enabledTransition</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'화면 전환시 애니메이션을 사용하도록 설정한다' +
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
			'X.util.vcm.enabledTransition()\n' +
		'</pre>' +
	'</div>' +
'</div>';


window["vcm/enabledTransition"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["vcm/enabledTransition"].render();
})();
