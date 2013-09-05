(function(){
var html = '<h1>type</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'jquery 의 $.type 에 dom element 와 jquery 엘리먼트 인지 여부를 추가로 검사하여 반환한다.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>type</span>' +
				'<div><p>타입을 검사할 객체를 지정한다.</p></div>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Returns</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>type</span> : String' +
				'<div><p>해당 객체의 타입을 문자열로 반환한다. 만약 해당 객체가 dom element 였다면 "dom"을. jquery 객체였다면 "jquery"를 반환한다.</p></div>' +
			'</li>' +
		'</ul>' +
	'</div>' +


	
	'<h3>Usags</h3>' +
	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'X.type(document.getElementById("id"))	//dom\n' +
			'X.type($("#id"))						//jquery\n' +
		'</pre>' +
	'</div>' +

'</div>';

window["core/type"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["core/type"].render();
})();