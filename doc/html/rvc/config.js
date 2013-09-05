(function(){
var html = '<h1>disabledTransition</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		
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
				'<td>initPage</td>' + 
				'<td>null</td>' + 
				'<td>초기 view 를 결정한다.</td>' + 
			'</tr>' +
		'</tbody>' + 
	'</table>' +
'</div>';

window["vcm/disabledTransition"] = {
	render: function(){
		$("#content").html(html);
	}
};

window["vcm/disabledTransition"].render();
})();
