(function(){
var html = '<h1>getBody</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'document 객체를 반환한다. 인자로 true를 넘기면 body element 를 반환하고 아니면 jquery("body") 를 반환한다.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span><i>[flag : Boolean]</i></span>' +
				'<div><p>생략 가능하며 true를 넘길시 body element 를 반환한다. </p></div>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Returns</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>doc</span> : body element | jquery("body")' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Usags</h3>' +
	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'X.getBody()\n' +
		'</pre>' +
	'</div>' +

'</div>';

window["core/getBody"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["core/getBody"].render();

})();