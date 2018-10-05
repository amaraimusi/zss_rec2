/**
 * CrudBase 自動保存機能
 * @version 1.0
 * @date 2018-3-2
 */
class CrudBaseAutoSave{
	
	
	/**
	 * コンストラクタ
	 * @param crudBase CrudBaseオブジェクト
	 */
	constructor(crudBase){

		this.crudBase = crudBase; // Htmlテーブルからデータを取得する関数
		this.fieldData = crudBase.fieldData;
		this.tbl = crudBase.tbl;
		this.msgElm = jQuery('#crud_base_auto_save_msg'); // 自動保存メッセージ要素
		this.data; // 保存するデータ
		this.set_timeout_hdl; // setTimeout関数のハンドラ

	}
	
	/**
	 * 自動保存の依頼をする
	 * 
	 * @note
	 * HTMLテーブルのデータをバックグランドで自動保存する。
	 * 
	 * @param data 保存対象データ   省略した場合、HTMLテーブルのデータを保存する。
	 * @parma option 
	 *  - reflect_on_tbl 0:HTMLテーブルにdataを反映しない , 1:HTMLテーブルにdataを反映する
	 */
	saveRequest(data,option){
		
		this.data = data; // 保存対象データを更新する

		// オプションの初期化
		if(option==null) option = {};
		if(option['reflect_on_tbl']==null) option['reflect_on_tbl'] = 0;
		if(option['interval']==null) option['interval'] = 3000;

		
		// setTimeoutの処理を一旦キャンセルする。
		if(this.set_timeout_hdl != null){
			clearTimeout(this.set_timeout_hdl);
		}
		
		// バックグラウンドで自動保存を実行する。(数秒後の遊びを設ける）
		this.set_timeout_hdl = setTimeout(()=>{
			this._autoSave(this.data);// 自動保存
			if(option['reflect_on_tbl']==1){
				this.crudBase.setDataToTbl(null,data); // データをHTMLテーブルに再セットする
			}
		}, option.interval);

	}
	
	/**
	 * 自動保存処理
	 * 
	 * @param data 保存対象データ   省略した場合、HTMLテーブルのデータを保存する。
	 */
	_autoSave(data){
	
		this.msgElm.html('保存中...');
		console.log('自動保存');
		if(data == null){
			var data = this.crudBase.getDataHTbl();// Htmlテーブルからデータを取得
		}
		data = this.crudBase.escapeForAjax(data); // Ajax送信データ用エスケープ。実体参照（&lt; &gt; &amp; &）を記号に戻す。
		var json_str = JSON.stringify(data);//データをJSON文字列にする。
		var url = this.crudBase.param.auto_save_url; // 自動保存サーバーURL
		
		// AJAX
		jQuery.ajax({
			type: "POST",
			url: url,
			data: "key1="+json_str,
			cache: false,
			dataType: "text",
		})
		.done((str_json, type) => {
			var res;
			try{
				res =jQuery.parseJSON(str_json);
				this.msgElm.html('');

			}catch(e){
				this.msgElm.html('自動保存のエラー1');
				jQuery("#err").html(str_json);
				return;
			}
		})
		.fail((jqXHR, statusText, errorThrown) => {
			this.msgElm.html('自動保存のエラー2');
			jQuery('#err').html(jqXHR.responseText);
		});
		
	}
	
}