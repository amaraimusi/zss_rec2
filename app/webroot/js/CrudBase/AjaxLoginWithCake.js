/**
 * CakePHPによるAjax認証
 * 
 * @note
 * AjaxLoginWithCakeController.phpと連動
 * 
 * @date 2016-9-12 | 2018-7-3
 * @version 2.0 ES6対応
 */

class AjaxLoginWithCake{
	
	/**
	 * コンストラクタ
	 * 
	 * @param param 省略可
	 * - btn_type ボタンタイプ  0:プレーンスタイル , 1:Bootstrapスタイル
	 * - login_check_url ログイン確認URL
	 * - login_url ログインURL
	 * - logout_url ログアウトURL
	 * - callback ログイン認証後によびだすコールバック関数
	 * - form_slt ボタン表示区分へのセレクタ  デフォルト→"#ajax_login_with_cake
	 */
	constructor(param){
		
		this.param = this._setParamIfEmpty(param);
	}
	
	/**
	 * If Param property is empty, set a value.
	 */
	_setParamIfEmpty(param){
		
		if(param == null) param = {};

		// ボタンタイプ  0:プレーンスタイル , 1:Bootstrapスタイル
		if(param['btn_type'] == null) param['btn_type'] = 1;
		
		if(param['login_check_url'] == null) param['login_check_url'] = "ajax_login_with_cake/login_check";
		
		if(param['login_url'] == null) param['login_url'] = "ajax_login_with_cake/login_rap";
		
		if(param['logout_url'] == null) param['logout_url'] = "users/logout";

		if(this._isEmpty(param['callback'])) param['callback'] = null;
		
		if(this._isEmpty(param['form_slt'])) param['form_slt'] = "#ajax_login_with_cake";
		
		return param;
	}
	
	/**
	 * パラメータのマージ
	 */
	_margeParam(param){
		this.param = Object.assign({}, this.param, param);
		return this.param
	}
	
	
	/**
	 * 認証フォーム付
	 * @param param constructorのparamと同じ
	 */
	loginCheckEx(param){

		var rGet = this._getUrlQuery();// GETパラメータを取得
		
		// aパラメータがONの場合に認証機能を有効にする。
		if(this._isSet(rGet['a'])){
			this.loginCheck(param);
		}

	}
	
	/**
	 * 認証チェック
	 */
	loginCheck(param){
		
		param = this._margeParam(param);

		var data={'dummy':1};
		var json_str = JSON.stringify(data);//データをJSON文字列にする。

		// AJAX
		$.ajax({
			type: "POST",
			url: param.login_check_url,
			data: "key1="+json_str,
			cache: false,
			dataType: "text",
		})
		.done((str_json, type) => {

			try{
				var res = jQuery.parseJSON(str_json);//パース
			}catch(e){
				alert('エラー' + str_json);
				throw new Error(str_json);
			}
			
			//formShowCb(res);//フォームにログインボタンやメッセージを表示する
			this._showBtns(res);

			// クライアントから指定されたコールバック関数を実行する
			if(param.callback != null){
				callBack(res.auth_flg);
			}
		})
		.fail((jqXHR, statusText, errorThrown) => {
			jQuery('#err').html(jqXHR.responseText);
			alert(statusText);
		});
		
	}
	
	
	/**
	 * ボタン表示区分にログインボタンやメッセージを表示する
	 */
	_showBtns(res){

		var form_slt = this.param.form_slt;
		var formElm = jQuery(form_slt);

		if(res.auth_flg == 1 ){
			var logout_btn_html = this._getLogoutBtnHtml(); // ログアウトボタンのＨＴＭＬを取得
			formElm.html(logout_btn_html);
		}
		
		else{
			var login_btn_html = this._getLoginBtnHtml(); // ログインボタンのＨＴＭＬを取得
			formElm.html(login_btn_html);
		}
		
	}
	
	/**
	 * ログアウトボタンのＨＴＭＬを取得
	 * @reutrn string ログアウトボタンのＨＴＭＬ
	 */
	_getLogoutBtnHtml(){
		
		var logout_url = this.param.logout_url;

		var btn_html = "";
		if(this.param.btn_type == 1){
			btn_html = "<span class='text-success'>認証中です </span><a href='" + logout_url + "' id='logout_btn' class='btn btn-default btn-xs'>ログアウト</a>";
		}else{
			btn_html = "<a href='" + logout_url + "' id='logout_btn'>ログアウト</a>";
		}
		return btn_html

	}
	
	/**
	 * ログインボタンのＨＴＭＬを取得
	 * @reutrn string ログインボタンのＨＴＭＬ
	 */
	_getLoginBtnHtml(){

		var login_url = this.param.login_url;

		var btn_html = "";
		if(this.param.btn_type == 1){
			btn_html = "<a id='login_btn' href='" + login_url + "' class='btn btn-primary' >ログイン</a>";
		}else{
			btn_html = "<a id='login_btn' href='" + login_url + "' >ログイン</a>";
		}
		return btn_html

	}
	
	/**
	 * URLクエリデータを取得する
	 * 
	 * @return object URLクエリデータ
	 */
	_getUrlQuery(){
		query = window.location.search;
		
		if(query =='' || query==null){
			return {};
		}
		var query = query.substring(1,query.length);
		var ary = query.split('&');
		var data = {};
		for(var i=0 ; i<ary.length ; i++){
			var s = ary[i];
			var prop = s.split('=');
			
			data[prop[0]]=prop[1];
	
		}	
		return data;
	}
	
	/**
	 * 空チェック
	 */
	_isEmpty(v){
		if(v =='' || v==null || v == false){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * 値セットチェック
	 */
	_isSet(v){
		if(v =='' || v==null || v == false){
			return false;
		}else{
			return true;
		}
	}
	
	
}