/**
 * 重複操作
 * 
 * @note
 * 重複データを入力しようとしたとき、既に登録されているレコードを確認するよう誘導する。
 * 既に登録されているレコードが無効になっているなら、有効ボタンを表示する。
 * 
 * @version 1.0
 * @date 2017-3-2 | 2017-3-6
 * 
 * @param param
 * - flg
 * 
 */
var OverlapOperation =function(param){
	
	
	this.param = param;
	
	var self=this; // Instance of self.

	/**
	 * initialized.
	 */
	this.constract=function(){
		
		// If Param property is empty, set a value.
		this.param = _setParamIfEmpty(this.param);
		
	};
	
	// If Param property is empty, set a value.
	function _setParamIfEmpty(param){
		
		if(param == undefined){
			param = {};
		}
		
		// 元のデータ（戻し用）
		if(param['restore_data'] == undefined){
			param['restore_data'] = {
					'id':0,
					'delete_flg':0,
			};
		}
		
		return param;
	};
	
	
	/**
	 * フォーム表示コール
	 * @param form_slt フォーム要素のセレクタ （新規入力フォームまたは編集フォームのセレクタを指定する）
	 */
	this.callShowForm = function(form_slt){
		var form = $(form_slt);
		var ent = {};
		
		var idElm = _findInParentEx(form,'id');
		var id = _getValueEx(idElm);
		if(id==undefined){
			id=0;
		}
		ent['id'] = id;
		
		var delFlgElm = _findInParentEx(form,'delete_flg');
		ent['delete_flg'] = _getValueEx(delFlgElm);

		// 書換えフラグをOFFにする。
		self.param['rewrite_id_flg'] = 0;
		
		// エラーメッセージを消去
		form.find('.overlap_msg').html("");
		
		this.callShowFormBase(ent);
		
	}
	
	/**
	 * フォーム表示コール・基本
	 * @param ent エンティティ 
	 * 	-delete_flgは必須
	 */
	this.callShowFormBase = function(ent){
		
		if(ent['id']==undefined){
			throw new Error('id is empty!');
		}
		if(ent['delete_flg']==undefined){
			throw new Error('delete_flg is empty!');
		}
		
		// 戻し用にデータを元データとして保管しておく。
		self.param.restore_data = ent;
		

		
	}
	
	
	

	/**
	 * 重複チェックと操作表示
	 * @param ent Ajaxへ送信するエンティティ
	 * @param param パラメータ
	 * - ajax_url 重複チェックを行うサーバー側アクションへのURL
	 * - form_slt フォームセレクタ
	 * - overlap_field 重複チェックフィールド名
	 * - wamei 重複チェックフィールドの和名
	 * - msg_slt メッセージ要素
	 * @param callback Ajaxによる重複チェック後のコールバック（省略可）
	 */
	this.checkAndOperation = function(ent,param,callback){
		
	
		
		// パラメータの空プロパティにデフォルト値をセットする
		param = _setParamIfEmptyCao(param);
		
		var form = $(param.form_slt);
		
		// formオブジェクトからid要素の値を取得し、エンティティにセットする
		var id = _getValueFromForm(form,'id');
		ent['id'] = id;

		var json_str = JSON.stringify(ent);
		
		var ajax_url = param.ajax_url;
		

		// ファイル名等をAjaxでサーバーに送り、ファイル重複チェックを行う。
		$.ajax({
			type: "POST",
			url: ajax_url,
			data: "key1="+json_str,
			cache: false,
			dataType: "text",
			success: function(str_json, type) {
		
				var data;
				try{
					var data = $.parseJSON(str_json);//パース

				}catch(e){
					alert('エラー');
					$("#err").html(str_json);
					throw e;
				}
				
				// コールバックを実行
				if(callback){
					callback(data);
				}
				
				// Ajaxによる重複チェック後の書換え処理
				_rewriteAfterAjax(form,ent,param,data);
	
			},
			error: function(xmlHttpRequest, textStatus, errorThrown){
				$('#err').html(xmlHttpRequest.responseText);//詳細エラーの出力
				alert(textStatus);
			}
		});
		

		
		
	};
	
	

	
	
	/**
	 * パラメータの空プロパティにデフォルト値をセットする
	 * @param param パラメータ
	 * @returns 空プロパティにデフォルト値をセットしたパラメータ
	 */
	function _setParamIfEmptyCao(param){
		if(param['ajax_url'] == undefined){
			throw new Error("'ajax_url' is empty!");
		}
		
		if(param['form_slt']== undefined){
			param['form_slt'] = "#ajax_crud_new_inp_form";
		}
		
		if(param['overlap_field'] == undefined){
			throw new Error("'overlap_field' is empty!");
		}
		
		if(param['wamei']== undefined){
			param['wamei'] = "対象値";
		}
		
		if(param['msg_slt']== undefined){
			param['msg_slt'] = ".overlap_msg";
		}
		
		return param;
	}
	
	
	
	/**
	 * Ajaxによる重複チェック後の書換え処理
	 * @param form フォーム要素（jQueryオブジェクト）
	 * @param ent Ajaxへ送信したエンティティ
	 * @param param パラメータ
	 * @param resData Ajaxから受信したデータ
	 * @returns
	 */
	function _rewriteAfterAjax(form,ent,param,resData){
		
		var msgElm = $(param.msg_slt);
		

		// 重複なし
		if(_empty(resData)){
			
			// 書換えフラグがONになっている場合
			if(self.param.rewrite_id_flg == 1){
				
				// 重複データなしのときの書換え処理
				_rewriteForNone(form,msgElm);

				
			}
			
		}
		
		// 重複あり
		else{
			
			// レスポンスデータにIDまたは無効フラグな存在しなえければ例外を投げる
			if(resData['id'] === undefined || resData['delete_flg'] === undefined ){
				throw new Error('id or delete_flg is empty!');
			}
			
			// 重複値を取得する
			var overlap_value = resData[param.overlap_field];
			overlap_value = _xssSanitaizeEncode(overlap_value); // XSSサニタイズ

			// 重複あり・無効
			if(resData.delete_flg==1){
				
				// メッセージを組み立て、表示する
				var msg = param.wamei + "「" + overlap_value +"」はすでに存在します。<br>" + 
					"無効になっている重複レコードが存在します。そのまま登録すると、この行を有効にして上書きします。<br>" + 
					"上書きする行のID：" + resData.id;
				msgElm.html(msg);
				
				// フォームのid,無効フラグを書き換える
				_setValueFromForm(form,'id',resData.id);
				_setValueFromForm(form,'delete_flg',0);
			}

			// 重複あり・有効
			else{
	
				// メッセージを組み立て、表示する
				var msg = param.wamei + "「" + overlap_value +"」はすでに存在します。<br>" + 
					"重複レコードが存在します。そのまま登録すると、この行を上書きします。<br>" + 
					"上書きする行のID：" + resData.id;
				msgElm.html(msg);
				
				
				// フォームのidを書き換える
				_setValueFromForm(form,'id',resData.id);
			}

			self.param.rewrite_id_flg = 1;// 書換えフラグをONにする	
		}


	}
	
	

	// 重複データなし
	function _rewriteForNone(form,msgElm){
		// 元データ
		var restore_data = self.param.restore_data;
		
		// ID,無効フラグを元に戻す
		_setValueFromForm(form,'id',restore_data.id);
		_setValueFromForm(form,'delete_flg',restore_data.delete_flg);

		self.param.rewrite_id_flg = 0; // 書換えフラグをOFFに戻す
		
		msgElm.html(""); // 重複エラーメッセージをクリア
	}
	

	
	/**
	 * フィールドを指定してフォーム要素（親要素）に値をセットする
	 * @param form フォーム
	 * @param field フィールド
	 * @param value 値
	 * @returns 値
	 */
	function _setValueFromForm(form,field,value){
		var elm = _findInParentEx(form,field);
		
		if(!elm[0]){
			throw new Error("Not '" + field + "' in form!");
		}
		
		_setValueEx(elm,value);
		
	}
	
	/**
	 * フィールドを指定してフォーム要素から値を取得する
	 * @param form フォーム
	 * @param field フィールド
	 * @returns 値
	 */
	function _getValueFromForm(form,field){
		var elm = _findInParentEx(form,field);
		
		if(!elm[0]){
			throw new Error("Not '" + field + "' in form!");
		}
		
		var v = _getValueEx(elm);
		
		return v;
	}
	
	
	/**
	 * 要素の種類を問わずに値をセットする
	 * @param elm 要素(jQueryオブジェクト）
	 * @pramm v 値
	 * @version 0.2(α版）
	 */
	function _setValueEx(elm,v){
		
			var tagName = elm.get(0).tagName; // 入力要素のタグ名を取得する
			
			// 値を入力フォームにセットする。
			if(tagName == 'INPUT' || tagName == 'SELECT'){
				
				// type属性を取得
				var typ = elm.attr('type');
				
				if(typ=='checkbox'){
					if(v ==0 || v==null || v==''){
						elm.prop("checked",false);
					}else{
						elm.prop("checked",true);
					}
					
				}
				
				else if(typ=='radio'){
					var f = elm.attr('name');
					var parElm = elm.parent();
					var opElm = parElm.find("[name='" + f + "'][value='" + v + "']");
					if(opElm[0]){
						opElm.prop("checked",true);
					}

				}
				
				else{
					
					if(typeof v == 'string'){
						v = v.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
					}
					
					elm.val(v);
				}

				
			}
			
			// テキストエリア用のセット
			else if(tagName == 'TEXTAREA'){

				if(v!="" && v!=undefined){
					v=v.replace(/<br>/g,"\r");
					
					if(typeof v == 'string'){
						v = v.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
					}
				}

				elm.val(v);
				
			}
			
			// IMGタグへのセット
			else if(tagName == 'IMG'){
				// IMG要素用の入力フォームセッター
				elm.attr('src',v);
				
			}
			
			// audioタグへのセット
			else if(tagName == 'AUDIO'){
				elm.attr('src',v);
				
				
			}else{
				if(v!="" && v!=undefined){
					v=v.replace(/<br>/g,"\r");
					if(typeof v == 'string'){
						v = v.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
					}
					v = v.replace(/\r\n|\n\r|\r|\n/g,'<br>');// 改行コートをBRタグに変換する
				}
				
				elm.html(v);
			}

		
	}
	
	
	
	
	/**
	 * タグ種類を問わずに要素から値を取得する
	 * @param elm 要素
	 * @returns 要素の値
	 */
	function _getValueEx(elm){
		
		var v = undefined;
		var tagName = elm.prop("tagName"); 
		
		if(tagName == 'INPUT' || tagName == 'SELECT' || tagName=='TEXTAREA'){
			// type属性を取得する
			var typ = elm.attr('type');
			
			
			if(typ=='checkbox'){
				
				v = 0;
				if(elm.prop('checked')){
					v = 1;
				}
				
			}
			
			else if(typ=='radio'){
				var opElm = form.find("[name='" + f + "']:checked");
				v = 0;
				if(opElm[0]){
					v = opElm.val();
				}
	
			}
			
			else{
				v = elm.val();

			}
			
		}else{
			v = elm.html();
		}
		return v;
	}
	

	
	/**
	 * 親要素からフィールドで指定した要素を探す。class属性、name属性、id属性を見て探す。
	 * @param parElm 親要素
	 * @param field ﾌｨｰﾙﾄﾞ
	 * @returns 要素
	 */
	function _findInParentEx(parElm,field){
		var elm = parElm.find('.' + field);
		if(!elm[0]){
			elm = parElm.find("[name='" + field + "']");
		}else if(!elm[0]){
			elm = parElm.find('#' + field);
		}
		return elm;
	}
	
	
	// 空判定
	function _empty(v){
		if(v == null || v == '' || v=='0'){
			return true;
		}else{
			if(typeof v == 'object'){
				if(Object.keys(v).length == 0){
					return true;
				}
			}
			return false;
		}
	}
	
	
	//XSSサニタイズエンコード
	function _xssSanitaizeEncode(str){
		if(typeof str == 'string'){
			return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
		}else{
			return str;
		}
	}
	
	// call constractor method.
	this.constract();
};