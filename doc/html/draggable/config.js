(function(){
var html = '<h1>config</h1>' +
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
				'<td>direction</td>' + 
				'<td>both</td>' + 
				'<td>드래그 방향을 지정하게 되며 "both"는 양쪽 방향 모두. "y" 세로방향. "x" 가로방향.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>constrain</td>' + 
				'<td>false</td>' + 
				'<td>드래그가 이뤄질 공간에 대한 범위를 지정. 엘리먼트 또는 window를 지정하면 해당 지역 내에서만 드래그가 이뤄진다.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>handle</td>' + 
				'<td>null</td>' + 
				'<td>handle 을 지정</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>revert</td>' + 
				'<td>false</td>' + 
				'<td>Drag 가 끝났을 경우 원래 위치로 돌아갈지 여부</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>revertDuration</td>' + 
				'<td>200</td>' + 
				'<td>revert 가 true 일 경우 원 위치로 돌아가는 동안의 animation 시간을 지장</td>' + 
			'</tr>' +
		'</tbody>' + 
	'</table>' +
'</div>';

window["draggable/config"] = {
	render: function(){
		$("#content").html(html);
	}
};

window["draggable/config"].render();
})();
