/**
 * 一覧のチェックボックス複数選択による一括処理
 * Check box in list Batch processing with multiple selection.
 * ProcessWithMultiSelection.js
 * 
 * @note
 * 当クラスは、一覧を複数選択して一括処理を行う処理をサポートする。
 * 一括無効化、一括有効化などの機能を備えている。
 * 複数選択の方法はチェックボックスにのみ対応している。
 * 
 * @version 1.0
 * @date 2016-2-5
 * 
 * @param param
 * - tbl_slt HTMLテーブルのセレクタ
 * - cb_slt チェックボックスのセレクタ（class属性名 or name属性名）	省略時："pwms"
 * - id_slt IDのセレクタ（class属性名 or name属性名）	省略時："id"
 * - ajax_url AJAX送信先URL
 */
var ProcessWithMultiSelection =function(param){

	this.param = param;
	
	var myself=this; // Instance of myself.

	/**
	 * initialized.
	 */
	this.constract=function(){
		
		// If Option property is empty, set a value.
		this.param = setOptionIfEmpty(this.param);
		
	};
	
	// If Option property is empty, set a value.
	function setOptionIfEmpty(param){
		
		if(param == undefined){
			param = {};
		}
		
		if(param['tbl_slt'] == undefined){
			param['tbl_slt'] = 'tbl1';
		}
		
		if(param['cb_slt'] == undefined){
			param['cb_slt'] = 'pwms';
		}
		
		if(param['id_slt'] == undefined){
			param['id_slt'] = 'id';
		}
		
		if(param['ajax_url'] == undefined){
			throw new Error("'ajax_url' is nothing");
		}
		
		return param;
	};
	
	
	
	/**
	 * 一括アクション
	 * @param kind_no アクション種別番号 10:有効化,  11:無効化
	 */
	this.action = function(kind_no){
		
		// チェックされた行のIDをリストで取得する
		var ids = getIdLintInChecked();
		
		// IDリストが0件なら処理抜け
		if(ids.length == 0){
			return;
		}
		
		// 無効化である場合、確認ダイアログを表示する
		if(kind_no == '11'){
			var rs = confirm('チェックした行を削除してもよろしいですか？');
			if(!rs){
				return;
			}
		}
		
		// Ajaxへ送信するデータをセットする
		var data={'ids':ids,'kind_no':kind_no};
		var json_str = JSON.stringify(data);//データをJSON文字列にする。

		//☆AJAX非同期通信
		$.ajax({
			type: "POST",
			url: myself.param.ajax_url,
			data: "key1="+json_str,
			cache: false,
			dataType: "text",
			success: function(res, type) {

				if(res=='success'){
					
					// ブラウザをリロードする
					location.reload(true);
					
				}else{
					$("#err").html(res);
				}
				

			},
			error: function(xmlHttpRequest, textStatus, errorThrown){
				$('#err').html(xmlHttpRequest.responseText);//詳細エラーの出力
				alert(textStatus);
			}
		});
	};

	
	
	
	/**
	 * チェックされた行のIDをリストで取得する
	 * 
	 * @return IDリスト
	 * 
	 */
	function getIdLintInChecked(){
		
		var ids = []; // IDリスト
		
		var slt = myself.param.tbl_slt + ' tbody tr';
		$(slt).each(function(){
			
			var tr = $(this);
			
			// TR要素内からname属性またはclass属性を指定してチェックボックス要素を取得する
			var cb = getElmByNameOrClass(tr,myself.param.cb_slt);
			
			
			// チェックされている場合のみIDを取得してリストに追加する
			var checked = cb.prop('checked');
			if(checked){
				
				// TR要素内からname属性またはclass属性を指定してID値を取得する
				var id = getValueByNameOrClass(tr,myself.param.id_slt);
				ids.push(id);
			}
			
		});
		
		
		return ids;
		
	}
	
	/**
	 * 親要素内からname属性またはclass属性を指定して要素を取得する
	 * @param parElm 親要素
	 * @param key name属性名またはclass属性名
	 * @return 要素<jquery object>
	 */
	function getElmByNameOrClass(parElm,key){
		var elm = parElm.find("[name='" + key + "']");
		if(!elm[0]){
			elm = parElm.find('.' + key);
		}
		return elm;
		
	}
	
	/**
	 * 親要素内からname属性またはclass属性を指定して値を取得する
	 * @param parElm 親要素
	 * @param key name属性名またはclass属性名
	 * @return 値
	 */
	function getValueByNameOrClass(parElm,key){
		var v = undefined;
		var elm = parElm.find("[name='" + key + "']");
		if(elm[0]){
			v = elm.val();
		}else{
			elm = parElm.find('.' + key);
			if(elm[0]){
				v = elm.text();
			}
		}
		return v;
	}
	
	
	
	
	
	
	/**
	 * 全選択の切替
	 * @param triggerCb トリガーチェックボックス
	 */
	this.switchAllSelection = function(triggerCb){

		// トリガーチェックボックスのチェックを取得する
		var trigCb = $(triggerCb);
		var trigChecked = trigCb.prop('checked');
		
		// 一覧をループして全行のチェック切替を行う
		var slt = myself.param.tbl_slt + ' tbody tr';
		$(slt).each(function(){
			
			var tr = $(this);
			
			// TR要素内からname属性またはclass属性を指定してチェックボックス要素を取得する
			var cb = getElmByNameOrClass(tr,myself.param.cb_slt);
			
			// チェックを切り替える
			cb.prop('checked',trigChecked);
			
		});
		
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// call constractor method.
	this.constract();
};