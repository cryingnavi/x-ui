(function(){
var html = '<h1>initPage</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>view</span> : X.View' +
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
			'vc.nextPage({\n' +
			'	url: "b.html"\n' +
			'});\n' +
		'</pre>' +
	'</div>' +
'</div>';

window["vcm/setErrorMsg"] = {
	render: function(){
		$("#content").html(html);
	}
};

window["vcm/setErrorMsg"].render();
})();
