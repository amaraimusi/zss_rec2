

$(function() {

	init();//初期化
	
});


/**
 *  劣並替機能画面のJS
 * 
 * 
 * @date 2016-1-20 新規作成
 * @author k-uehara
 */
function init(){

	$( "#field_data" ).sortable();
	$( "#field_data" ).disableSelection();


}


/**
 * 適用ボタン
 */
function ok_btn(){
	$('#ok_btn').hide();//2重押し防止のため、適用ボタンを一時的に非表示にする。
	
	//列並替リスト要素からフィールドデータを取得する。
	var field_data=[];//フィールドデータ
	var i=0;
	$('#field_data li').each(function(){
		
		var elm = $(this);
		var id=elm.attr('id');//IDを取得
		var name = elm.children('.f_name').val();//列名を取得
		var row_order = elm.children('.row_order').val();//行並条件を取得
		var clm_sort_no = i;//列並順
		
		//列表示を取得
		var clm_show = elm.children('.clm_show:checked').val();
		if(clm_show == undefined){
			clm_show=0;
		}else{
			clm_show=1;
		}
		
		//フィールドデータに追加
		var ent={
			'id':id,	
			'name':name,	
			'row_order':row_order,	
			'clm_sort_no':clm_sort_no,	
			'clm_show':clm_show,	
		};
		field_data.push(ent);
		
		i++;
		
	});
	
	//Ajaxを通して、フィールドデータをサーバー側に適用する。
	ajax_ok(field_data);
	
	//列並替変更フラグをONにし、ローカルストレージに保存する。
	localStorage.setItem('clm_sort_chg_flg',1);
	
}


/**
 * Ajaxを通して、フィールドデータをサーバー側に適用する
 * 
 * @param field_data
 * @returns
 */
function ajax_ok(field_data){
	//エラーメッセージとデバッグダンプをクリアする。
	$('#err_msg').html('');
	$('#debug_dump').html('');
	
	//ページコードを取得する
	var page_code=$('#page_code').val();
	
	//AJAX送信データ
	var send_data={
			'page_code':page_code,
			'field_data':field_data
	}
	
	var json_str = JSON.stringify(send_data);//AJAX送信データをJSON文字列にする。
	
	var webroot = $('#webroot').val();//WEBルートを取得
	
	var url =webroot + "clm_sorter/ajax_ok";//Ajax通信先URL
	
	//☆AJAX非同期通信
	$.ajax({
		type: "POST",
		url: url,
		data: "key1="+json_str,
		cache: false,
		dataType: "text",
		success: function(str_json, type) {

			try{
				var res=$.parseJSON(str_json);//パース
				if(res.res_flg=='success'){
					
					
					$('#ok_btn').show();

					//成功メッセージ一時表示する。数秒後に徐々に消える。
					$('#ok_btn_success').show();
					$('#ok_btn_success').fadeOut(5000);
					
				}else{
					error('エラー:none res',str_json);
				}
				

			}catch(e){
				error('エラー:try',str_json);
			}
			

		},
		error: function(xmlHttpRequest, textStatus, errorThrown){
			error(textStatus,xmlHttpRequest.responseText);
		}
	});

}

/**
 * 初期化ボタンのアクション
 * 
 * 初期の列並びに戻します。
 */
function def_btn(){
	//エラーメッセージとデバッグダンプをクリアする。
	$('#err_msg').html('');
	$('#debug_dump').html('');
	
	//ページコードを取得する
	var page_code=$('#page_code').val();
	
	//AJAX送信データ
	var send_data={
			'page_code':page_code,
	}
	
	var json_str = JSON.stringify(send_data);//AJAX送信データをJSON文字列にする。
	
	var webroot = $('#webroot').val();//WEBルートを取得
	
	var url =webroot + "clm_sorter/def_btn";//Ajax通信先URL
	
	//☆AJAX非同期通信
	$.ajax({
		type: "POST",
		url: url,
		data: "key1="+json_str,
		cache: false,
		dataType: "text",
		success: function(str_json, type) {

			try{
				var res=$.parseJSON(str_json);//パース
				if(res.res_flg=='success'){//初期化成功時の処理
					
					//リロードする
					location.reload(true);
					
				}else{
					error('エラー:none res',str_json);
				}
				

			}catch(e){
				error('エラー:try',str_json);
			}
			

		},
		error: function(xmlHttpRequest, textStatus, errorThrown){
			error(textStatus,xmlHttpRequest.responseText);
		}
	});
}



//エラー表示
function error(err_msg,dump){
	$('#err_msg').html(err_msg);
	$('#debug_dump').html(dump);
	$('#ok_btn').show();
}
 











