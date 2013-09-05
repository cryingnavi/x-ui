(function(){
var html = '<h1>config</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'view contaroller 생성시 config' +
	'</div>' +

	'<h3>Usags</h3>' +
	'<table class="table table-bordered">' +
		'<colgroup>' +
			'<col width="90">' +
			'<col width="90">' +
			'<col width="*">' +
		'</colgroup>' +
		'<thead>' + 
			'<tr>' + 
				'<th>이름</th>' + 
				'<th>Default</th>' + 
				'<th>설명</th>' + 
			'</tr>' + 
		'</thead>' + 
		'<tbody>' +
			'<tr>' + 
				'<td>transition</td>' + 
				'<td>slide</td>' + 
				'<td>애니메이션 종류를 지정한다.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>activeIndex</td>' + 
				'<td>0</td>' + 
				'<td>초기 view 를 결정한다.</td>' + 
			'</tr>' +
		'</tbody>' + 
	'</table>' +
'</div>';

window["lvc/config"] = {
	render: function(){
		$("#content").html(html);
	}
};

window["lvc/config"].render();
})();
