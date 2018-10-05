
$(function() {

	//ファイルアップロードのイベントセットなど初期化を行う。
	fileUploadInit();
});


/**
 * ファイルアップロードの初期化
 * 
 * ファイル読込イベントなどを組み込む
 * 
 * @ver 1.0
 * @date 2016-3-8 リニューアル
 */
function fileUploadInit(){
	var webroot=$("#webroot").val();//ルートパスを取得

	//ファイルアップロードイベントをセットする
    $('#file1').change(function() {

    	$("#file1").hide();
    	$("#loading").show();//読込中メッセージを表示する。

    	//Ajax通信先URL
    	var fn=webroot + "same/ajax";
    	fn=encodeURI(fn);//URLエンコード

     	//Ajaxにてファイルをアップロードする。
        $(this).upload(fn, function(res) {
        	
        	//ファイルアップロードのAjaxレスポンス処理
        	fileUploadRes(res);

        }, 'html');
    });
}

/**
 * ファイルアップロードのAjaxレスポンス処理
 * @param res Ajaxレスポンス
 */
function fileUploadRes(res){

	try{
		var data=$.parseJSON(res);//JSON文字列をパースしてJSONオブジェクトを生成する。
		
		var msg = 'name = ' + data.name + '<br>';
		msg+= 'type = ' + data.type + '<br>';
		msg+= 'size = ' + data.size + '<br>';
		msg+= 'tmp_name = ' + data.tmp_name + '<br>';
		msg+= 'error = ' + data.error + '<br>';
		$('#res').html(msg);
		
		$('#reload_a').show();

	}catch( e ){//サーバー（PHP側）でエラーがあると、おかしなresが返るのでパースに失敗する。
		$("#loading").hide();//読込中メッセージを隠す。
		$("#err_msg").html(res);//出力
		return null;
	}
	

	$("#loading").hide();//読込中メッセージを隠す。
}




