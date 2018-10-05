/**
 * フォームX
 * 
 * @note
 * 汎用フォームクラス
 * 
 * @date 2017-7-18 | 2017-10-6
 * @version 1.1.7
 * 
 * @param param 
 * - form_id フォーム要素のID属性名を指定する
 * - ajax_url AJAX URL: 必須
 * - def_form_width デフォルトフォーム横サイズ: 後でフォーム内容に合わせて横サイズは変化する。ここの値はあくまで初期値である。
 * - def_form_height デフォルトフォーム縦サイズ
 * - title フォームのタイトル
 * - contents フォームのコンテンツ
 * - panel_body_slt フォームボディ要素のセレクタ
 * - base_width 基本横幅(デフォ640px)
 * - err_slt エラーセレクタ: エラーの出力先
 * - ok_btn_slt OKボタンセレクタ
 * - auto_close_flg	自動閉フラグ	0:自動で閉じない（デフォルト）  1:フォームの外側をクリックすると自動的に閉じる
 * - scroll_position_fixed スクロール位置固定: 0:固定せず(デフォルト) , 1:位置固定
 * 
 *  @param array fieldData フィールドデータ（フィールド名の配列。フィード名の順番は列並びと一致していること）
 */
var FormX =function(param,fieldData){
	

	this.param = param;
	
	this.fieldData = fieldData; // フィールドデータ
	
	this.defEnt; // デフォルトエンティティ

	this.form; // フォーム要素（パネルの親要素）
	
	this.panel; // パネル要素（フォームボディのラッパー）
	
	this.formBody; // フォームボディ（プロパティの定義部分）
	
	this.show_flg = -1; // フォーム表示フラグ  -1:初期状態 , 0:非表示 , 1:表示中
	
	this.saveKeys = []; // ローカルストレージへ保存と読込を行うparamのキー。
	
	this.ls_key = "FormX_v1"; // ローカルストレージにparamを保存するときのキー。
	
	
	var self=this; // Instance of myself.
	
	
	/**
	 * 事前コンストラクタ
	 */
	this.constract = function(){
		
		if(typeof jQuery.ui == 'undefined'){
			
			var css_link = document.createElement('link');
			css_link.rel = 'stylesheet';
			css_link.href = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css'
			document.body.appendChild(css_link);
			css_link.onload = function() {
				console.log('load jquery.ui.css');
				
				var js_scr = document.createElement('script');
				js_scr.type = "text/javascript";
				js_scr.src = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js';
				document.body.appendChild(js_scr);
				js_scr.onload = function() {
		
					console.log('load jquery.ui.js');
					constract2();
				}
			}
			

		}else{
			
			constract2();
		}
	}

	/**
	 * initialized.
	 */
	function constract2(){

		// If Param property is empty, set a value.
		var param = _setParamIfEmpty(self.param);
		
		var form = jQuery('#' + param.form_id);
		param.contents = form.html();
		
		// フォームの基本構造
		var panel_html = 
			"<div id='%0_panel' >" +
			"	<div id='%0_head'>" +
			"		<div id='%0_head1'>%2</div>" +
			"		<div id='%0_head2'>" +
			"			<button id='%0_close' type=\"button\" class=\"btn btn-primary btn-xs\">" +
			"				<span class=\"glyphicon glyphicon-remove\"></span>" +
			"			</button>" +
			"		</div>" +
			"	</div>" +
			"	<div id='%0_body' style='padding:4px' >" +
			"		%1" +
			"	</div>" +
			"</div>" +
			"";
		
		// フォームにフォームIDとコンテンツを埋め込む
		panel_html = panel_html.replace(/%0/g,param.form_id);
		panel_html = panel_html.replace('%1',param.contents);
		panel_html = panel_html.replace('%2',param.title);
		
		form.html(panel_html);

		// フォームセレクタとフォームオブジェクトを取得
		var panel_slt = param.panel_slt;
		
	
		
		var panelElm = jQuery(panel_slt);
		
		if(!panelElm[0]){
			throw new Error('Not found panel_slt. : ' + panel_slt);
		}
		
		// 初期サイズをセット
		var panel_css = param.panel_css;
		panel_css.width = param.def_form_width;
		panel_css.height = param.def_form_height;
		
		// スクロール位置固定が位置固定である場合、CSSを書き換える。
		if(param.scroll_position_fixed == 1){
			panel_css['position'] = 'fixed';
			panel_css['z-index'] = '1031';
		}

		// フォームにCSSを適用する
		panelElm.css(panel_css);

		
		// フォームのヘッダーにCSSスタイルを適用する
		jQuery(panel_slt + '_head').css({
			'width':'100%',
			'background-color':'#4088ca',
		});
		jQuery(panel_slt + '_head1').css({
			'float':'left',
			'width':'80%',
			'color':'white',
			'display':'inline-block;',
		});
		jQuery(panel_slt + '_head2').css({
			'width':'15%',
			'margin-left':'auto',
			'text-align':'right',
			'display':'inline-block;',
		});
		
		
		
			
		// 閉じるボタンクリックボタンイベント
		jQuery(panel_slt + '_close').click(function(e){
			panelElm.hide();
		});
		
		// フォームを移動およびリサイズできるようにする
		_initMoveAndResize(panelElm,param.panel_body_slt);
		
		self.param = param;
		self.panel = panelElm;
		

		
		// メンバへセット
		self.form = form; 
		self.formBody = form.find('#' + param.form_id + '_body');
		
		// デフォルトエンティティを取得する
		self.defEnt = getEntByForm();
		

		//領域外クリックでツールチップを閉じるが、ツールチップ自体は領域内と判定させ閉じないようにする。
		form.click(function(e) {
			e.stopPropagation();
		});
		

		
	}
	
	/**
	 * フォームを表示する
	 * @param trg トリガー要素。ボタン要素など。
	 * @param option
	 *  - set_ent_flg -1:セットしない , 0:初期値をセット(デフォルト)
	 *  - left 位置X: 省略時は自動セットになる
	 *  - padding_top: 余白幅Y: 中央モードである場合に有効になる上余白
	 */
	function showForm(trg,option){
		
		self.show_flg = 1; // 表示フラグを変更
		
		if(option==undefined){
			option = {};
		}
		if(!option['set_ent_flg']){
			option['set_ent_flg'] = 0;
		}
		if(!option['padding_top']){
			option['padding_top'] = 0;
		}


		var position;
		if(trg){
			
			// トリガー要素の真下の位置を取得する
			position = _getPositionFromTrg(trg);
		}else{
			// 画面中央位置を取得する
			position = _getPositionCenter(self.form,option);
		}
		
		var top = position.top;
		var left = position.left;
		
		if(option['left'] != null){
			left = option.left;
		}
	
		
		var wnd_w = window.innerWidth;
		var b_w = self.param.base_width;
		if((wnd_w - left) < b_w){
			left = wnd_w - b_w;
		}
		
		// 位置をセットする
		self.panel.offset({'top':top,'left':left });

		// CSS側の位置も併せてセットする。上記はposition:relative(もしくはabsolute,fixed)である場合、相対位置となるため。
		self.panel.css({
				'left':left + 'px',
				'top':top + 'px'
				});
		
		if(option.set_ent_flg == 0){
			setFieldsToForm(self.formBody,self.defEnt); // 初期値をセットする
		}
		
		
		autofit(); // オートフィット
		
		// 外部クリックイベントの組み込み（初回のみ）
		_addOutClickCloseEvent();
		
	}
	this.showForm =function(trg,option){
		showForm(trg,option)
	}
	
	
	
	/**
	 * 外部クリックイベントの組み込み
	 * 
	 * @note
	 * フォームを初表示したときのみイベント組み込みは行われる
	 * 
	 * @returns
	 */
	function _addOutClickCloseEvent(){
		
		var param = self.param;
		
		// 自動閉フラグが自動で閉じない設定なら処理抜け。
		if(param.auto_close_flg==0){
			return;
		}
		
		// フォーム外クリックイベントが組み込み済みなら処理抜け。
		if(param['out_click_settled']){
			return;
		}
		
		// フォーム外をクリックしたら閉じる処理
		
		jQuery(document).click(
				function (){
					// フォーム表示ボタンが押されたときは、フォームを閉じないようにする。（このイベントはフォームボタンを押した時にも発動するため）
					if(self.show_flg == 1){
						self.show_flg=0;
					}else if(self.show_flg == 0){
						self.form.hide();
					}else if(self.show_flg == -1){
						
					}

				});
		
		param['out_click_settled'] = 1; // フォーム外クリックイベントをセット済みにする
		
		
	}
	
	
	

	/**
	 * トリガー要素の真下の位置を取得する
	 * @param trg トリガー要素
	 * @returns 位置情報
	 */
	function _getPositionFromTrg(trg){
		// jQueryオブジェクトでない場合は、jQueryオブジェクトに変換する
		if(!(trg instanceof jQuery)){
			trg = jQuery(trg);
		}
		
		//　トリガー要素の位置からフォームの位置を算出する。
		var offset = trg.offset();
		var h = trg.outerHeight();
		var w = trg.outerWidth();
		var top = offset.top + h;
		var left = offset.left;
		
		return {
			'top':top,
			'left':left,
		};
	}

	
	/**
	 * 画面中央の位置を取得する
	 * @param object form フォーム要素オブジェクト
	 * @param option
	 * - padding_top 上余白X
	 */
	function _getPositionCenter(form,option){
		
		var param = self.param;

		var w_width = window.innerWidth;	 // フォーム横幅
		var w_height = window.innerHeight;	 // ウィンドウ縦幅
		var f_width = form.outerWidth();	 // フォーム横幅
		var f_height = form.outerHeight();	 // フォーム縦幅
		var scroll_offset_y = window.pageYOffset; // 縦スクロールの位置

		// 中央用のフォーム位置Xを算出
		var left = _calcCenterLeft(w_width,f_width);
		
		// 中央用のフォーム位置Yを算出
		var top = _calcCenterTop(scroll_offset_y,w_height,f_height,option.padding_top);
		
		// スクロール位置固定である場合、スクロール位置を引く。
		if (param.scroll_position_fixed == 1){
			top = top - scroll_offset_y;
		}

		return {
			'top':top,
			'left':left,
		};
	}

	/**
	 * 中央用のフォーム位置Xを算出
	 * @param w_width ウィンドウ横幅（ブラウザ横幅）
	 * @param f_width フォーム横幅
	 * @returns フォーム位置X
	 */
	function _calcCenterLeft(w_width,f_width){
		var left = 0;
		
		//	フォーム横幅はウィンドウ横幅より大きい場合
		if(f_width > w_width){
			
			// 左端をフォームの位置にする
			left = 0;
			
		}
		
		//	フォーム横幅はウィンドウ横幅より小さい場合
		else{
			// 横位置＝(ウィンドウ横幅 - フォーム横幅) / 2
			left = (w_width - f_width) / 2;

		}
		
		return left;
	}
	
	
	/**
	 * 中央用のフォーム位置Yを算出
	 * @param scroll_offset_y 縦スクロールの位置
	 * @param w_height ウィンドウ縦幅（ブラウザ縦幅）
	 * @param f_height フォーム縦幅
	 * @param padding_top 上余白
	 * @return フォーム位置Y
	 */
	function _calcCenterTop(scroll_offset_y,w_height,f_height,padding_top){

		if(padding_top == null){
			padding_top = 0;
		}
		
		var top = 0;
		
		//	フォーム縦幅はウィンドウ縦幅より大きい場合
		if(f_height > w_height){

			// 縦位置＝パッディングトップ＋縦スクロールの位置（上部メニューの直下に固定）
			top = padding_top + scroll_offset_y;
			
		}
		
		//	フォーム縦幅はウィンドウ縦幅より小さい場合
		else{

			// ウィンドウ内部縦幅＝ウィンドウ縦幅 - パッディングトップ
			var wi_height = w_height - padding_top;
			
			// 縦位置＝(ウィンドウ内部縦幅 - フォーム縦幅) / 2
			top = (wi_height - f_height) / 2;
			
			// 縦位置 ＝ 縦位置 + パッディングトップ + 縦スクロールの位置
			top = top + padding_top + scroll_offset_y;
			
		}

		
		return top;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * 登録
	 * @param beforeCallBack Ajax送信前のコールバック（送信データを編集できる）
	 * @param afterCallBack Ajax送信後のコールバック
	 * @param option オプション
	 * - wp_action :WPアクション	WordPressでは必須
	 * - wp_nonce  :WPノンス	WordPressのトークン的なもの（なくても動くがセキュリティが下がる）
	 */
	function reg(beforeCallBack,afterCallBack,option){
		
		var param = self.param;
		
		// バリデーション
		var res = _validationCheckForm();
		if(res == false){
			return;
		}
		
		if(_empty(option)){
			option = {};
		}
		

		
		// 編集フォームからエンティティを取得する。
		var ent = getEntByForm();
		
		
		// フィールドデータからファイルアップロード要素であるフィールドリストを抽出する
		fuEnts = {}; // ...拡張予定なので今は未設定

		// ファイルアップロード関連のエンティティをFormDataに追加する
		var fd = new FormData();
		fd = _addFuEntToFd(fd,fuEnts);
		
		// Ajax送信前のコールバックを実行する
		if(beforeCallBack){
			
			var bcRes = beforeCallBack(ent,fd);
			if(bcRes['err']){
				_errShow(bcRes['err'],'edit');// エラーを表示
				return;
			}else if(bcRes['ent']){
				ent = bcRes['ent'];
				fd = bcRes['fd'];
			}else{
				ent = bcRes;
			}
		}
		
	
		var json = JSON.stringify(ent);//データをJSON文字列にする。
		fd.append( "key1", json );
		
		// WordPressの場合
		if(option['wp_action']){
			fd.append('action',option['wp_action']);
			
			if(option['wp_nonce']){
				fd.append('nonce',option['wp_nonce']);
			}
		}
		
		
		var okBtnElm = self.form.find(param.ok_btn_slt); // OKボタン要素
		okBtnElm.hide();


		jQuery.ajax({
			type: "post",
			url: param.ajax_url,
			data: fd,
			cache: false,
			dataType: "text",
			processData: false,
			contentType: false,

		}).done(function (str_json, type) {
			var ent = null;
			try{
				var ent =jQuery.parseJSON(str_json);//パース
				
			}catch(e){
				alert('JSONエラー');
				_errShow(str_json);
				return;
			}
			
			// 編集中の行にエンティティを反映する。
			if(ent){
				if(ent['err']){
					// エラーをフォームに表示する
					_errShow(ent['err']);
					
				}else{

					// 登録後にコールバック関数を実行する
					if(afterCallBack != null){

						afterCallBack(ent);
					}

					okBtnElm.show();
					closeForm();// フォームを閉じる
				}

			}
			
		}).fail(function(jqXHR, statusText, errorThrown) {
			_errShow(jqXHR.responseText);
			alert('Ajaxエラー');
		});
	}
	this.reg = function(beforeCallBack,afterCallBack,option){
		reg(beforeCallBack,afterCallBack,option);
	}
	
	
	
	
	/**
	 * フォームを閉じる
	 */
	function closeForm(){
		
		self.show_flg = 0;
		
		// フォームを隠す
		self.form.hide();
		
		
	}
	this.closeForm = function(){
		closeForm();

	};
	
	
	
	
	
	
	
	
	/**
	 * ファイルアップロード関連のエンティティをFormDataに追加する
	 * @param fd FormData（フォームデータ）
	 * @param fuEnts フィールドエンティティリスト（ファイルアップロード関連のもの）
	 * @return 追加後のfd
	 */
	function _addFuEntToFd(fd,fuEnts){
		
		for(var i in fuEnts){
			var fuEnt = fuEnts[i];
			
			var fu_key = fuEnt.field;
			var inp_key = 'inp_fu';
			var elm = fuEnt[inp_key].elm; // ファイル要素オブジェクトを取得
			
			fd.append( fu_key, elm.prop("files")[0] );
		}
		
		return fd;
	}
	
	
	
	
	
	
	
	/**
	 * エラーをフォームに表示する
	 * @param err エラー情報
	 * 
	 */
	function _showErrToForm(err){
		
		// エラー情報が配列であれば、値を改行で連結して１つのエラーメッセージにする。
		var err1 = err;
		if(Array.isArray(err1)){
			err1 = err1.join('<br>');
		}
		

		
		// フォーム要素からエラー要素を取得
		var form = self.form;
		var errElm = form.find('.err');
		
		// エラー要素にエラーメッセージを埋め込む。
		errElm.html(err1);
	}
	
	
	
	
	
	/**
	 * フォームのバリデーション
	 * @return validFlg バリデーションフラグ true:正常 false:入力エラー
	 */
	function _validationCheckForm(){
		
		var validFlg = true; // バリデーションフラグ

		var form = self.formBody;
		
		form.find('.valid').each(function(){
			var elm = jQuery(this);
			var field = _getFieldByNameOrClass(elm);

			// 入力要素単位でバリデーションを行う
			var res = _validationCheck(elm,field);
			
			if(res == false){
				validFlg = false;
			}

		});
		

		return validFlg;
	}
	
	
	
	
	/**
	 * 入力要素単位でバリデーションを行う
	 * @param elm 入力要素
	 * @param field 入力要素のフィールド名
	 * @return validFlg バリデーションフラグ true:正常 false:入力エラー
	 */
	function _validationCheck(elm,field){
		
		var validFlg = true; // バリデーションフラグ

		var label = jQuery("[for='" + field + "']");
		var title = elm.attr('title');
		
		try{
			validFlg=elm[0].checkValidity();

			if(validFlg == true){
				label.attr('class','text-success');
				label.html('');
			}else{
				label.attr('class','text-danger');
				label.html(title);
			}

		}catch( e ){
			
			throw e;
		}
		
		return validFlg;
		
	}
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	* name属性またはclass属性からフィールド名を取得する
	* 
	* @note
	* class属性が複数である場合、先頭のclass属性を取得する
	*
	* @parma elm 入力要素オブジェクト
	* @return フィールド名
	*/
	function _getFieldByNameOrClass(elm){
		
		var field = elm.attr('name');
		if(!field){
			field = elm.attr('class');
		}
		
		if(!field){
			return field;
		}
		
		field = field.trim();
		var a = field.indexOf(' ');
		if(a != -1){
			field = field.substr(0,field.length - a);
		}
	
		return field;
		
	}
	
	
	
	
	
	
	/**
	 * オートフィット
	 * 
	 * @note
	 * 内容の幅にフォームのサイズを合わせる。
	 * 
	 */
	function autofit(){
		self.panel.css({
			'width':'auto',
			'height':'auto',
			'display':'inline-block',
		});
		

		
	}
	this.autofit = function(){
		autofit();
	}
	
	
	/**
	 * フォームボディ要素を取得する
	 */
	function getFormBody(){
		return self.panel.find(self.param.panel_body_slt);
	}
	this.getFormBody = function(){
		getFormBody();
	}
	
	
	
	
	
	
	// If Param property is empty, set a value.
	function _setParamIfEmpty(param){
		
		if(param == undefined){
			param = {};
		}
	
		// ローカルストレージで保存していたパラメータをセットする
		var param_json = localStorage.getItem(self.ls_key);
		if(!_empty(param_json)){
			var lsParam = JSON.parse(param_json);
			if(lsParam){
				for(var i in self.saveKeys){
					var s_key = self.saveKeys[i];
					param[s_key] = lsParam[s_key];
				}
			}
		}
		
		
		
		if(param['form_id'] == undefined){
			param['form_id'] = 'panel_x';
		}
		
		
		if(param['ajax_url'] == undefined){
			throw new Error('Empty ajax_url!');
		}
		
		param['panel_slt'] = '#' + param['form_id'];
		
		if(param['def_form_width'] == undefined){
			param['def_form_width'] = 640;
		}
		
		if(param['def_form_width'] == undefined){
			param['def_form_width'] = 480;
		}

		if(param['title'] == undefined){
			param['title'] = 'フォームX';
		}
		
		if(param['contents'] == undefined){
			param['contents'] = '';
		}
		
		if(param['base_width'] == undefined){
			param['base_width'] = 640;
		}
		
		
		if(param['panel_css'] == undefined){
			param['panel_css'] = _getDefaultCss();
		}else{
			// デフォルトCSSへ引数のCSSをマージする
			var def_css = _getDefaultCss();
			def_css['width'] = param['base_width'];
			var panel_css = param['panel_css'];
			param['panel_css'] = jQuery.extend(def_css,panel_css);
		}
		
		if(param['panel_body_slt'] == undefined){
			param['panel_body_slt'] = param['panel_slt'] + '_body';
		}
		
		if(param['err_slt'] == undefined){
			param['err_slt'] = '#err';
		}
		
		if(param['ok_btn_slt'] == undefined){
			param['ok_btn_slt'] = '.ok_btn';
		}
		
		if(param['auto_close_flg'] == undefined){
			param['auto_close_flg'] = 0;
		}
		
		if(param['scroll_position_fixed'] == undefined){
			param['scroll_position_fixed'] = 0;
		}
		

		
		
		
		
		
		
		
		
		
		return param;
	}
	
	/**
	 * デフォルトのフォームCSS情報を取得する
	 * @returns フォームCSS情報
	 */
	function _getDefaultCss(){
		
		var def_css = {
				'position':'absolute',
				'border':'solid 4px #4088ca',
				'border-radius':'10px',
				'z-index':'1',
				'display':'none',
			};
		return def_css;
	}
	
	
	
	/**
	 * フォームの親要素を取得し、フォームのHTMLコードを追加
	 * @param par_slt フォーム親要素セレクタ
	 * @returns フォームの親要素
	 */
	function _getParentElm(par_slt){
		var parElm = null;
		
		// フォーム親要素セレクタが空であるなら、containerかbodyを親要素として取得
		if(_empty(par_slt)){
			parElm = _getParentElmFromContainer();
		}
		

		// フォーム親要素セレクタが空でないならフォーム親要素を取得する。
		else{
			parElm = jQuery(par_slt);
			
			// 取得できなかったらcontainerかbodyを親要素として取得する。
			if(!parElm[0]){
				parElm = _getParentElmFromContainer();
			}
		}

		
		return parElm;
	}
	
	/**
	 * containerかbodyを親要素として取得する
	 * @returns フォームの親要素
	 */
	function _getParentElmFromContainer(){
		var parElm = jQuery('.container').eq(0);
		if(!parElm[0]){
			var parElm = jQuery('body');
		}
		return parElm;
	}
	
	
	
	/**
	 * フォームを移動およびリサイズできるようにする
	 * @param panel フォーム要素
	 * @param body_slt フォームボディ要素セレクタ
	 */
	function _initMoveAndResize(panel,body_slt){
		
		
		//～読込イベント処理～
		//ドラッグ移動を組み込み、チャット画面を動かせるようにする。
		var draggableDiv = panel.draggable();
		
		//ドラッグ移動を組み込むとテキスト選択ができなくなるので、フォームボディ部分をテキスト選択可能にする。
		var bodyElm = panel.find(body_slt);
		jQuery(bodyElm,draggableDiv).mousedown(function(ev) {
				draggableDiv.draggable('disable');
			}).mouseup(function(ev) {
				draggableDiv.draggable('enable');
			});
		
		panel.resizable({
			maxHeight:700,
			maxWidth:700,
			minHeight:40,
			minWidth:100,
			stop: function( event, ui ) {
				//リサイズ操作から手を放した瞬間のイベント
				// -- 後日実装予定 --

			}
		});
	}

	
	
	
	
	
	
	
	

	/**
	 * フォームからエンティティを取得する
	 * 
	 * @return エンティティ
	 */
	function getEntByForm(){
		
		var formBody = self.formBody;

		// フォームからエンティティを取得
		var ent = {};
		for(var i in self.fieldData){
			
			// フィールドデータからフィールド名を取得する
			var f = self.fieldData[i].field;

			// name属性またはclass属性を指定して入力要素を取得する。
			var inps = _formFind(formBody,f);
			
			// 該当する入力要素の件数を取得する
			var cnt=inps.length;
			
			var v = null;// 取得値
			
			// 0件である場合、該当する入力要素は存在しないため、何もせず次へ。
			if(cnt==0){
				continue;
			}
			
			
			// 入力要素が1件である場合、その要素から値を取得する。
			else if(cnt==1){
				v = _getEntByForm2(inps,formBody,f);
			}
			
			// 入力要素が2件以上である場合、最初の1件のみ取得
			else{


				inps.each(function(){
					var inp = jQuery(this);
					v = _getEntByForm2(inp,formBody,f);
					return;

				});
				
			}
			
			ent[f] = v;

		}


		return ent;

	}
	// for ES5
	this.getEntByForm = function(){
		return getEntByForm();
	}
	
	
	/**
	 * 様々な入力要素から値を取得する
	 * @param inp 入力要素<jquery object>
	 * @param form フォーム要素<jquery object>
	 * @param f フィールド名
	 * @return 入力要素の値
	 */
	function _getEntByForm2(inp,form,f){
		
		var tagName = inp.get(0).tagName; // 入力要素のタグ名を取得する


		// 値を取得する
		var v = null;
		if(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA'){
			
			// type属性を取得する
			var typ = inp.attr('type');
			
			
			if(typ=='file'){

				// アップロードファイル系である場合、ひもづいているlabel要素から値を取得する。
				v = _getValFromLabel(form,f);

			}
			
			else if(typ=='checkbox'){
				v = 0;
				if(inp.prop('checked')){
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
				v = inp.val();

			}
		}
		
		// IMGタグへのセット
		else if(tagName == 'IMG'){
			
			//IMG系である場合、ひもづいているlabel要素から値を取得する。
			v = _getValFromLabel(form,f);

		}
		
		else{
			v = inp.html();
		}
		
		return v;
	}
	
	
	/**
	 * name属性またはclass属性でフォーム内を探し、入力要素を取得する
	 * @param form	フォーム要素オブジェクト
	 * @param string フィールド名（name属性またはclass属性でもある）
	 * @return jquery_object 入力要素
	 */
	function _formFind(form,feild){
		
		
		var inp = form.find("[name='" + feild + "']");
		if(inp[0]==undefined){
			inp = form.find('.' + feild);
		}
		
		
		return inp;
	}
	
	
	
	
	
	
	
	
	
	

	/**
	 * ローカルストレージにパラメータを保存する
	 */
	function saveParam(){
		var lsParam = {};
		for(var i in self.saveKeys){
			var s_key = self.saveKeys[i];
			lsParam[s_key] = self.param[s_key];
		}
		var param_json = JSON.stringify(lsParam);
		localStorage.setItem(self.ls_key,param_json);
	}
	this.saveParam = function(){
		saveParam();
	}
	
	
	
	/**
	 * ローカルストレージで保存しているパラメータをクリアする
	 */
	function clear(){
		localStorage.removeItem(self.ls_key);
	}
	this.clear = function(){
		clear();
	}
	
	
	/**
	 * Get value by the field.
	 * 
	 * @note
	 * Find the element that matches the field from the parent element and get its value.
	 * The field is class attribute or name attribute.
	 * 
	 * @param parElm : parent element.
	 * @param field 
	 * @returns
	 */
	function _getValueByField(parElm,field){
		var v = undefined;
		var elm = _findInParentEx(parElm,field);
		if(elm[0]){
			v = _getValueEx(elm);
		}
		return v;
	}
	
	
	/**
	 * Get value from elements regardless of tag type.
	 * @param elm : Value element.
	 * @returns Value from value element.
	 */
	function _getValueEx(elm){
		
		var v = undefined;
		var tagName = elm.prop("tagName"); 
		
		if(tagName == 'INPUT' || tagName == 'SELECT' || tagName=='TEXTAREA'){
			
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
	 * Search for matched elements from the parent element regardless of class attribute, name attribute, id attribute.
	 * @param parElm : parent element.
	 * @param field : class, or name attribute
	 * @returns element.
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
	
	
	
	
	
	
	/**
	 * フォームにエンティティをセットする
	 * @param object form フォーム(省略可）
	 * @param object ent エンティティ
	 */
	function setFieldsToForm(form,ent){
		
		if(!form){
			form = self.formBody;
		}
		

		for(var f in ent){
			
			// class属性またはname属性を指定して入力要素を取得する。
			var inp = form.find('.' + f);
			if(inp[0]==undefined){
				inp = form.find("[name='" + f + "']");
			}

			// 入力要素が取得できなければcontinueする。
			if(inp[0]==undefined){
				continue;
			}
			
			var v = ent[f];
			
			var tagName = inp.get(0).tagName; // 入力要素のタグ名を取得する
			
			// 値を入力フォームにセットする。
			if(tagName == 'INPUT' || tagName == 'SELECT'){
				
				// type属性を取得
				var typ = inp.attr('type');
				
				if(typ=='file'){
					
					// 未対応

				}
				
				else if(typ=='checkbox'){
					if(v ==0 || v==null || v==''){
						inp.prop("checked",false);
					}else{
						inp.prop("checked",true);
					}
					
				}
				
				else if(typ=='radio'){
					var opElm = form.find("[name='" + f + "'][value='" + v + "']");
					if(opElm[0]){
						opElm.prop("checked",true);
					}

				}
				
				else{
					v = _xssSanitaizeDecode(v);// XSSサニタイズを解除
					inp.val(v);
				}

				
			}
			
			// テキストエリア用のセット
			else if(tagName == 'TEXTAREA'){

				if(v!="" && v!=undefined){
					v=v.replace(/<br>/g,"\r");
					v = _xssSanitaizeDecode(v);
				}

				inp.val(v);
				
			}
			
			// IMGタグへのセット
			else if(tagName == 'IMG'){
				// 未対応
			}
			
			// audioタグへのセット
			else if(tagName == 'AUDIO'){
				
				// 未対応
				
				
			}else{
				v=v.replace(/<br>/g,"\r");
				v = _xssSanitaizeEncode(v); // XSSサニタイズを施す
				v = _nl2brEx(v);// 改行コートをBRタグに変換する
				
				inp.html(v);
			}
			
		
		}

	}
	// ES5版
	this.setFieldsToForm = function(form,ent){
		setFieldsToForm(form,ent);
	}
	
	
	/**
	 * エラーメッセージを表示する
	 * @param err_msg エラーメッセージ
	 */
	function _errShow(err_msg){
		
		var errElm = jQuery(self.param.err_slt);
		if(errElm[0]){
			errElm.html(err_msg);//詳細エラーの出力
		}
	}
	
	
	/**
	 * ラベル要素へセット
	 * @param object form フォーム要素オブジェクト
	 * @param string field フィールド名
	 * @param v ラベルにセットする値
	 */
	function _setLabel(form,field,v){
		var label = form.find("[for='" + field + "']");
		if(label){
			label.html(v);
		}
	}
	
	
	function _nl2brEx(v){
		if(v == null || v == '' || v=='0'){
			return v;
		}
		
		if (typeof v != 'string'){
			return v;
		}

		v = v.replace(/\r\n|\n\r|\r|\n/g,'<br>');
		return v;
	}
	
	
	
	
	
	
	
	
	
	

 
	

	
	//XSSサニタイズエンコード
	function _xssSanitaizeEncode(str){
		if(typeof str == 'string'){
			return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}else{
			return str;
		}
	}
	
	//XSSサニタイズデコード
	function _xssSanitaizeDecode(str){
		if(typeof str == 'string'){
			return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
		}else{
			return str;
		}
	}
	
	
	// 改行をBRタグに変換
	function _nl2br(str) {
		if(typeof str == 'string'){
			return str.replace(/[\n\r]/g, "<br>");
		}else{
			return str;
		}
	}
	
	
	
	
	
	// Check empty.
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
	
	

	// call constractor method.
	this.constract();
}