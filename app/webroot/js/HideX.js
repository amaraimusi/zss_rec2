/**
 * 汎用項目隠しクラス
 * 
 * @note
 * 指定要素に簡単に表示切替機能を付加する。
 * 表示切替トリガーとなる要素にdata-hide-xを追加するだけでよい。値は表示切替対象のセレクタである
 * 追加する属性の例→data-hide-x="#xxx"
 * 
 * @param param
 * - range_slt 範囲セレクタ: 省略時はbody要素が範囲になる。
 * - ls_key ローカルストレージキー: 省略時は現在のURLがキーとして使われる
 */
var HideX =function(param){
	
	
	this.param = param;
	
	this.range; // 範囲要素
	
	this.data; // 隠データ
	
	var self=this; // Instance of myself.

	/**
	 * initialized.
	 */
	this.constract=function(){
		
		// If Param property is empty, set a value.
		var param = _setParamIfEmpty(this.param);
		 
		
		var rng = $(param.range_slt); // 範囲要素
		
		var data = {}; // 隠データ

		rng.find("[data-hide-x]").each(function(){
			var elm = $(this); // トリガー要素
			var key_code = elm.attr('data-hide-x'); // トリガー要素からキーコードを取得する
			
			data[key_code] = 0; // 隠データへセットする

			// トリガー要素にクリックイベントを組み込む
			elm.click(function(e){
				var trigger = $(this);
				clickTrigger(trigger);
			});
		});
		
		// ローカルストレージから既存データを取得する
		var existData = _getHideDataFromLoacalStrage();
		
		// 隠データに既存データをマージ
		var data = _margeToData(data,existData);
		
		this.data = data;
		this.range = rng;
		this.param = param;
		
		// 隠データをコンテンツ（範囲区分）に適用
		hideToContents();
	}
	
	// If Param property is empty, set a value.
	function _setParamIfEmpty(param){
		
		if(param == undefined){
			param = {};
		}
	
		
		if(param['range_slt'] == null){
			param['range_slt'] = 'body';
		}
		
		if(param['ls_key'] == null){
			param['ls_key'] = location.href;
		}
		
		return param;
	}
	
	
	
	
	/**
	 * ローカルストレージから既存データを取得する
	 * @returns 既存データを取得する
	 */
	function _getHideDataFromLoacalStrage(){
		
		var data; // 既存データ
		
		// ローカルストレージから既存データを取得する。なければ空オブジェクトをセットする。
		var data_json = localStorage.getItem(self.param.ls_key);
		if(!_empty(data_json)){
			data = JSON.parse(data_json);
		}else{
			data = {};
		}
		
		return data;
		
	}
	
	
	
	
	/**
	 * 隠データに既存データをマージ
	 * @param data 隠データ
	 * @param existData 既存データ： ローカルストレージから取得した隠データ
	 * @returns 隠データ
	 */
	function _margeToData(data,existData){
		
		for(var key_code in data){
			if(existData[key_code] != null ){
				data[key_code] = existData[key_code];
			}
		}
		return data;
	}
	
	
	
	
	
	
	/**
	 * 隠データをコンテンツ（範囲区分）に適用
	 */
	function hideToContents(){
		var data = self.data;
		var rng = self.range;
		
		for(var key_code in data){
			if(data[key_code] == 1){
				var tarElm = rng.find(key_code);
				tarElm.hide();
			}
		}
	}
	
	
	
	
	
	
	/**
	 * トリガー要素のクリックイベント
	 * @param trigger トリガー
	 */
	function clickTrigger(trigger){
		var data = self.data;
		var rng = self.range; 
		var key_code = trigger.attr('data-hide-x'); // トリガー要素からキーコードを取得する
		
		var tarElm = rng.find(key_code); // 対象要素
		var display = tarElm.css('display');
		if(display == 'none'){
			tarElm.show();
			data[key_code] = 0;
		}else{
			tarElm.hide();
			data[key_code] = 1;
		}
		
		// ローカルストレージに隠データを保存する
		_saveData();
		
	}
	

	/**
	 * ローカルストレージに隠データを保存する
	 */
	function _saveData(){
		var data_json = JSON.stringify(self.data);
		localStorage.setItem(self.param.ls_key,data_json);
	}

	
	

	// call constractor method.
	this.constract();
}