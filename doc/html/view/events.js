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
				'<td>드래그 객체의 드래그가 시작 될 때 발생한다.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>move</td>' + 
				'<td>드래그 객체의 드래그가 이뤄지는 동안 계속적으로 발생한다.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>end</td>' + 
				'<td>드래그 객체의 드래그가 끝나면 발생한다.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>enter</td>' + 
				'<td>드래그 객체의 드롭 영역으로 들어올때 한번 발생한다.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>leave</td>' + 
				'<td>드래그 객체의 드롭 영역에서 나갈 때 한번 발생한다.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>hover</td>' + 
				'<td>드래그 객체의 드롭 영역에서 머무를때 계속적으로 발생한</td>' + 
			'</tr>' +
		'</tbody>' + 
	'</table>' +
'</div>';

window["droppable/events"] = {
	render: function(){
		$("#content").html(html);
	}
};

window["droppable/events"].render();
})();
