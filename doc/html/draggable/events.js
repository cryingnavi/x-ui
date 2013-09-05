(function(){
var html = '<h1>events</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'Draggable 제공하는 이벤트' +
	'</div>' +

	'<h3>Usags</h3>' +
	'<table class="table table-bordered">' +
		'<colgroup>' +
			'<col width="90">' +
			'<col width="*">' +
		'</colgroup>' +
		'<thead>' + 
			'<tr>' + 
				'<th>이름</th>' + 
				'<th>설명</th>' + 
			'</tr>' + 
		'</thead>' + 
		'<tbody>' +
			'<tr>' + 
				'<td>start</td>' + 
				'<td>드래그가 시작되면 발생한다.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>move</td>' + 
				'<td>드래그가 이뤄지는 동안 계속적으로 발생한다.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>end</td>' + 
				'<td>드래그가 끝나면 발생한다.</td>' + 
			'</tr>' +
		'</tbody>' + 
	'</table>' +
'</div>';

window["draggable/events"] = {
	render: function(){
		$("#content").html(html);
	}
};

window["draggable/events"].render();
})();
