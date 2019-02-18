/**
 * ボタンサイズ変更【CrudBase用】
 * @version 1.0.0
 * @date 2018-10-27
 */
class CbBtnSizeChanger{
	
	/**
	 * コンストラクタ
	 * 
	 * @param object cnfData 設定データ（省略可）
	 * @param object param
	 * - save_flg 保存フラグ 0:保存しない , 1:保存する（デフォルト）
	 * - 
	 */
	constructor(param, cnfData){
		
		this.saveKeys = ['cnfData']; // ローカルストレージへ保存と読込を行うparamのキー。
		this.ls_key = "CbBtnSizeChanger"; // ローカルストレージにparamを保存するときのキー。
		this.param = this._setParamIfEmpty(param);
		
		// 設定データの初期化
		var cnfData = this._initCnfData(this.param, cnfData);
		
		// 設定フォームを作成
		var cnf_html = this._createCnfFormHtml(cnfData);
		var mainForm = jQuery(this.param.main_slt); // 設定フォーム
		mainForm.html(cnf_html);
		
		// 設定フォームにチェックイベント（クリックイベント）を組み込む
		this._setCheckEvent(mainForm, cnfData);
		
		// サブイベントをセットする
		this._setSubEvents(mainForm);
		
		// 保存フラグがONであるなら、設定データのボタンサイズ設定を各ボタンへ反映
		if(this.param.save_flg == 1){
			this._changeSizeAll(cnfData);
		}
		
		this.mainForm = mainForm;
		this.cnfData = cnfData;
		
	}
	
	/**
	 * If Param property is empty, set a value.
	 */
	_setParamIfEmpty(param){
		
		if(param == null) param = {};
	
		// ▼ ローカルストレージで保存していたパラメータをセットする
		var param_json = localStorage.getItem(this.ls_key);
		if(!this._empty(param_json)){
			var lsParam = JSON.parse(param_json);
			if(lsParam){
				for(var i in this.saveKeys){
					var s_key = this.saveKeys[i];
					param[s_key] = lsParam[s_key];
				}
			}
		}
		
		if(param['cnfData'] == null) param['cnfData'] = {};
		
		if(param['main_slt'] == null) param['main_slt'] = '#CbBtnSizeChanger';
		
		// ラジオボタンデータ
		if(param['radioData'] == null){
			param['radioData'] = [
				{'value':'btn-xs', 'wamei':' 極小'},
				{'value':'btn-sm', 'wamei':' 小　'},
				{'value':'', 'wamei':' 普通'},
				{'value':'btn-lg', 'wamei':' 大　'},
				]
		}
		
		if(param['save_flg'] == null) param['save_flg'] = 1;

		return param;
	}
	
	
	/**
	 * 設定データの生成
	 * @param param
	 * @param string cnfData 設定データ(引数）
	 * @return object 設定データ
	 */
	_initCnfData(param, cnfDataP){
		
		var cnfData = param.cnfData;
		if(this._empty(cnfDataP)) cnfDataP = {};
		
		jQuery.extend(cnfData, cnfDataP);

		if(this._empty(cnfData)) {
			
			cnfData = [
				{'slt':'.row_edit_btn','wamei':'編集ボタン','def_size':'btn-xs','size':'btn-xs'},
				{'slt':'.row_copy_btn','wamei':'複製ボタン','def_size':'btn-xs','size':'btn-xs'},
				{'slt':'.row_delete_btn','wamei':'削除ボタン','def_size':'btn-xs','size':'btn-xs'},
				{'slt':'.row_eliminate_btn','wamei':'抹消ボタン','def_size':'btn-xs','size':'btn-xs'},
				{'slt':'.row_exc_btn','wamei':'行入替ボタン(↑↓ボタン)','def_size':'btn-xs','size':'btn-xs'},
				{'slt':'.row_enabled_btn','wamei':'有効ボタン','def_size':'btn-xs','size':'btn-xs'},
				
			];
		}
		
		
		// ▼ セレクタからコード文字列を取得する
		for(var i in cnfData){
			var cnfEnt = cnfData[i];
			cnfEnt['code'] = this._getCodeFromSlt(cnfEnt.slt);
		}

		return cnfData;
		
	}
	
	/**
	 * セレクタからコード文字列を取得する
	 * @param string slt セレクタ
	 * @return string コード文字列
	 */
	_getCodeFromSlt(slt){
		
		var code = slt; // コード文字列
		
		// ▼ 先頭の一文字が「.」または「#」なら除去する。
		var s1 = code.charAt(0); // 先頭の一文字を取得する
		if(s1=='.' || s1=='#'){
			code = code.substr(1);
		}
		return code;
	}
	
	
	
	
	/**
	 * 設定フォームHTMLを作成
	 * @param object cnfData 設定フォーム
	 * @return string 設定フォームHTML
	 */
	_createCnfFormHtml(cnfData){
		
		// 設定一覧
		var html = "<div style='padding:10px;background-color:#8dbbf3;border-radius:5px;display:inline-block'><table class='tbl2'><tbody>";
		for(var i in cnfData){
			var cnfEnt = cnfData[i];
			html += "<tr>";
			html += "<td>" + cnfEnt.wamei + "</td>";
			var radios_html = this._createRadiosHtml(cnfEnt); // ラジオボタンHTMLを作成
			html += "<td>" + radios_html + "</td>";
			html += "</tr>";
		}
		html += "</tbody></table>";
		
		// 初期に戻すボタン
		html += "<input id='cbbsc_def_btn' type='button' value='初期に戻す' class='btn btn-default btn-xs' >";
		html += "<input id='cbbsc_close_btn' type='button' value='閉じる' class='btn btn-default btn-xs' >";
		html += "</div>";
		
		return html;
	}
	
	/**
	 * ラジオボタンHTMLを作成
	 * @param object cnfEnt 設定エンティティ
	 * @return string ラジオボタンHTML
	 */
	_createRadiosHtml(cnfEnt){
		
		var html = ""; // ラジオボタンHTML
		var radioData = this.param.radioData; // ラジオボタンデータ
		
		for(var i in radioData){
			var rEnt = radioData[i];
			
			var checked_str = '';
			if(rEnt.value == cnfEnt.size) checked_str = 'checked';
			
			var radio_name = 'cbbsc_r_' + cnfEnt.code;
			var radio_value = rEnt.value;
			
			var unit_radio_h = "<label class='btn btn-primary btn-sm'><input type='radio' " +
					"name='" + radio_name + "' " +
					"value='" + radio_value + "' " +
					checked_str + " >" +
					rEnt.wamei + "</label>";
			
			html += unit_radio_h;
		}
		
		html = "<div class='btn-group' >" + html + "</div>";
		return html;
	}
	
	
	/**
	 * 設定フォームにチェックイベント（クリックイベント）を組み込む
	 * @param jQuery mainForm 設定フォーム・jQueryオブジェクト
	 * @param object cnfData 設定データ
	 */
	_setCheckEvent(mainForm, cnfData){
		
		for(var i in cnfData){
			var cnfEnt = cnfData[i];
			var radio_name = 'cbbsc_r_' + cnfEnt.code;
			mainForm.find("[name='" + radio_name + "']").click((e)=>{
				this._checkEvent(e); // ラジオボタンのチェックイベント
			});
		}
	}
	
	/**
	 * ラジオボタンのチェックイベント
	 */
	_checkEvent(e){
		
		var radio = jQuery(e.target);
		
		var name = radio.attr('name');
		var value = radio.val();
		
		// name属性から設定エンティティを取得する
		var cnfEnt = this._getCnfEntByName(name);
		cnfEnt.size = value;

		// ▼設定エンティティのセレクタにひもづく要素をループしてサイズを変更する
		jQuery(cnfEnt.slt).each((i,btn) => {
			this._changeSize(btn,value);
		});
		
		if(this.param.save_flg == 1){
			this._saveParam(); // 設定を保存する
		}
		
	}
	
	/**
	 * name属性から設定エンティティを取得する
	 * @param string name ラジオボタンのname属性
	 * @return object 設定エンティティ
	 */
	_getCnfEntByName(name){
		
		var search_name = name.replace('cbbsc_r_', '');
		for(var i in this.cnfData){
			var cnfEnt = this.cnfData[i];
			if(cnfEnt.code == search_name){
				return cnfEnt;
			}
		}
		return null;
	}
	
	/**
	 * ボタン要素のサイズ変更する
	 * @param object btn ボタン要素
	 * @param string size サイズ文字列
	 */
	_changeSize(btn,size){
		btn = jQuery(btn);
		
		// ▼ ボタンサイズのclass属性をいったん除去する
		var radioData = this.param.radioData; // ラジオボタンデータ
		for(var i in radioData){
			var class_str = radioData[i].value; // ボタンサイズのclass属性  btn-xs, btn-sm, btn-lg
			if(class_str == '') continue;
			if(btn.hasClass(class_str)){
				if(size == class_str) return; // 変更不要であるなら処理抜け
				btn.removeClass(class_str);
			}
		}
		
		// サイズ文字列が空、つまり「普通」サイズならこの時点で処理を抜ける。
		if(size == '') return;
		
		// サイズ文字列をclass属性に追加する。
		btn.addClass(size);
		
	}
	
	
	/**
	 * 設定データのボタンサイズ設定を各ボタンへ反映
	 * @param cnfData 設定データ
	 */
	_changeSizeAll(cnfData){
		
		for(var i in cnfData){
			var cnfEnt = cnfData[i];
			jQuery(cnfEnt.slt).each((i,btn) => {
				this._changeSize(btn,cnfEnt.size);
			});
		}
	}
	

	/**
	 * サブイベントをセットする
	 * @param jQuery mainForm 設定フォーム・jQueryオブジェクト
	 */
	_setSubEvents(mainForm){
		
		// ▼「初期に戻す」ボタンにイベントをセットする
		mainForm.find("#cbbsc_def_btn").click((e)=>{
			this._returnToInit(); // 初期に戻す
		});
		
		// ▼「閉じる」ボタンにイベントをセットする
		mainForm.find("#cbbsc_close_btn").click((e)=>{
			this.mainForm.hide();
		});
		
	}
	
	/**
	 * 初期に戻す
	 */
	_returnToInit(){
		
		// ▼設定データを初期に戻す
		var cnfData = this.cnfData;
		for(var i in cnfData){
			var cnfEnt = cnfData[i];
			if(cnfEnt['def_size'] == null) cnfEnt['def_size'] = 'btn-xs';
			cnfEnt.size = cnfEnt.def_size;
		}
		
		// 設定データのボタンサイズ設定を各ボタンへ反映
		this._changeSizeAll(cnfData);
		
		// ラジオボタンに設定データを反映する
		this._setCnfDataToRadios(cnfData);

		// ローカルストレージに設定を保存
		this._saveParam();
	}
	
	
	/**
	 * ラジオボタンに設定データを反映する
	 * @param object cnfData 設定データ
	 */
	_setCnfDataToRadios(cnfData){
		
		for(var i in cnfData){
			var cnfEnt = cnfData[i];
			var radio_name = 'cbbsc_r_' + cnfEnt.code;
			var radio = this.mainForm.find("[name='" + radio_name + "'][value='" + cnfEnt.size + "']");
			if(radio[0]){
				radio.prop('checked',true);
			}
		}
		
	}


	/**
	 * ローカルストレージにパラメータを保存する
	 */
	_saveParam(){
		
		this.param['cnfData'] = this.cnfData;
		var lsParam = {};
		for(var i in this.saveKeys){
			var s_key = this.saveKeys[i];
			lsParam[s_key] = this.param[s_key];
		}
		var param_json = JSON.stringify(lsParam);
		localStorage.setItem(this.ls_key,param_json);
	}
	
	
	/**
	 * ローカルストレージで保存しているパラメータをクリアする
	 */
	_clear(){
		localStorage.removeItem(this.ls_key);
	}




	// Check empty.
	_empty(v){
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
}