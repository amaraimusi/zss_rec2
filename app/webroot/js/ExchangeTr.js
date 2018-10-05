/**
 * 
 * 行入替機能
 * 
 * @note
 * テーブルの行を入れ替えることによる並べ替え
 * 
 * @version 1.1
 * @date 2017-3-7 | 2017-5-10
 * 
 * @param param
 * - tbl_slt テーブル要素へのセレクタ
 * @param afterCallback 入替後に実行するコールバック関数
 */
var ExchangeTr =function(param,afterCallback){

	this.param = param;
	
	this.form; // 入替フォーム
	
	this.tbl; // 対象テーブル
	
	this.afterCallback = afterCallback; // 入替後コールバック
	
	var self=this; // Instance of myself.

	/**
	 * initialized.
	 */
	this.constract=function(){
		
		// If Param property is empty, set a value.
		this.param = _setParamIfEmpty(this.param);

		this.tbl = jQuery(this.param.tbl_slt);
		
		// テーブルセレクタからフォームセレクタを作成する
		var tbl_code = _sltToCode(this.param.tbl_slt);// セレクタから識別子「#」「.」を取り外したコードを取得する
		var form_slt = "#exchange_tr_form_" + tbl_code;
		this.param['form_slt'] = form_slt;
		
		
		// 行入替フォームのHTML文字列を取得する
		var formHtml = _getFormHtml(form_slt);
		
		// テーブル要素の下に行入替フォームを追加、およびオブジェクトを取得
		this.tbl.after(formHtml);
		this.form = jQuery(form_slt);
		
		
		// 閉じるボタンのクリックイベント
		this.form.find('.exchange_tr_form_close').click(function(){
			self.form.hide();
		});
		
		// 行入替ボタンのクリックイベント
		this.form.find('.exchange_tr_btn').click(function(){
			_exchageTrReb(); // 行入替
		});
		
		
		// 行入替フォームのinput系要素にEnterキーによるイベントを組み込む
		jQuery(form_slt + ' input').keypress(function(e){
			if(e.which==13){ // Enterキーである場合
				_exchageTrReb(); // 行入替ボタンによる行入替処理
			}
		});
		
		// 上シフトボタンのクリックイベント
		this.form.find('.exchange_tr_shift_up').click(function(){
			_exchageTrShiftUp(); // 上シフトボタンによる行入替処理
		});
		
		// 下シフトボタンのクリックイベント
		this.form.find('.exchange_tr_shift_down').click(function(){
			_exchageTrShiftDown(); // 下シフトボタンによる行入替処理
		});
		
		
	}
	
	// If Param property is empty, set a value.
	function _setParamIfEmpty(param){
		
		if(param == undefined){
			param = {};
		}
		
		if(param['tbl_slt'] == undefined){
			throw new Error("'tbl_slt' is empty !");
		}
		

		
		return param;
	}
	
	
	
	/**
	 * 行入替フォームを表示する
	 * @param btn 行内の入替ボタン要素
	 */
	this.showForm = function(btn){
		
		// 移動元インデックスを取得し、パラメータにセットする
		var btnElm = jQuery(btn);
		var trElm = btnElm.parents('tr');
		var from_row_index = trElm.index();
		from_row_index = from_row_index + 1;// 1からの数えにする。
		self.param['from_row_index'] = from_row_index;
		
		// 移動先テキストボックスが空であるなら、上記で取得した移動元インデックスを初期セットする。
		var sortNoElm = self.form.find('.exchange_tr_sort_no');
		var idx = sortNoElm.val();
		if(_empty(idx)){
			sortNoElm.val(from_row_index);
		}

		// 行内入替ボタンの下に行入替フォームを表示する
		_showForm(self.form,btnElm);
	}
	
	
	
	
	/**
	 * 行入替ボタンによる行入替処理
	 */
	function _exchageTrReb(){
		
		// 移動元行インデックスを取得する
		var from_row_index = self.param['from_row_index'];
		
		// 移動先行インデックスを取得する
		var to_row_index = self.form.find('.exchange_tr_sort_no').val();

		// 行インデックスをチェックし、不正があれば、処理中断
		if(_checkRowIndex(to_row_index)==false){
			return;
		}
		
		// 移動元と移動先が同じなら処理中断
		if(from_row_index == to_row_index){
			return;
		}

		// 行入替
		_exchageTr(from_row_index,to_row_index);
		
	}
	
	/**
	 * 上シフトボタンによる行入替処理
	 */
	function _exchageTrShiftUp(){
		// 移動元行インデックスを取得する
		var from_row_index = self.param['from_row_index'];
		
		// 移動先行インデックスを取得する
		var to_row_index = from_row_index - 1;
		
		// 移動先行番が0以下なら上シフト処理を中断する
		if(to_row_index <= 0){
			return;
		}
		
		// 行入替
		_exchageTr(from_row_index,to_row_index);
		
		// 連続して上シフトボタンを押した時のために、移動先を移動元として保存しておく
		self.param['from_row_index'] = to_row_index;
	}
	
	/**
	 * 下シフトボタンによる行入替処理
	 */
	function _exchageTrShiftDown(){
		// 移動元行インデックスを取得する
		var from_row_index = self.param['from_row_index'];
		
		// 移動先行インデックスを取得する
		var to_row_index = from_row_index + 1;
		
		// テーブルの行数を取得する
		var tBody = self.tbl.children('tbody');
		var rowCnt = tBody.children('tr').length;// テーブル行数
		
		// 移動先行番が行数を超えるなら下シフト処理を中断する
		if(to_row_index > rowCnt){
			return;
		}
		
		// 行入替
		_exchageTr(from_row_index,to_row_index);
		
		// 連続して上シフトボタンを押した時のために、移動先を移動元として保存しておく
		self.param['from_row_index'] = to_row_index;
	}
	
	/**
	 * ★ 行入替
	 * @param from_row_index 移動元行インデックス
	 * @param to_row_index 移動先行インデックス
	 */
	function _exchageTr(from_row_index,to_row_index){
		// 移動元と移動先のTR要素を取得する
		var tr1 = self.tbl.find('tr').eq(from_row_index);
		var tr2 = self.tbl.find('tr').eq(to_row_index);
		
		// 移動元と移動先のTR要素を入れ替える
		if(from_row_index > to_row_index){
			jQuery(tr2).before(tr1);
			
		}else{
			jQuery(tr2).after(tr1);
			
		}
		
		// コールバックが設定されていれば、コールバックを実行する
		if(self.afterCallback){
			self.afterCallback({
				'from_row_index':from_row_index,
				'to_row_index':to_row_index
			});
		}
	}
	
	
	
	
	/**
	 * 行インデックスをチェックする
	 * @param row_index 行インデックス
	 * @returns {Boolean} true:はい  false:いいえ
	 */
	function _checkRowIndex(row_index) {
		
		if(row_index == undefined){
			return false;
		}
		

		if(!row_index.match(/^[0-9]*$/)){
			return false;
		}
		
		if(row_index <= 0){
			return false;
		}
	
		return true;
	
	}
	
	
	
	
	
	
	
	
	/**
	 * 行入替フォームを表示する
	 * 
	 * @param object form フォーム要素オブジェクト
	 * @param string triggerElm トリガー要素  ボタンなど
	 */
	function _showForm(form,triggerElm,form_position){
		
		if(!form_position){
			form_position = 'auto';
		}
		
		form.show();
		
		//トリガー要素の右上位置を取得
		triggerElm = jQuery(triggerElm);
		var offset=triggerElm.offset();
		var left = offset.left;
		var top = offset.top;
		
		var ww = jQuery(window).width();// Windowの横幅（ブラウザの横幅）
		var form_width = form.outerWidth();// フォームの横幅
		
		// フォーム位置Yをセット
		var trigger_height = triggerElm.outerHeight();
		var tt_top=top + trigger_height;
		
		var tt_left=0;// フォーム位置X
		
		// フォーム位置の種類毎にフォーム位置Xを算出する。
		switch (form_position) {
		
		case 'left':
			
			// トリガーの左側にフォームを表示する。
			tt_left=left - form_width;
			break;
			
		case 'center':

			// フォームを中央にする。
			tt_left=(ww / 2) - (form_width / 2);
			break;
			
		case 'right':
			
			// トリガーの右側にフォームを表示する
			tt_left=left;
			break;
			

		default:// auto

			// 基本的にトリガーの右側にフォームを表示する。
			// ただし、トリガーが右端付近にある場合、フォームは外側にでないよう左側へ寄せる。
			
			tt_left=left;
			if(tt_left + form_width > ww){
				tt_left = ww - form_width;
			}
			
			break;
		}

		if(tt_left < 0){
			tt_left = 0;
		}

		//フォーム要素に位置をセット
		form.offset({'top':tt_top,'left':tt_left });
	}
	
	
	/**
	 * 行入替フォームのHTML文字列を取得する
	 * @param form_slt フォーム要素のセレクタ
	 * @returns 行入替フォームのHTML
	 */
	function _getFormHtml(form_slt){
		
		var xid = _sltToCode(form_slt);// セレクタから識別子「#」「.」を取り外したコードを取得する
		
		var html = 
			"<div id='" + xid +"_rap'>" +
			"	<div id='" + xid +"' class='panel panel-primary' style='display:none;width:170px;'>" +
			"		<div class='panel-heading'>" +
			"			" +
			"			<div style='display:inline-block;width:80%'>行入替</div>" +
			"			<div style='display:inline-block;width:15%'>" +
			"				<button type='button' class='exchange_tr_form_close btn btn-primary btn-sm'>" +
			"					<span class='glyphicon glyphicon-remove'></span>" +
			"				</button>" +
			"			</div>" +
			"		</div>" +
			"		<div class='panel-body' \">" +
			"			<button type='button' class='exchange_tr_shift_up btn btn-primary btn-sm'><span class='glyphicon glyphicon-arrow-up'></span></button>" +
			"			<button type='button' class='exchange_tr_shift_down btn btn-primary btn-sm'><span class='glyphicon glyphicon-arrow-down'></span></button>" +
			"			<div style='margin-top:20px'>" +
			"				<input class='exchange_tr_sort_no' type='number' style='width:60px' min='1' max='9999'  />" +
			"				<input type='button' value='行入替' class='exchange_tr_btn btn btn-warning btn-sm' />" +
			"			</div>" +
			"		</div>" +
			"	</div>" +
			"</div>";
		
		return html;
	}
	
	
	/**
	 * セレクタから識別子「#」「.」を取り外したコードを取得する
	 * 
	 * @note
	 * セレクタに空文字を指定すると空を返す。ただしnullを指定した場合はエラーになる。
	 * 
	 * @param slt セレクタ
	 * @returns コード
	 */
	function _sltToCode(slt){
		
		var code = slt;
		var s1 = code.charAt(0); // 先頭の一文字を取得
		if(s1=='#' || s1=='.'){
			code = code.substr(1);
		}
		return code;
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
	
	

	
	

	// call constractor method.
	this.constract();
}