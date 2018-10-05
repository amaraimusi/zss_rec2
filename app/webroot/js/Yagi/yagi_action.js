/**
 * 山羊アクションクラス
 * 2015-11-12	新規作成
 * 
 */
var YagiAction =function(){
	
	this.datas=null;//窓口締切情報群
	
	this.web_root='';		//Ajax通信先へのルート
	this.debug_slc='';	//デバッグ要素のセレクタ名
	
	/**
	 * 初期化。
	 * 表示切替を行う。
	 */
	this.init=function(web_root,debug_slc){
		
		//引数をメンバにセット
		this.web_root=web_root;
		this.debug_slc=debug_slc;
		

	};
	
	/**
	 * 窓口締切データと締切日時を表示する。
	 * 「確認する」ボタンを押した時、窓口締切データパネルを表示する。
	 */
	this.preview=function(){
		
		//プレビューが表示中であれば、隠す。
		if(this.previewShowFlg==1){
			this.previewShowFlg=0;//非表示にする
			$('#tw_closing_preview').hide();
			return;
		}

		var data=this.datas.data;//窓口締切情報群から窓口締切データを取得する。
		
		//窓口締切データからHTMLテーブルコードを作成する。
		var h='';
		for(var key in data){
			var ent=data[key];
			var tr= "<tr>" +
				"<td>" + ent.id + "</td>" + 
				"<td>" + ent.modified + "</td>" + 
				"<td>" + ent.first_chat_msg + "</td>" + 
				"<td>" + ent.lg_name + "</td>" + 
				"<td>" + ent.lg_ip_addr + "</td>" + 
				"</tr>";
			h += tr;
		}
		
		//HTMLテーブルコードを要素にセットして表示する。
		$('#tw_closing_preview table tbody').html(h);
		$('#tw_closing_preview').show();
		

		this.previewShowFlg=1;//表示中にする
		
		
		
	};

	//窓口締切データパネルをto閉じる
	this.previewClose=function(){
		$('#tw_closing_preview').hide();
		this.previewShowFlg=0;
	};
	
	
	/**
	 * ★締切実行
	 */
	this.execution=function(myself){

		var data={
				'yagi_id':99,
				'name':'赤山羊',
				};
		
		var json_str = JSON.stringify(data);//データをJSON文字列にする。
		
		var url =this.web_root + "yagi/yagi_action";//Ajax通信先URL
		
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
						
						myself.showTable(res.data);//テーブルデータを作成して表示
						
					}else{
						myself.error('エラー:none res',str_json);
					}
					

				}catch(e){
					myself.error('エラー:try',str_json);
				}
				

			},
			error: function(xmlHttpRequest, textStatus, errorThrown){
				myself.error(textStatus,xmlHttpRequest.responseText);
			}
		});
	};
	
	/**
	 * データからHTMLテーブルを組み立て表示する。
	 * @param data 2次元データ
	 */
	this.showTable=function(data){
		
		var thead="<thead><tr><th>ID</th><th>名前</th><th>日付</th></tr></thead>";
		var trs='';
		for(var key in data){
			var ent=data[key];
			var tr= "<tr>" +
				"<td>" + ent.id + "</td>" + 
				"<td>" + ent.yagi_name + "</td>" + 
				"<td>" + ent.yagi_date + "</td>" + 
				"</tr>";
			trs += tr;
		}
		
		var h_tbl="<table>" + thead + "<tbody>" + trs + "</tbody></table>";
		
		$('#ajax_res').html(h_tbl);
	};
	
	/**
	 * エラー出力
	 * @param alert_msg アラートメッセージ
	 * @param dump AJAXレスポンスなどダンプコード
	 */
	this.error=function(alert_msg,dump){
		console.log(this.web_root + ':' + alert_msg);
		alert(alert_msg);
		$(this.debug_slc).html(dump);
	};

};

