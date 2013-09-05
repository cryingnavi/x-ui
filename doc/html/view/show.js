(function(){
var html = '<h1>get</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'Draggable 생성시 config' +
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
				'<td>accept</td>' + 
				'<td>*</td>' + 
				'<td>selector를 지정하여 받아들일 Drag 객체를 지정한다.</td>' + 
			'</tr>' +
		'</tbody>' + 
	'</table>' +
'</div>';

window["droppable/config"] = {
	render: function(){
		$("#content").html(html);
	}
};

window["droppable/config"].render();
})();
