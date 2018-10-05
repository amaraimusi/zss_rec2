/**
 * Ajaxサンプル
 * ★履歴
 * 2015/7/24	新規作成
 *
 */


$( function() {


	var data={'neko':'ネコ','same':{'hojiro':'ホオジロザメ','shumoku':'シュモクザメ'},'xxx':111};

	var json_str = JSON.stringify(data);//データをJSON文字列にする。

	//☆AJAX非同期通信
	$.ajax({
		type: "POST",
		url: "/hpo/devloper/ajax",
		data: "key1="+json_str,
		cache: false,
		dataType: "text",
		success: function(str_json, type) {

			var data=$.parseJSON(str_json);//パース
			console.log(data);
			$("#xxx").html(str_json);
			//alert(type);

		},
		error: function(xmlHttpRequest, textStatus, errorThrown){
			alert(textStatus);
		}
	});
});