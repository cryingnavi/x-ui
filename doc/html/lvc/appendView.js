(function(){
var html = '<h1>appendView</h1>' +
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
				'<span>view</span> : X.View' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Usags</h3>' +
	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'var view = new X.View({\n' + 
			'	viewController: new X.util.localViewController()\n'+
			'});\n' +
			'var vc = view.getViewController();\n' +
			'vc.appendView(new X.View());\n' +
		'</pre>' +
	'</div>' +
'</div>';


window["lvc/appendView"] = {
	render: function(){
		$("#content").html(html);
	}
};

window["lvc/appendView"].render();
})();
