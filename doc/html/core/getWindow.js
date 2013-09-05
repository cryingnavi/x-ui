(function(){
var html = '<h1>getWindow</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'window 객체를 반환한다. 인자로 true를 넘기면 window 를 반환하고 아니면 jquery(window) 를 반환한다.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span><i>[flag : Boolean]</i></span>' +
				'<div><p>생략 가능하며 true를 넘길시 window 를 반환한다. </p></div>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Returns</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>doc</span> : window | jquery("window")' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Usags</h3>' +
	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'X.getWindow()\n' +
		'</pre>' +
	'</div>' +

'</div>';

window["core/getWindow"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["core/getWindow"].render();
})();