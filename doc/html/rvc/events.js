(function(){
var html = '<h1>events</h1>' +
'<div>' +
	'<h3>Description</h3>' +
	'<div class="description">' +
		'view controller 가 제공하는 이벤트' +
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
				'<td>beforeprevchange</td>' + 
				'<td>이전 페이지를 호출하기 직전에 발생한다.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>afterprevchange</td>' + 
				'<td>이전 페이지를 호출하고 페이지가 전환되면 발생한다.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>beforenextchange</td>' + 
				'<td>다음 페이지를 호출하기 직전에 발생한다.</td>' + 
			'</tr>' +
			'<tr>' + 
				'<td>afternextchange</td>' + 
				'<td>다음 페이지를 호출하고 페이지가 전환되면 발생한다.</td>' + 
			'</tr>' +
		'</tbody>' + 
	'</table>' +
'</div>';
'</div>';


window["rvc/events"] = {
	render: function(){
		$("#content").html(html);
	}
};

window["rvc/events"].render();
})();
