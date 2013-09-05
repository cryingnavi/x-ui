(function(){
var html = '<h1>extend</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'클래스를 상속한다.' +
	'</div>' +

	'<h3>Parameters</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>superClass</span> : Function' +
				'<div><p>부모 클래스를 지정한다.</p></div>' +
			'</li>' +
			'<li>' +
				'<span>prototype</span> : Object' +
				'<div><p>자식 클래스의 prototype 에 덮붙일 object를 지정한다.</p></div>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Returns</h3>' +
	'<div class="description">' +
		'<ul>' +
			'<li>' +
				'<span>childClass</span> : Function' +
				'<div><p>자식 클래스를 반한다.</p></div>' +
			'</li>' +
		'</ul>' +
	'</div>' +

	'<h3>Usags</h3>' +
	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'SuperClass = X.extend(X.emptyFn, {\n' +
			'	initalize: function(config){\n' +
			'		this.config = {};\n' + 
			'		X.apply(this.config, config);\n' + 
			'	}\n' +
			'});\n\n' +

			'ChildClass = X.extend(SuperClass, {\n' +
			'	initalize: function(config){\n' +
			'		this.config = {};\n' + 
			'		X.apply(this.config, config);\n' + 
			'		ChildClass.base.prototype.initalize.call(this, this.config);\n' + 
			'	}\n' +
			'});\n\n' +

			'GrandsonClass = X.extend(ChildClass, {\n' +
			'	initalize: function(config){\n' +
			'		this.config = {};\n' + 
			'		X.apply(this.config, config);\n' + 
			'		GrandsonClass.base.prototype.initalize.call(this, this.config);\n' + 
			'	}\n' +
			'});\n' +
		'</pre>' +
	'</div>' +

	'<div class="description">' +
		'<pre class="brush: js" name="code">' + 
			'SuperClass = X.extend(X.emptyFn, {\n' +
			'	initalize: function(config){\n' +
			'		this.config = {};\n' + 
			'		X.apply(this.config, config);\n' + 
			'	}\n' +
			'});\n\n' +

			'ChildClass = SuperClass.extend({\n' +
			'	initalize: function(config){\n' +
			'		this.config = {};\n' + 
			'		X.apply(this.config, config);\n' + 
			'		ChildClass.base.prototype.initalize.call(this, this.config);\n' + 
			'	}\n' +
			'});\n\n' +

			'GrandsonClass = ChildClass.extend({\n' +
			'	initalize: function(config){\n' +
			'		this.config = {};\n' + 
			'		X.apply(this.config, config);\n' + 
			'		GrandsonClass.base.prototype.initalize.call(this, this.config);\n' + 
			'	}\n' +
			'});\n' +
		'</pre>' +
	'</div>' +
'</div>';

window["core/extend"] = {
	render: function(){
		$("#content").html(html);
		SyntaxHighlighter.highlight();
	}
};

window["core/extend"].render();
})();