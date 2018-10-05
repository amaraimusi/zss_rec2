/**
 * AjaxCRUD.js
 * 
 * @note
 * AjaxによるCRUD。
 * デフォルトでは、削除、編集、新規追加するたびにAjax通信を行う仕様である。
 * 削除、編集、新規追加するたびに更新するのが重い場合、適用ボタンで一括適用するモードも備える。
 * 
 * ver 1.7からWordPressに対応
 * 
 * 課題
 * td内部へのSetやGetは、先頭要素とtd直下にしか対応していない。
 * 複雑なtd内部にも対応するとなるとコールバックを検討しなければならない。
 * 
 * @date 2016-9-21 | 2017-11-15
 * @version 1.9.8 
 * 
 * @param object param
 *  - tbl_slt	CRUD対象テーブルセレクタ
 *  - edit_form_slt	編集フォームセレクタ
 *  - new_form_slt	新規フォームセレクタ
 *  - delete_form_slt	削除フォームセレクタ
 *  - contents_slt	コンテンツセレクタ	コンテンツ全体を表すセレクタでフォームの位置調整で利用する。省略時すると画面windowを基準に位置調整する。
 *  - edit_reg_url	編集登録サーバーURL
 *  - new_reg_url	新規登録サーバーURL
 *  - delete_reg_url	削除登録サーバーURL *  - form_position	フォーム位置 auto:自動, left:左側表示, center:中央表示, right:右側表示,max:横幅いっぱい
 *  - form_width	フォーム横幅	数値で指定。未指定（null)である場合、autoと同様になる。ただしform_positionがmaxなら横幅最大になる。
 *  - form_height	フォーム縦幅	上記と同じ
 *  - file_uploads	ファイルアップロードデータ
 *  - upload_file_dir	アップロードファイルディレクトリ
 *  - preview_img_width		プレビュー画像・横幅
 *  - preview_img_height	プレビュー画像・縦幅
 *  - callback_after_file_change(e,field,formType,fileName)	ファイルチェンジ後のコールバック
 *  - form_z_index	重なり順序(cssのz-indexと同じ)
 *  - valid_msg_slt	バリデーションメッセージセレクタ
 *  - auto_close_flg	自動閉フラグ	0:自動で閉じない  1:フォームの外側をクリックすると自動的に閉じる（デフォルト）
 *  @param array fieldData フィールドデータ（フィールド名の配列。フィード名の順番は列並びと一致していること）
 */
var AjaxCRUD =function(param,fieldData){

	this.param = param;
	this.fieldData = fieldData; // フィールドデータ
	this.fieldHashTable = []; // フィールドハッシュテーブル key:フィールド名  val:列インデックス
	this.formInfo; 		// フォーム情報
	this.editRowIndex; 	// 編集行のインデックス
	this.deleteRowIndex; // 削除行のインデックス
	this.defNiEnt; 		// デフォルト新規入力エンティティ
	this.formNewInp;	// 新規入力フォーム
	this.formEdit;		// 編集フォーム
	this.formDelete;	// 削除フォーム

	this.showFormStrategy; // 入力フォーム表示ストラテジー

	// 自分自身のインスタンス。  プライベートメソッドやコールバック関数で利用するときに使う。
	var self=this;

	/**
	 * コンストラクタ
	 */
	this.constract=function(){

		// パラメータに空プロパティがあれば、デフォルト値をセットする
		this.param = _setParamIfEmpty(this.param);

		// フォーム情報の取得と初期化
		this.formInfo = _initFormInfo(this.param);

		// フィールドデータにプロパティを追加する
		this.fieldData = _addMoreFieldData(this.param.tbl_slt,this.fieldData);

		// フィールドデータへフォーム内の要素情報をセットする
		this.fieldData = _setFieldDataFromForm(this.fieldData,this.formInfo,'new_inp');
		this.fieldData = _setFieldDataFromForm(this.fieldData,this.formInfo,'edit');
		this.fieldData = _setFieldDataFromForm(this.fieldData,this.formInfo,'del');

		// フィールドデータにファイル要素の情報をセット、およびファイルチェンジイベントを登録する。
		this.fieldData = _initFileUpData(this.fieldData);

		// フィールドハッシュテーブルをフィールドデータから生成する。
		this.fieldHashTable = _createFieldHashTable(this.fieldData);

		// デフォルト新規入力エンティティを新規入力フォームから取得する
		this.defNiEnt = _getEntByForm('new_inp');

	};

	function _fileChangeEventNewInp(e){
		var elm = jQuery(this);
		var field = _getFieldByNameOrClass(elm);

		// ファイルアップロードのチェンジイベント
		_fileChangeEvent(e,field,'new_inp');
	};


	function _fileChangeEventEdit(e){
		var elm = jQuery(this);
		var field = _getFieldByNameOrClass(elm);

		// ファイルアップロードのチェンジイベント
		_fileChangeEvent(e,field,'edit');
	};


	function _fileChangeEventDel(e){
		var elm = jQuery(this);
		var field = _getFieldByNameOrClass(elm);

		// ファイルアップロードのチェンジイベント
		_fileChangeEvent(e,field,'del');
	};


	/**
	 * ファイルアップロードのチェンジイベント
	 * @param e イベント
	 * @param field フィールド
	 * @param formType フォーム種別
	 */
	function _fileChangeEvent(e,field,formType){

		// エンティティおよび入力要素エンティティを取得する
		var ent = _getFieldEntByField(field);
		var inpKey = 'inp_' + formType;
		var inp_ent = ent[inpKey];

		// イベントハンドラをファイルアップロードデータにセットする。（登録系の処理で用いる）
		inp_ent.evt = e;

		// --- ▽▽▽ サムネイルを表示する処理

		// Get a file object from event.
		var files = e.target.files;
		var oFile = files[0];

		if(oFile==null){
			return;
		}


		// Converting from a file object to a data url scheme.Conversion process by the asynchronous.
		var reader = new FileReader();
		reader.readAsDataURL(oFile);

		// After conversion of the event.
		reader.onload = function(evt) {

			// accept属性を取得する
			var accept = inp_ent.accept;

			// accept属性が空もしくは画像系であるかチェックする
			if (accept == '' || accept.indexOf('image') >= 0){

				// フォーム種別からフォーム要素を取得する
				var form = getForm(formType);

				//画像プレビュー要素を取得。（なければ作成）
				imgElm = _getPreviewImgElm(form,field,inp_ent);

				// A thumbnail image preview.
				imgElm.attr('src',reader.result);

			} 

		}

		// ファイルチェンジ後のコールバックを実行する
		if(self.param.callback_after_file_change){
			var fileName = oFile.name;
			self.param.callback_after_file_change(e,field,formType,fileName);
		}

	}

	/**
	 * 画像プレビュー要素を取得。（なければ作成）
	 * @param form フォーム要素のオブジェクト
	 * @param field ﾌｨｰﾙﾄﾞ名
	 * @param inp_ent 入力要素の情報
	 * @return 画像プレビュー要素
	 */
	function _getPreviewImgElm(form,field,inp_ent){

		// 画像プレビュー要素を取得する
		var imgElm = form.find("[data-file-preview='" + field + "']");
		if(!imgElm[0]){
			imgElm = _old__getPreviewImgElm(inp_ent);// 旧：画像プレビュー要素を取得。（なければ作成）
		}

		return imgElm;
	}

	/**
	 * 旧：画像プレビュー要素を取得。（なければ作成）
	 * @param inp_ent 入力要素の情報
	 * @return 画像プレビュー要素
	 */
	function _old__getPreviewImgElm(inp_ent){

		var fileElm = inp_ent.elm;

		var preview_slt = inp_ent.preview_slt;

		var imgElm = jQuery('#' + preview_slt);
		if(!imgElm[0]){
			var preview_img_html = "<div class='upload_img_iuapj'><img id='" + preview_slt +"'/></div>";
			fileElm.after(preview_img_html);
			imgElm=jQuery('#' + preview_slt);

			imgElm.attr({
				'width':self.param.preview_img_width,
				'height':self.param.preview_img_height,

			});

		}else{
			imgElm.show();
		}
		return imgElm;
	}


	// オーディオプレビュー要素を取得。（なければ作成）
	function _getPreviewAdoElm(inp_ent,fp){

		var fileElm = inp_ent.elm;

		var preview_slt = inp_ent.preview_slt;

		var adoElm = jQuery('#' + preview_slt);
		if(!adoElm[0]){

			var preview_ado_html = "<div class='upload_ado_iuapj'><audio id='" + preview_slt +"' src=" + fp + " controls>" +
					"<p>音声を再生するには、audioタグをサポートしたブラウザが必要です。</p></audio></div>";
			fileElm.after(preview_ado_html);

		}else{
			adoElm.show();
		}
		return adoElm;
	}


	/**
	 * 編集フォームを表示
	 * 
	 * @param elm 編集ボタン要素
	 * @param option オプション（省略可）
	 *           -  upload_file_dirアップロードファイルディレクトリ
	 * @param callBack フォームに一覧の行データを自動セットしたあとに呼び出されるコールバック関数(省略可）
	 */
	function editShow(elm,option,callBack){

		var tr=jQuery(elm).parents('tr'); // 先祖をさかのぼりtr要素を取得する
		self.editRowIndex = tr.index(); // 行番（インデックス）を取得する

		var info = self.formInfo['edit'];

		info.show_flg=1; // 表示制御フラグを表示中にする

		// TR要素からエンティティを取得する
		var ent = self.getEntityByTr(tr);

		var form = jQuery(info.slt);// 編集フォーム要素を取得

		// オプションからアップロードファイルディレクトリを取得する
		var upload_file_dir = undefined;
		if(option){
			upload_file_dir = option['upload_file_dir'];
		}

		// フォームに親要素内の各フィールド値をセットする。
		_setFieldsToForm('edit',form,ent,upload_file_dir);

		// バリデーションエラーメッセージをクリアする
		_clearValidErr(form);

		// コールバックを実行する
		if(callBack){
			callBack(tr,form,ent);
		}

		// triggerElm要素の下付近に入力フォームを表示する。
		_showForm(form,elm,option);
	}

	/**
	 * 編集フォームを表示【ES5版】
	 */
	this.editShow = function(elm,option,callBack){
		editShow(elm,option,callBack);
	};


	/**
	 * 新規入力フォームを表示
	 * @param option オプション（現バージョンでは未使用）
	 * @param callBack フォームに一覧の行データを自動セットしたあとに呼び出されるコールバック関数(省略可）
	 */
	function newInpShow(elm,option,callBack){
		var info = self.formInfo['new_inp'];

		info.show_flg=1; // 表示制御フラグを表示中にする

		var form = getForm('new_inp');// フォーム要素を取得

		// デフォルト新規入力エンティティを新規入力フォームにセットする
		_setFieldsToForm('new_inp',form,this.defNiEnt);

		// フォーム種別をフォーム内の指定入力要素へセット
		setValueToFrom(form,'formType','new_inp');

		// バリデーションエラーメッセージをクリアする
		_clearValidErr(form);

		// コールバックを実行する
		if(callBack){
			var c_param ={'form':form};
			callBack(c_param);
		}

		// triggerElm要素の下付近に入力フォームを表示する。
		_showForm(form,elm,option);
	}

	/**
	 * 新規入力フォームを表示【ES5版】
	 */
	this.newInpShow = function(elm,option,callBack){
		newInpShow(elm,option,callBack);
	};

	/**
	 * テーブルの行数を取得する
	 * 
	 * @note
	 * 入れ子のテーブルが存在していても正確に行数を数える。
	 * 
	 */
	this.getTblRowCount = function(){
		var tbl = jQuery('#' + self.param.tbl_slt);
		var tBody = tbl.children('tbody');
		var rowCnt = tBody.children('tr').length;
		return rowCnt;
	}


	/**
	 * 複製による新規入力フォーム表示
	 * 
	 * @note
	 * 複製元のデータがあらかじめ入力された状態で新規入力フォームを表示する。
	 * 
	 * @param elm 複製ボタン要素
	 * @param option オプション（省略可）
	 *           -  upload_file_dirアップロードファイルディレクトリ
	 * @param callBack フォームに一覧の行データを自動セットしたあとに呼び出されるコールバック関数(省略可）
	 * 
	 */
	function copyAddShow(elm,option,callBack){

		var tr=jQuery(elm).parents('tr'); // 先祖をさかのぼりtr要素を取得する
		self.editRowIndex = tr.index(); // 行番（インデックス）を取得する

		var info = self.formInfo['new_inp'];

		info.show_flg=1; // 表示制御フラグを表示中にする

		// TR要素からエンティティを取得する
		var ent = self.getEntityByTr(tr);

		var form = getForm('copy');

		// フォーム種別をフォーム内の指定入力要素へセット
		setValueToFrom(form,'formType','copy');

		// 行番を取得し、要素にセットする
		var row_index = tr.index(); // 行番（インデックス）を取得する
		setValueToFrom(form,'row_index',row_index);

		// オプションからアップロードファイルディレクトリを取得する
		var upload_file_dir = undefined;
		if(option){
			upload_file_dir = option['upload_file_dir'];
		}

		// フォームに親要素内の各フィールド値をセットする。
		_setFieldsToForm('new_inp',form,ent,upload_file_dir);

		// バリデーションエラーメッセージをクリアする
		_clearValidErr(form);

		// コールバックを実行する
		if(callBack){
			callBack(tr,form,ent);
		}

		// triggerElm要素の下付近に入力フォームを表示する。
		_showForm(form,elm,option);

	}
	this.copyAddShow = function(elm,option,callBack){
		copyAddShow(elm,option,callBack);
	}


	/**
	 * 編集登録
	 * @param beforeCallBack Ajax送信前のコールバック（送信データを編集できる）
	 * @param afterCallBack Ajax送信後のコールバック
	 * @param option オプション
	 * - wp_action :WPアクション	WordPressでは必須
	 * - wp_nonce  :WPノンス	WordPressのトークン的なもの（なくても動くがセキュリティが下がる）
	 * 
	 */
	function editReg(beforeCallBack,afterCallBack,option){
		// バリデーション
		var res = _validationCheckForm('edit');
		if(res == false){
			return;
		}

		if(_empty(option)){
			option = {};
		}

		// 編集行のインデックスを取得する
		var index = self.editRowIndex; 

		// 編集フォームからエンティティを取得する。
		var ent = _getEntByForm('edit');

		// フィールドデータからファイルアップロード要素であるフィールドリストを抽出する
		fuEnts = _extractFuEnt(self.fieldData,'edit');

		// ファイルアップロード関連のエンティティをFormDataに追加する
		var fd = new FormData();
		fd = _addFuEntToFd(fd,fuEnts,'edit');

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

		fd.append( "formType", 'edit' );

		jQuery.ajax({
			type: "post",
			url: self.param.edit_reg_url,
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
				alert('エラー');
				console.log(str_json);
				jQuery("#err").html(str_json);
			}

			// 編集中の行にエンティティを反映する。
			if(ent){
				if(ent['err']){

					// エラーをフォームに表示する
					_showErrToForm(ent['err'],'edit');
					return;
				}
				
				// 無効フラグがONである場合、削除中の行を一覧から隠す
				if(ent['delete_flg'] && ent['delete_flg']==1){
					// 削除中の行を一覧から隠す
					_hideTr(index);
				}

				// 編集中のTR要素を取得する
				var tr = self.getTrInEditing();

				// エンティティのIDとTR要素のIDが不一致である場合、ブラウザをリロードする
				if(ent['id'] !=tr.find('.id').text()){
					location.reload(true);
				}

				// TR要素にエンティティの値をセットする
				_setEntityToEditTr(ent,tr);



				// 登録後にコールバック関数を非同期で実行する
				if(afterCallBack != null){
					window.setTimeout(function(){
						afterCallBack(ent);
						}, 1);
				}
	
				self.closeForm('edit');// フォームを閉じる
				

			}

		}).fail(function(jqXHR, statusText, errorThrown) {
			jQuery('#err').html(jqXHR.responseText);//詳細エラーの出力
			alert(statusText);
		});
	}

	/**
	 * 編集登録【ES5版】
	 */
	this.editReg = function(beforeCallBack,afterCallBack,option){
		editReg(beforeCallBack,afterCallBack,option)
	};


	/**
	 * 新規入力登録
	 * @param beforeCallBack Ajax送信前のコールバック（送信データを編集できる）
	 * @param afterCallBack Ajax送信後のコールバック
	 * @param option オプション 
	 * - add_row_index 追加行インデックス :テーブル行の挿入場所。-1にすると末尾へ追加。-1がデフォルト。
	 * - wp_action WPアクション: WordPressでは必須
	 * - wp_nonce  WPノンス: WordPressのトークン的なもの（なくても動くがセキュリティが下がる）
	 */
	function newInpReg(beforeCallBack,afterCallBack,option){

		var form = getForm('new_inp'); // 入力フォーム要素のオブジェクトを取得する

		// バリデーション
		var res = _validationCheckForm('new_inp');
		if(res == false){
			return;
		}

		if(_empty(option)){
			option = {};
		}


		// フィールドデータからファイルアップロード要素であるフィールドリストを抽出する
		fuEnts = _extractFuEnt(self.fieldData,'new_inp');

		// ファイルアップロード関連のエンティティをFormDataに追加する
		var fd = new FormData();
		fd = _addFuEntToFd(fd,fuEnts,'new_inp');

		// 新規入力フォームからエンティティを取得およびJSON化し、FormDataにセットする
		var ent = _getEntByForm('new_inp');

		// idに値がセットされ編集扱いとなっている場合、IDフラグをtrueにする。
		var id_flg = false;
		if(!_empty(ent['id'])){
			id_flg = true;
		}

		// Ajax送信前のコールバックを実行する
		if(beforeCallBack){

			var bcRes = beforeCallBack(ent,fd);
			if(bcRes['err']){
				_errShow(bcRes['err'],'new_inp');// エラーを表示
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

		// フォーム種別を取得してFDにセット
		var formType = getValueFromForm(form,'formType');
		fd.append( "formType", formType );

		// 諸パラメータから追加行インデックスを決定する
		var add_row_index = _decAddRowIndex(form,formType,option);


		jQuery.ajax({
			type: "post",
			url: self.param.new_reg_url,
			data: fd,
			cache: false,
			dataType: "text",
			processData: false,
			contentType : false,
		})
		.done(function(str_json, type) {

			var ent;
			try{
				ent =jQuery.parseJSON(str_json);//パース

			}catch(e){
				alert('エラー');
				jQuery("#err").html(str_json);
				return;
			}

			if(ent['err']){

				// エラーをフォームに表示する
				_showErrToForm(ent['err'],'new_inp');

			}else{

				// IDがセットされて、編集扱いとなっている場合はリロードする。
				if(id_flg==true){
					location.reload(true);
				}

				// 新しい行を作成する
				_addTr(ent,add_row_index);

				// 登録後にコールバック関数を非同期で実行する
				if(afterCallBack != null){
					window.setTimeout(function(){
						afterCallBack(ent);
						}, 1);
				}

				self.closeForm('new_inp');// フォームを閉じる

			}

		})
		.fail(function(jqXHR, statusText, errorThrown) {
			jQuery('#err').html(jqXHR.responseText);//詳細エラーの出力
			alert(statusText);
		});

	}

	/**
	 * 新規入力【ES5版】
	 */
	this.newInpReg = function(beforeCallBack,afterCallBack,option){
		newInpReg(beforeCallBack,afterCallBack,option);
	};

	/**
	 * 諸パラメータから追加行インデックスを決定する
	 * @param form フォーム要素
	 * @param formType フォーム種別
	 * @param option
	 * @returns 追加行インデックス
	 */
	function _decAddRowIndex(form,formType,option){

		// オプション内の追加行インデックスがセット済みでならそれを返す。
		if(option['add_row_index'] != null){
			return option['add_row_index'];
		}

		var add_row_index = -1;

		// フォーム種別が複製である場合、フォームから行番を取得してセットする。
		if(formType == 'copy'){
			add_row_index = getValueFromForm(form,'row_index');
		}

		return add_row_index;

	}


	/**
	 * 削除フォーム表示
	 * 
	 * @param elm 削除ボタン要素
	 * @param option オプション（省略可）
	 *           -  upload_file_dirアップロードファイルディレクトリ
	 * @param callBack フォームに一覧の行データを自動セットしたあとに呼び出されるコールバック関数(省略可）
	 * 
	 */
	function deleteShow(elm,option,callBack){
		var tr=jQuery(elm).parents('tr'); // 先祖をさかのぼりtr要素を取得する
		self.deleteRowIndex = tr.index(); // 行番（インデックス）を取得する

		var info = self.formInfo['del'];

		info.show_flg=1; // 表示制御フラグを表示中にする

		// TR要素からエンティティを取得する
		var ent = self.getEntityByTr(tr);

		var form = jQuery(info.slt);// 削除フォーム要素を取得

		// オプションからアップロードファイルディレクトリを取得する
		var upload_file_dir = undefined;
		if(option){
			upload_file_dir = option['upload_file_dir'];
		}

		// フォームに親要素内の各フィールド値をセットする。
		_setFieldsToForm('del',form,ent,upload_file_dir);

		// コールバックを実行する
		if(callBack){
			callBack(tr,form,ent);
		}

		// triggerElm要素の下付近に入力フォームを表示する。
		_showForm(form,elm,option);

	}

	/**
	 *  削除フォーム表示【ES5版】
	 */
	this.deleteShow = function(elm,option,callBack){
		deleteShow(elm,option,callBack);
	};


	/**
	 * 削除登録
	 * @param beforeCallBack Ajax送信前(削除前）のコールバック（送信データを編集できる）
	 * @param afterCallBack Ajax送信後(削除後）のコールバック
	 * @param option オプション
	 * - wp_action :WPアクション	WordPressでは必須
	 * - wp_nonce  :WPノンス	WordPressのトークン的なもの（なくても動くがセキュリティが下がる）
	 */
	function deleteReg (beforeCallBack,afterCallBack,option){

		var row_index = self.deleteRowIndex; // 削除行のインデックス

		// 削除フォームからエンティティを取得する
		var ent = _getEntByForm('delete');

		if(beforeCallBack){
			beforeCallBack(ent);
		}

		// 削除を実行
		_deleteRegBase(ent,row_index,beforeCallBack,afterCallBack,option);

	}
	/**
	 * 削除登録【ES6版】
	 */
	this.deleteReg = function(beforeCallBack,afterCallBack,option){
		deleteReg(beforeCallBack,afterCallBack,option);
	};


	/**
	 * 行番号を指定して削除登録を行う。
	 * @param row_index 行番号
	 * @param beforeCallBack Ajax送信前(削除前）のコールバック（送信データを編集できる）
	 * @param afterCallBack Ajax送信後(削除後）のコールバック
	 */
	this.deleteRegByRowIndex = function(row_index,beforeCallBack,afterCallBack){

		// HTMLテーブルから行番を指定してエンティティを取得する
		var ent = self.getEntity(row_index);

		// 削除を実行
		_deleteRegBase(ent,row_index,beforeCallBack,afterCallBack)

	};

	/**
	 * 基本的な削除機能
	 * @param ent idを含むエンティティ
	 * @param row_index 行番
	 * @param beforeCallBack Ajax送信前(削除前）のコールバック（送信データを編集できる）
	 * @param afterCallBack 削除後に実行するコールバック関数（省略可）
	 * @param option オプション
	 * - wp_action :WPアクション	WordPressでは必須
	 * - wp_nonce  :WPノンス	WordPressのトークン的なもの（なくても動くがセキュリティが下がる）
	 * @returns void
	 */
	function _deleteRegBase(ent,row_index,beforeCallBack,afterCallBack,option){

		if(!ent['id']){
			throw new Error('Not id');
		}

		if(_empty(option)){
			option = {};
		}

		// ファイルアップロード関連のエンティティをFormDataに追加する
		var fd = new FormData();
		fd.append( "formType", 'del' );

		// Ajax送信前のコールバックを実行する
		if(beforeCallBack){

			var bcRes = beforeCallBack(ent,fd);
			if(bcRes['err']){
				_errShow(bcRes['err'],'del');// エラーを表示
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

		jQuery.ajax({
			type: "post",
			url: self.param.delete_reg_url,
			data: fd,
			cache: false,
			dataType: "text",
			processData: false,
			contentType: false,

		}).done(function (str_json, type) {

			var ent;
			try{
				ent =jQuery.parseJSON(str_json);//パース

			}catch(e){
				alert('エラー');
				jQuery("#err").html(str_json);
			}

			if(!ent){return;}

			//_hideTr(row_index);// 削除中の行を一覧から隠す
			_deleteRow(row_index); // 行番に紐づく行を削除する

			// 登録後にコールバック関数を非同期で実行する
			if(afterCallBack != null){
				window.setTimeout(function(){
					afterCallBack(ent);
					}, 1);
			}

			self.closeForm('del');// フォームを閉じる

		}).fail(function(jqXHR, statusText, errorThrown) {
			jQuery('#err').html(jqXHR.responseText);//詳細エラーの出力
			alert(statusText);
		});

	}


	/**
	 * フォームを閉じる
	 * @parma string formType new_inp:新規入力 edit:編集 delete:削除
	 */
	this.closeForm = function(formType){

		// フォーム情報を取得
		var fi = self.formInfo[formType];

		// フォームのオブジェクトを取得する
		var form = fi.form;

		// フォームを隠す
		form.hide();

	};


	/**
	 * 行番を指定してTR要素を取得する
	 * @param row_index 行番 (-1を指定すると末尾を取得）
	 * @return TR要素
	 */
	this.getTr = function(row_index){

		var slt = '#' + self.param.tbl_slt + ' tbody tr';
		var tr = jQuery(slt).eq(row_index);

		return tr;
	};


	/**
	 * 末尾のTR要素を取得する
	 * @return TR要素
	 */
	this.getLastTr = function(){

		var slt = '#' + self.param.tbl_slt + ' tbody tr';
		var tr = jQuery(slt).eq(-1);

		return tr;
	};


	/**
	 * 現在編集中の行要素を取得する
	 * @return TR要素
	 */
	this.getTrInEditing = function(){

		var slt = '#' + self.param.tbl_slt + ' tbody tr:eq(' + self.editRowIndex + ')';
		var tr = jQuery(slt);

		return tr;
	};


	/**
	 * 行番とフィールド名からTD要素を取得する
	 * @param row_index 行番(-1で末行を指定）
	 * @param field フィールド名
	 * @return TD要素
	 */
	this.getTd = function(row_index,field){

		var tr = this.getTr(row_index); // 行番を指定してTR要素を取得する

		var elm = tr.find('.' + field);
		if(!elm[0]){
			return null;
		}

		var td = elm.parents('td');

		return td;

	};


	/**
	 * 現在編集中の行から、指定したフィールドに紐づくTD要素を取得する
	 * @param フィールド
	 * @return TD要素
	 */
	this.getTdInEditing = function(field){

		var tr = this.getTrInEditing(); // 現在編集中のTR要素を取得する

		var elm = tr.find('.' + field);
		if(!elm[0]){
			return null;
		}

		var td = elm.parents('td');

		return td;
	};


	/**
	 * 一覧テーブルの行番からエンティティを取得する
	 * @param row_index 行番(-1は末行)
	 * @return object エンティティ
	 */
	this.getEntity = function(row_index){

		// 行番を指定してTR要素を取得する
		var tr = self.getTr(row_index);

		// TR要素からエンティティを取得する
		var ent = self.getEntityByTr(tr);

		return ent;
	};


	/**
	 * TR要素からエンティティを取得する
	 * @param TR要素
	 * @return object エンティティ
	 */
	this.getEntityByTr = function(tr){

		var ent = {};
		for(var i in self.fieldData){
			var f = self.fieldData[i].field;
			var elm = tr.find('.' + f);
			ent[f] = elm.html();
		}

		return ent;


	};


	/**
	 * 行中の任意要素を指定して、エンティティを取得する
	 * @param elm 行内（TD要素内部）の任意要素
	 * @return エンティティ
	 */
	this.getEntityByInnerElm = function(elm){

		// 先祖をさかのぼりtr要素を取得する
		var tr=jQuery(elm).parents('tr');

		// 行番（インデックス）を取得する
		var index = tr.index();

		// 一覧行から行番にひもづくエンティティを取得する
		var ent = self.getEntity(index);

		return ent;
	};

	/**
	 * Htmlテーブルからデータを取得する
	 * @return object データ
	 */
	this.getDataHTbl = function(){

		var slt = '#' + self.param.tbl_slt + ' tbody tr';

		var data = [];

		// テーブルの行をループする
		jQuery(slt).each(function(){
			var tr = jQuery(this);

			// TR要素からエンティティを取得する
			var ent = self.getEntityByTr(tr);

			data.push(ent);
		});

		return data;
	};

	/**
	 * フィールドリストを指定して、Htmlテーブルからデータを取得する
	 * @return object データ
	 */
	this.getDataHTblByFields = function(fields){

		var slt = '#' + self.param.tbl_slt + ' tbody tr';

		var data = [];

		// テーブルの行をループする
		jQuery(slt).each(function(){
			var tr = jQuery(this);

			// TR要素からフィールド名を検索し、値を取得する
			var ent = {};
			for(var i in fields){
				var f = fields[i];
				var elm = tr.find('.' + f);
				ent[f] = _getValueEx(elm);

			}

			data.push(ent);
		});

		return data;
	};

	/**
	 * タグ種類を問わずに要素から値を取得する
	 * @param elm 要素
	 * @returns 要素の値
	 */
	function _getValueEx(elm){
		var tagName = elm.prop("tagName"); 

		if(tagName == 'INPUT' || tagName == 'SELECT' || tagName=='TEXTAREA'){
			return elm.val();
		}else{
			return elm.html();
		}
	}

	/**
	 * フォーム内のフィールドで指定した入力要素から、値を取得する。
	 * @param form フォーム要素
	 * @param field フィールド： 入力要素のフィールド名(name属性名あるいはclass属性名）
	 * @returns フィールドで指定した入力要素からの値。
	 *  - 入力要素が存在しない場合はnullを返す
	 */
	function getValueFromForm(form,field){

		var inpElm = _formFind(form,field); // 入力要素を取得
		var v = null;
		if(inpElm[0]){
			v = _getValueEx(inpElm); // 入力要素から値を取得
		}

		return v;
	}
	this.getValueFromForm = function(form,field){
		return getValueFromForm(form,field);
	}

	/**
	 * フォーム内のフィールドで指定した入力要素へ値をセットする。
	 * @param form フォーム要素
	 * @param field フィールド： 入力要素のフィールド名(name属性名あるいはclass属性名）
	 * @param value セットする値
	 */
	function setValueToFrom(form,field,value){
		var inpElm = _formFind(form,field); // 入力要素を取得
		if(inpElm[0]){
			_setValueEx(inpElm,value); // 要素の種類を問わずに値をセットする
		}
	}
	this.setValueToFrom = function(form,field,value){
		setValueToFrom(form,field,value);
	}


	/**
	 * エラーをフォームに表示する
	 * @param err エラー情報
	 * @param formType フォーム種別 new_inp:新規入力 edit:編集
	 * 
	 */
	function _showErrToForm(err,formType){

		// エラー情報が配列であれば、値を改行で連結して１つのエラーメッセージにする。
		var err1 = err;
		if(Array.isArray(err1)){
			err1 = err1.join('<br>');
		}

		// フォーム種別からフォーム要素を取得
		var info = self.formInfo[formType];
		var form = jQuery(info.slt);

		// フォーム要素からエラー要素を取得
		var errElm = form.find('.err');

		// エラー要素にエラーメッセージを埋め込む。
		errElm.html(err1);
	};


	/**
	 * バリデーションエラーメッセージをクリアする
	 * @param formType フォーム種別 new_inp:新規入力 edit:編集
	 */
	function _clearValidErr(form){

		var errElm = form.find(self.param.valid_msg_slt);
		errElm.html("");

		for(var i in self.fieldData){
			var field = self.fieldData[i]['field'];
			var label = form.find("[for='" + field + "']");
			if(label[0]){
				label.html("");
			}

		}


	}


	/**
	 * フォームのバリデーション
	 * @param formType フォーム種別 new_inp:新規入力 edit:編集
	 * @return validFlg バリデーションフラグ true:正常 false:入力エラー
	 */
	function _validationCheckForm(formType){

		var validFlg = true; // バリデーションフラグ

		// フォーム種別からフォーム要素を取得
		var info = self.formInfo[formType];
		var form = jQuery(info.slt);

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
	};


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


	// ファイルアップロード要素のクリア
	function _resetFileUpload(fuEnt){
		fuEnt.evt = null;
		var fileElm = fuEnt.elm;
		try {
			fileElm.val("");
		} catch (e) {
			console.log('It can not be reset in IE ');
		}

		// Reset a thubnail preview.
		var imgElm = jQuery('#' + fuEnt.preview_slt);
		imgElm.attr('src','');
		imgElm.hide();

		return fuEnt;
	}


	/**
	 * 新しい行を作成する
	 * @param ent 行エンティティ
	 * @param add_row_index 追加行インデックス :テーブル行の挿入場所。-1にすると末尾へ追加。-1がデフォルト。
	 */
	function _addTr(ent,add_row_index){

		if(add_row_index == null){
			add_row_index = -1;
		}
		add_row_index *= 1; // 数値型に変換する。

		// テーブルのtbody要素を取得する
		var tbodySlt = '#' + self.param.tbl_slt + ' tbody';
		var tbody = jQuery(tbodySlt);

		// テーブルの行数を取得する
		var row_len = tbody.children('tr').length;

		// 追加行インデックスが-1(末尾）なら末尾行番をセットする。
		if(add_row_index == -1){
			add_row_index = row_len - 1;
		}

		var trs = tbody.find('tr'); // TR群要素
		var tr0 = trs.eq(0);// 先頭行を取得

		// 先頭行が空ならブラウザリロードを行う。
		if(!tr0[0]){
			location.reload(true);
		}

		// 先頭行から新行を作成する
		var newTrHtml = "<tr class='new_line'>" + tr0.html() + "</tr>";

		// 追加行インデックスで指定した行の下に新行を挿入
		trs.eq(add_row_index).after(newTrHtml);

		// 新行要素を再取得する
		var slt = '#' + self.param.tbl_slt + ' tbody tr';
		var newTr = jQuery(slt).eq(add_row_index + 1);

		// 新行要素にエンティティをセットする
		_setEntityToTr(newTr,ent,'new_inp');

	}
	this.addTr = function(ent,add_row_index){
		_addTr(ent,add_row_index);
	}


	// 編集中の行にエンティティを反映する。
	function _setEntityToEditTr(ent,tr){

		if(ent==null){
			return;
		}

		// 現在編集中の行要素を取得する
		if(tr==undefined){
			var tr = self.getTrInEditing();
		}

		// TR要素にエンティティをセットする
		_setEntityToTr(tr,ent,'edit');

	};


	/**
	 * TR要素にエンティティをセットする
	 * @param tr TR要素オブジェクト
	 * @param ent エンティティ
	 * @param formType フォーム種別 new_inp,edit,del
	 */
	function _setEntityToTr(tr,ent,formType){

		if(ent==null){
			return;
		}

		// フォーム種別からフォーム要素を取得
		var info = self.formInfo[formType];
		var form = jQuery(info.slt);

		// TR要素内の各プロパティ要素内にエンティティの値をセットする
		for(var f in ent){
			// 源値要素への反映
			var elm = tr.find('.' + f);
			var v = ent[f];

			v = _xssSanitaizeEncode(v);// XSSサニタイズを施す
			v = _nl2brEx(v);// 改行コートをBRタグに変換する

			if(elm[0]){
				elm.html(v);
			}

			//display系要素への反映
			_setEntityToTrDisplay(tr,f,v,form);

		}

	};

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

	/**
	 * TR要素内のdisplay系要素にエンティティをセットする
	 * @param tr tr要素
	 * @param f フィールド名
	 * @param v 値
	 * @param form フォーム要素
	 */
	function _setEntityToTrDisplay(tr,f,v,form){

		if(f=='delete_flg'){
			var disp = tr.find('.' + f + '_display');

			if(v==0 || v==null || v==''){
				disp.html("<span style='color:#23d6e4;'>有効</span>");
			}else{
				disp.html("<span style='color:#b4b4b4;'>無効</span>");
			}
			return;
		}

		// class属性またはname属性を指定して入力要素を取得する。
		var inp = form.find('.' + f);
		if(inp[0]==undefined){
			inp = form.find("[name='" + f + "']")		}

		// 入力要素が取得できなければ処理抜けする
		if(inp[0]==undefined){
			return;
		}

		var tagName = inp.get(0).tagName; // 入力要素のタグ名を取得する

		if(tagName=='INPUT'){

			// type属性を取得
			var typ = inp.attr('type');

			if(typ=='radio'){
				var opElm = form.find("[name='" + f + "']:checked");
				if(!opElm[0]){
					return;
				}

				var dVal = opElm.parent('label').text();

				// display系要素を取得し、表記をセットする。
				var disp = tr.find('.' + f + '_display');
				if(!disp[0]){
					return;
				}
				disp.html(dVal);

			}

			// CHECKBOX
			else if(typ=='checkbox'){
				var disp = tr.find('.' + f + '_display');

				if(v==0 || v==null || v==''){
					disp.html("<span style='color:#b4b4b4;'>無効</span>");
				}else{
					disp.html("<span style='color:#23d6e4;'>有効</span>");
				}
				return;
			}


		}

		else if(tagName=='SELECT'){

			// フォームのSELECT要素から表記を取得する
			var opElm = inp.find("option[value='" + v + "']");
			if(!opElm[0]){
				return;
			}
			var dVal = opElm.html();// 表記
			dVal = _xssSanitaizeEncode(dVal);
			// display系要素を取得し、表記をセットする。
			var disp = tr.find('.' + f + '_display');
			if(!disp[0]){
				return;
			}
			disp.html(dVal);

		}

		else if(tagName=='TEXTAREA'){

			// display系要素を取得し、表記をセットする。
			var disp = tr.find('.' + f + '_display');
			if(!disp[0]){
				return;
			}

			var v2 = _nl2br(v);// 改行をBR要素に変換する

			disp.html(v2);
		}

	};


	// 行番に紐づく行を隠す
	function _hideTr(row_index){

		var tr = self.getTr(row_index);
		tr.hide();
	};

	/**
	 * 行版に紐づく行を削除する
	 * @param row_index	行番
	 * @returns
	 */
	function _deleteRow(row_index){
		var tr = self.getTr(row_index);
		tr.remove();
	}


	/**
	 * フォームからエンティティを取得する
	 * @param string formType フォーム種別  edit,new_inp,delete
	 * @return エンティティ
	 */
	function _getEntByForm(formType){

		// 現在編集中の行要素を取得する
		var tr = self.getTrInEditing();

		// TR要素からエンティティを取得する
		var ent = {};

		// フォーム要素を取得する
		var form = getForm(formType);

		if(formType=='edit' || formType=='delete'){
			ent = self.getEntityByTr(tr);
		}

		// フォームからエンティティを取得
		var ent2 = {};
		for(var i in self.fieldData){

			// フィールドデータからフィールド名を取得する
			var f = self.fieldData[i].field;

			// name属性またはclass属性を指定して入力要素を取得する。
			var inps = _formFind(form,f);

			// 該当する入力要素の件数を取得する
			var cnt=inps.length;

			var v = null;// 取得値

			// 0件である場合、該当する入力要素は存在しないため、何もせず次へ。
			if(cnt==0){
				continue;
			}

			// 入力要素が1件である場合、その要素から値を取得する。
			else if(cnt==1){
				v = _getEntByForm2(inps,form,f);
			}

			// 入力要素が2件以上である場合、最初の1件のみ取得
			else{

				inps.each(function(){
					var inp = jQuery(this);
					v = _getEntByForm2(inp,form,f);
					return;

				});

			}

			ent2[f] = v;

		}

		jQuery.extend(ent, ent2);

		return ent;

	}

	/**
	 * フォーム要素を取得する
	 * @param formType フォーム種別
	 * @param cache キャッシュフラグ 0:キャッシュから取得しない , 1:キャッシュがあればそこから取得
	 * @returns フォーム要素
	 */
	function getForm(formType,cache){

		if(cache == null){
			cache = 1;
		}


		var form;
		if(formType=='new_inp' || formType=='copy'){
			if(cache == 1){
				if(self.formNewInp != null){
					form = self.formNewInp;
				}else{
					form = jQuery('#' + self.param.new_form_slt);
				}
			}else{
				form = jQuery('#' + self.param.new_form_slt);
			}
			self.formNewInp = form;

		}else if(formType=='edit'){

			if(cache == 1){
				if(self.formEdit != null){
					form = self.formEdit;
				}else{
					form = jQuery('#' + self.param.edit_form_slt);
				}
			}else{
				form = jQuery('#' + self.param.edit_form_slt);
			}
			self.formEdit = form;

		}else if(formType=='delete'){

			if(cache == 1){
				if(self.formDelete != null){
					form = self.formDelete;
				}else{
					form = jQuery('#' + self.param.delete_form_slt);
				}
			}else{
				form = jQuery('#' + self.param.delete_form_slt);
			}
			self.formDelete = form;

		}else{
			throw new Error('Uknown formType!');
		}

		return form;
	}
	this.getForm = function(formType,cache){
		return getForm(formType,cache);
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
	};


	/**
	 * フィールドデータからファイルアップロード要素であるエンティティだけ抽出する
	 * @param fieldData フィールドデータ
	 * @param formType フォーム種別
	 */
	function _extractFuEnt(fieldData,formType){
		var fuEnts = [];
		for(var i in fieldData){
			var ent = fieldData[i];

			// 入力要素エンティティを取得する
			var inp_key = 'inp_' + formType;
			var inp_ent;
			if(ent[inp_key]){
				inp_ent = ent[inp_key];
			}else{
				continue;
			}

			if(inp_ent.type_name == 'file'){
				fuEnts.push(ent);
			}

		}

		return fuEnts;
	};


	/**
	 * ファイルアップロード関連のエンティティをFormDataに追加する
	 * @param fd FormData（フォームデータ）
	 * @param fuEnts フィールドエンティティリスト（ファイルアップロード関連のもの）
	 * @param formType フォーム種別
	 * @return 追加後のfd
	 */
	function _addFuEntToFd(fd,fuEnts,formType){

		for(var i in fuEnts){
			var fuEnt = fuEnts[i];

			var fu_key = fuEnt.field;
			var inp_key = 'inp_' + formType;
			var elm = fuEnt[inp_key].elm; // ファイル要素オブジェクトを取得

			fd.append( fu_key, elm.prop("files")[0] );
		}

		return fd;
	};


	/**
	 * フィールドを指定してlabel要素から値を取得する
	 * @param form フォーム要素オブジェクト
	 * @param field フィールド名
	 * @return labelから取得した値
	 */
	function _getValFromLabel(form,field){
		var v = null;
		var label = form.find("[for='" + field + "']");
		if(label[0]){
			v = label.html();
		}

		return v;

	};

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
	 * 入力フォームをダイアログ化する
	 * @param formInfo フォーム情報
	 * @param form_z_index 深度 
	 * @returns
	 */
	function _convertFormToDlg(formInfo,form_z_index){
		var param = self.param;

		if(form_z_index==undefined){
			form_z_index = param.form_z_index
		}

		// フォームのオブジェクトを取得する
		var form = formInfo.form;

		//デフォルトCSSデータ
		var cssData = {
			'z-index':form_z_index,
			'position':'absolute',

		}


		// フォームにCSSデータをセットする
		form.css(cssData);

		//ツールチップの外をクリックするとツールチップを閉じる
		if(self.param.auto_close_flg==1){
			jQuery(document).click(
					function (){

						// フォーム表示ボタンが押されたときは、フォームを閉じないようにする。（このイベントはフォームボタンを押した時にも発動するため）
						if(formInfo.show_flg==1){
							formInfo.show_flg=0;
						}else{
							jQuery(formInfo.slt).hide();
						}

					});

			//領域外クリックでツールチップを閉じるが、ツールチップ自体は領域内と判定させ閉じないようにする。
			form.click(function(e) {
				e.stopPropagation();
			});
		}

		form.hide();//フォームを隠す

	}


	// パラメータに空プロパティがあれば、デフォルト値をセットする
	function _setParamIfEmpty(param){

		if(param == undefined){
			param = {};
		}

		// CRUD対象テーブルセレクタ
		if(param['tbl_slt'] == undefined){
			param['tbl_slt'] = 'ajax_crud_tbl';
		}

		// 編集フォームセレクタ
		if(param['edit_form_slt'] == undefined){
			param['edit_form_slt'] = 'ajax_crud_edit_form';
		}

		// 新規フォームセレクタ
		if(param['new_form_slt'] == undefined){
			param['new_form_slt'] = 'ajax_crud_new_inp_form';
		}

		// 削除フォームセレクタ
		if(param['delete_form_slt'] == undefined){
			param['delete_form_slt'] = 'ajax_crud_delete_form';
		}

		// コンテンツセレクタ
		if(param['contents_slt'] == undefined){
			param['contents_slt'] = null;
		}

		// 編集登録サーバーURL
		if(param['edit_reg_url'] == undefined){
			param['edit_reg_url'] = 'xxx';
		}

		// 新規登録サーバーURL
		if(param['new_reg_url'] == undefined){
			param['new_reg_url'] = 'xxx';
		}

		// 削除登録サーバーURL
		if(param['delete_reg_url'] == undefined){
			param['delete_reg_url'] = 'xxx';
		}

		// ファイルアップロードディレクトリ
		if(param['upload_file_dir'] == undefined){
			param['upload_file_dir'] = null;
		}

		// ファイルアップロードデータ
		if(param['file_uploads'] == undefined){
			param['file_uploads'] = null;
		}

		// フォーム横幅
		if(param['form_width'] == undefined){
			param['form_width'] = null; // nullはフォーム幅がauto
		}

		// フォーム縦幅
		if(param['form_height'] == undefined){
			param['form_height'] = null; // nullはフォーム幅がauto
		}

		// フォーム位置
		if(param['form_position'] == undefined){
			param['form_position'] = 'auto';
		}

		// プレビュー画像・横幅
		if(param['preview_img_width'] == undefined){
			param['preview_img_width'] = 80;
		}

		// プレビュー画像・縦幅
		if(param['preview_img_height'] == undefined){
			param['preview_img_height'] = 80;
		}

		// フォームの前面深度(z-index)
		if(param['form_z_index'] == undefined){
			param['form_z_index'] = 9;
		}

		// バリデーションメッセージセレクタ
		if(param['valid_msg_slt'] == undefined){
			param['valid_msg_slt'] = '.err';
		}

		// 自動閉フラグ
		if(param['auto_close_flg'] == undefined){
			param['auto_close_flg'] = 1;
		}

		return param;

	}


	/**
	 * フィールドデータへ新規入力フォーム内の要素情報をセットする
	 * @param fieldData フィールドデータ
	 * @param formInfo フォーム情報
	 * @param formType フォームタイプ new_inp,edit
	 * @return フィールドデータ
	 */
	function _setFieldDataFromForm(fieldData,formInfo,formType){

		// フォーム要素オブジェクトを取得する
		var info = formInfo[formType];
		var form = info.form;

		for(var i in fieldData){

			// エンティティからフィールドを取得する
			var ent = fieldData[i];
			var f = ent.field;

			// 入力要素エンティティ
			var inp_ent = {
					'elm':null,
					'tag_name':null,
					'type_name':null,
					'accept':'',
			};

			// name属性またはclass属性を指定して入力要素を取得する。
			var inp = _formFind(form,f);
			inp_ent['elm'] = inp;

			// 入力要素が取得できなければcontinueする。
			if(inp[0]==undefined){
				continue;
			}

			var tag_name = inp.get(0).tagName; // 入力要素のタグ名を取得する
			inp_ent['tag_name'] = tag_name;

			// 値を取得する
			var v = null;
			if(tag_name == 'INPUT' || tag_name == 'SELECT' || tag_name == 'TEXTAREA'){

				// type属性を取得する
				var typ = inp.attr('type');
				inp_ent['type_name'] = typ;

				if(typ=='file'){

					// 受け入れファイルタイプを取得
					var accept = inp.attr('accept');
					inp_ent['accept'] = accept;

				}

			}

			ent['inp_' + formType] = inp_ent;

		}

		return fieldData;

	}


	/**
	 * フィールドデータにファイル要素の情報をセット、およびファイルチェンジイベントを登録する。
	 * @param fieldData フィールドデータ
	 */
	function _initFileUpData(fieldData){

		// フォーム名のリスト
		var formTypeList = ['new_inp','edit','del'];

		// ファイル要素系にのみ、ファイル要素情報をセットする。
		for(var i in fieldData){
			var f_ent = fieldData[i];

			for(var ft_i = 0 ; ft_i < formTypeList.length ; ft_i++){
				var formType = formTypeList[ft_i];
				var key = 'inp_' + formType;

				if(!f_ent[key]){
					continue;
				}
				var ent = f_ent[key];

				if(ent.type_name == 'file'){

					// ファイル要素情報を入力要素エンティティにセットする
					ent = _setFileUploadEntity(f_ent.field,ent);

					// イベントリスナを登録する
					if(formType == 'new_inp'){
						ent.elm.change(_fileChangeEventNewInp);
					}else if(formType == 'edit'){
						ent.elm.change(_fileChangeEventEdit);
					}else{
						ent.elm.change(_fileChangeEventDel);
					}

				}

			}

		}

		return fieldData;

	};


	/**
	 * ファイル要素情報を入力要素エンティティにセットする
	 * @param field フィールド名
	 * @param ent 入力要素エンティティ（type=file)
	 * @return 入力要素エンティティ
	 */
	function _setFileUploadEntity(field,ent){

		// プレビュー要素
		var preview_slt = field + '_preview';

		ent['evt'] = null;
		ent['file_name'] = null;
		ent['file_path'] = self.param.upload_file_dir;
		ent['preview_slt'] = preview_slt;

		return ent;

	};


	/**
	 * フォームにエンティティをセットする
	 * @param string formType フォーム種別
	 * @param object form フォーム
	 * @param object ent エンティティ
	 * @param string upload_file_dir アップロードファイルディレクトリ（省略可）
	 */
	function _setFieldsToForm(formType,form,ent,upload_file_dir){

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

					// アップロードファイル要素用の入力フォームセッター
					_setToFormForFile(formType,form,f,v,upload_file_dir);

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
				// IMG要素用の入力フォームセッター
				_setToFormForImg(formType,form,inp,f,v,upload_file_dir);
			}

			// audioタグへのセット
			else if(tagName == 'AUDIO'){

				// オーディオ要素用の入力フォームセッター
				_setToFormForAdo(formType,form,inp,f,v,upload_file_dir);

			}else{
				if(v != null){
					v=v.replace(/<br>/g,"\r");
					v = _xssSanitaizeEncode(v); // XSSサニタイズを施す
					v = _nl2brEx(v);// 改行コートをBRタグに変換する
				}
				inp.html(v);
			}

		}


	}

	// アップロードファイル要素用の入力フォームセッター
	function _setToFormForFile(formType,form,field,v,upload_file_dir){

		// 入力要素エンティティを取得する
		var ent = _getFieldEntByField(field);

		var inp_ent = ent['inp_' + formType];

		// アップロードファイル要素をクリアする
		var inpElm = inp_ent.elm;
		inpElm.val("");

		if(!upload_file_dir){
			upload_file_dir = inp_ent.file_path;
		}
		var fp = upload_file_dir + v;

		var accept = inp_ent.accept;

		// acceptが画像系である場合、画像プレビューを表示
		if(accept.indexOf('image') >= 0 ){

			var imgElm = _getPreviewImgElm(form,field,inp_ent);

			if(!_empty(v)){
				imgElm.attr('src',fp);
			}

		}

		// acceptがオーディオ系である場合、オーディオプレビューを表示
		else if(accept.indexOf('audio') >= 0){
			var adoElm = _getPreviewAdoElm(inp_ent,fp);
			//adoElm.attr('src',fp);
		}

		_setLabel(form,field,v);// ラベル要素へセット
	}

	/**
	 * フィールド名を指定してフィールドエンティティを取得する
	 */
	function _getFieldEntByField(field){
		var index = self.fieldHashTable[field];
		var ent = self.fieldData[index];

		return ent;
	}

	/**
	 * 入力要素エンティティを取得する
	 * @param field フィールド
	 * @param formType フォーム種別
	 * @return 入力要素エンティティ
	 */
	function _getInpEnt(field,formType){
		var index = self.fieldHashTable[field];
		var ent = self.fieldData[index];
		var inp_ent;
		var inp_key = 'inp_' + formType;
		if(ent[inp_key]){
			inp_ent = ent[inp_key];
		}
		return inp_ent;
	}


	// IMG要素用の入力フォームセッター
	function _setToFormForImg(formType,form,imgElm,field,v,upload_file_dir){

		// 入力エンティティを取得する
		var inp_ent = _getInpEnt(field,formType)

		if(!upload_file_dir){
			upload_file_dir = inp_ent.file_path;
		}
		var fp = upload_file_dir + v;
		imgElm.attr('src',fp);

		_setLabel(form,field,v);// ラベル要素へセット

	}

	// オーディオ要素用の入力フォームセッター
	function _setToFormForAdo(formType,form,adoElm,field,v,upload_file_dir){

		// 入力エンティティを取得する
		var inp_ent = _getInpEnt(field,formType)

		if(!upload_file_dir){
			upload_file_dir = inp_ent.file_path;
		}
		var fp = upload_file_dir + v;
		adoElm.attr('src',fp);

		_setLabel(form,field,v);// ラベル要素へセット

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
	};


	/**
	 * 入力フォームを表示する
	 * 
	 * @param object form フォーム要素オブジェクト
	 * @param string triggerElm トリガー要素  ボタンなど
	 * @param option
	 *  - form_position フォーム位置フラグ:  auto(空）:基本位置 , left:トリガーの左側にフォームを表示 , center:横中央 , right:右側  , max:フルサイズ
	 *  - use_show_form_strategy 入力フォームストラテジーの使用:  入力フォームストラテジーがセットされている場合、利用するか。デフォルトは使用する。
	 */
	function _showForm(form,triggerElm,option){

		if(option == null){
			option = {};
		}

		// フォーム位置フラグ
		if(option['form_position'] == null){
			option['form_position'] = self.param.form_position;
		}

		// 入力フォームストラテジーの使用
		if(option['use_show_form_strategy'] == null){
			option['use_show_form_strategy'] = 1;
		}

		// 複数のフォームを開いてフォームが重なった時、新しく開いたフォームが上になるようにする。
		if(self.param.auto_close_flg == 0){
			self.param.form_z_index ++;
			// ※ z_indexの最大値は32bit整数,あるいは64bit整数の最大値である。

			form.css('z-index',self.param.form_z_index);
		}

		form.show();

		// 入力フォームストラテジーがセットされている場合、こちらの処理を実行する。（ストラテジーパターンによる拡張である）
		if(option.use_show_form_strategy == 1 && self.showFormStrategy != null){
			var res = self.showFormStrategy.showForm(form,triggerElm);
			if(res==true){
				return;
			}
		}

		//トリガー要素の右上位置を取得
		if(!(triggerElm instanceof jQuery)){
			triggerElm = jQuery(triggerElm);
		}
		var offset=triggerElm.offset();
		var left = offset.left;
		var top = offset.top;

		var ww = jQuery(window).width();// Windowの横幅（ブラウザの横幅）

		// フォームのサイズを取得する。パラメータでサイズ指定されていない場合、フォームからサイズを取得する
		var form_width = self.param.form_width;// フォームの横幅
		var form_height = self.param.form_height;// フォームの縦幅
		if(_empty(form_width)){
			form_width = form.outerWidth();
		}
		if(_empty(form_height)){
			form_height = form.outerHeight();
		}

		// フォーム位置Yをセット
		var trigger_height = triggerElm.outerHeight();
		var tt_top=top + trigger_height;


		var tt_left=0;// フォーム初期位置X
		var full_w = ww; // コンテンツのフル横幅

		// コンテンツ要素が指定されている場合、コンテンツ要素の初期位置Xと横幅をセットする。
		if(!_empty(self.param.contents_slt)){
			var conElm = jQuery(self.param.contents_slt);
			if(conElm[0]){
				tt_left = conElm.offset.left;
				full_w = conElm.width();
			}
		}


		// フォーム位置の種類毎にフォーム位置Xを算出する。
		switch (option.form_position) {

		case 'left':

			// トリガーの左側にフォームを表示する。
			tt_left=left - form_width;
			break;

		case 'center':

			// フォームを中央にする。
			tt_left=(full_w / 2) - (form_width / 2);
			break;

		case 'right':

			// トリガーの右側にフォームを表示する
			tt_left=left;
			break;

		case 'max':

			form_width = full_w;

			break;

		default:// auto

			// 基本的にトリガーの右側にフォームを表示する。
			// ただし、トリガーが右端付近にある場合、フォームは外側にでないよう左側へ寄せる。
			tt_left=left;
			if(tt_left + form_width > full_w){
				tt_left = full_w - form_width;
			}

			break;
		}

		if(tt_left < 0){
			tt_left = 0;
		}

		//フォーム要素に位置をセット
		form.offset({'top':tt_top,'left':tt_left });

		if(!_empty(form_width)){
			form.width(form_width);
		}

		if(!_empty(form_height)){
			form.height(form_height);
		}


	}


	// フィールドデータにプロパティを追加する
	function _addMoreFieldData(tbl_slt,fieldData){

		// フィールドデータが空であるなら一覧テーブルのth要素からフィールド名を取得する
		if(!fieldData){
			fieldData = _getFieldDataFromTh();

			if(!fieldData){
				throw new Error('fieldDataを取得できません。th要素のclass属性にフィールド名を指定してください。');
			}
		}


		var fieldData2 = [];

		// thループ
		var i=0;
		jQuery('#' + tbl_slt + ' th').each(function(){

			var wamei = jQuery(this).text();

			var field = null;
			if(fieldData[i]){
				field = fieldData[i];
			}

			if(field != null){
				var ent = {
						'index':i,
						'field':field,
						'wamei':wamei,
					};

				fieldData2.push(ent);

				i++;
			}

		});


		return fieldData2;
	};

	// th要素からフィールド情報を取得する
	function _getFieldDataFromTh(){

		var fieldData = [];

		var slt = '#' + self.param.tbl_slt + ' th';
		jQuery(slt).each(function(){
			var thElm = jQuery(this);
			var field = _getFieldByClassOrName(thElm);////class属性またはname属性からフィールド名を取得する
			if(field){
				fieldData.push(field);
			};
		});

		return fieldData;

	};


	// フィールドハッシュテーブルをフィールドデータから生成する。
	function _createFieldHashTable(fieldData){

		var hashTable = {};

		for(var i in fieldData){
			var fEnt = fieldData[i];

			hashTable[fEnt.field] = i;

		}

		return hashTable;
	}


	// フォーム情報の初期化
	function _initFormInfo(param){

		var formInfo = {};// フォーム情報

		// 新規フォーム情報の設定
		var res = _classifySlt(param['new_form_slt']);
		var newInpForm = jQuery(res['slt']);
		formInfo['new_inp'] = {
			'xid':res['xid'],	// ID属性
			'slt':res['slt'],	// フォーム要素のセレクタ
			'show_flg':0,		// 表示制御フラグ（閉じるイベント制御用）
			'form':newInpForm,	// フォーム要素
		};
		_convertFormToDlg(formInfo.new_inp);// フォームをダイアログ化する。

		// 編集フォーム情報の設定
		res = _classifySlt(param['edit_form_slt']);
		var editForm = jQuery(res['slt']);
		formInfo['edit'] = {
			'xid':res['xid'],	// ID属性
			'slt':res['slt'],	// フォーム要素のセレクタ
			'show_flg':0,		// 表示制御フラグ（閉じるイベント制御用）
			'form':editForm,	// フォーム要素
		};
		_convertFormToDlg(formInfo.edit);// フォームをダイアログ化する。


		// 削除フォーム情報の設定
		var res = _classifySlt(param['delete_form_slt']);
		var deleteForm = jQuery(res['slt']);
		formInfo['del'] = {
			'xid':res['xid'],	// ID属性
			'slt':res['slt'],	// フォーム要素のセレクタ
			'show_flg':0,		// 表示制御フラグ（閉じるイベント制御用）
			'form':deleteForm,	// フォーム要素
		};
		_convertFormToDlg(formInfo['del']);// フォームをダイアログ化する。

		return formInfo;

	};

	/**
	 * バリデーションによるエラーを表示する
	 * @param errData エラーデータ
	 *  - 文字列型<string>	エラーメッセージのみ
	 *  - エラー出力指定型(単一) <{'err_slt','err_msg'}>		出力先セレクタとエラーメッセージ
	 *  - エラー出力指定型（複数） <[{'err_slt','err_msg'}]>	上記の配列
	 * @param formType フォーム種別
	 * @returns void
	 */
	function _errShow(errData,formType){

		// フォーム種別からフォーム要素を取得する
		var form = getForm(formType);

		// 一旦、バリデーションエラーメッセージをクリアする
		_clearValidErr(form);

		// エラーメッセージのみである場合
		if (typeof errData == 'string'){
			var errElm = form.find(self.param.valid_msg_slt);
			if(errElm[0]){
				if(errElm.length > 1){
					errElm = errElm.eq(0);
				}
				errElm.html(errData.err_msg);
			}
			errElm.html(errData);

		}

		// エラーセレクタによってエラー出力先が指定されている場合
		else{

			// 複数エラータイプである場合
			if(errData[0]){
				for(var i in errData){
					var errEnt = errData[i];
					var errElm = form.find(errEnt.err_slt);
					errElm.html(errEnt.err_msg);
				}
			}

			// 単一エラータイプである場合
			else{
				var errElm = form.find(errData.err_slt);
				errElm.html(errData.err_msg);
			}

		}
	}


	/**
	 * 検索
	 * @param searchBtnElm 検索ボタン要素
	 * @param <jquery object> formElm 検索入力フォーム (省略可)
	 * @param option オプション (省略可)
	 */
	function searchKjs(searchBtnElm,formElm,option){

		// 検索ボタン要素をjQueryオブジェクトに変換する
		var btnElm; // 検索ボタン要素
		if(searchBtnElm instanceof jQuery){
			btnElm = searchBtnElm;
		}else{
			btnElm = jQuery(searchBtnElm);
		}

		// オプションの初期セット
		if(option == null){
			option = {};
		}
		if(_empty(option['form_slt'])){
			option['form_slt'] = '.form_kjs';
		}
		if(_empty(option['inp_slt'])){
			option['inp_slt'] = '.kjs_inp';
		}

		// URLからパラメータを取得する
		var param = _getUrlQuery();

		// form要素が空なら生成する
		if(!formElm){
			var form_slt = option['form_slt'];
			formElm = btnElm.parents(form_slt);
		}

		// form要素内の入力要素群をループする。
		var kjs = {}; // 検索条件情報
		var removes = []; // 除去リスト（入力が空の要素のフィールド）
		var inp_slt =  option['inp_slt'];
		formElm.find(inp_slt).each(function(){

			// 要素から選択値を取得する
			var kjsElm = jQuery(this);
			var val = kjsElm.val();

			// 選択値が空でない場合（0も空ではない扱い）
			var field = kjsElm.attr('name'); // 要素のname属性から検索条件フィールドを取得する
			if(!_emptyNotZero(val)){
				val = encodeURIComponent(val); // 要素の値をURLエンコードする
				kjs[field] = val; // 検索条件情報にセットする

			}else{
				removes.push(field);
			}
		});

		// パラメータに検索条件情報をマージする
		jQuery.extend(param, kjs);

		// パラメータから除去リストのフィールドを削除する。
		for(var i in removes){
			var rem_field = removes[i];
			delete param[rem_field];
		}

		// 1ページ目をセットする
		param['kj_page_no'] = 0;

		// パラメータからURLクエリを組み立てる
		var query = '';
		for(var field in param){
			var val = param[field];
			query += field + '=' + val + '&';
		}

		// URLの組み立て
		var url;
		if(query != ''){
			query = query.substr(0,query.length-1); // 末尾の一文字を除去する
			url = '?' + query;
		}

		// URLへ遷移
		window.location.href = url;
	}
	// ES5版のメソッド
	this.searchKjs = function(searchBtnElm,formElm=null,option=null){
		searchKjs(searchBtnElm,formElm,option);
	}


	/**
	 * 検索リセット
	 * @param resetBtnElm 検索ボタン要素
	 * @param <jquery object> formElm 検索入力フォーム (省略可)
	 * @param option オプション (省略可)
	 * @param outFields 対象外フィールド（例 ['kj_xxx','kj_yyy'] )
	 */
	function resetKjs(resetBtnElm,formElm,option,outFields){

		// 検索ボタン要素をjQueryオブジェクトに変換する
		var btnElm; // 検索ボタン要素
		if(resetBtnElm instanceof jQuery){
			btnElm = resetBtnElm;
		}else{
			btnElm = jQuery(resetBtnElm);
		}

		// オプションの初期セット
		if(option == null){
			option = {};
		}
		if(_empty(option['form_slt'])){
			option['form_slt'] = '.form_kjs';
		}
		if(_empty(option['inp_slt'])){
			option['inp_slt'] = '.kjs_inp';
		}
		if(_empty(option['def_slt'])){
			option['def_slt'] = '.def_kjs_json';
		}

		// 対象外ハッシュの作成
		var outs = {};
		if(!_empty(outFields)){
			for(var i in outFields){
				var f = outFields[i];
				outs[f] = 1;
			}
		}

		// form要素が空なら生成する
		if(!formElm){
			var form_slt = option['form_slt'];
			formElm = btnElm.parents(form_slt);
		}

		// デフォルト検索条件JSONを取得する。空なら処理抜け。
		var def_kjs_json = formElm.find(option['def_slt']).val();
		if(_empty(def_kjs_json)){return;}
		var protoDefKjs = JSON.parse(def_kjs_json);

		// デフォルト検索条件データの構造変換
		var defKjs = {};
		for(var i in protoDefKjs){
			var ent = protoDefKjs[i];
			defKjs[ent.name] = ent.def;
		}

		// form要素内の入力要素群をループする。
		var inp_slt =  option['inp_slt'];
		formElm.find(inp_slt).each(function(){

			// 要素から選択値を取得する
			var kjsElm = jQuery(this);

			// 選択値が空でない場合（0も空ではない扱い）
			var field = kjsElm.attr('name'); // 要素のname属性から検索条件フィールドを取得する

			// デフォルト検索条件を要素にセットする
			if(defKjs[field]!==undefined && outs[field]==undefined){
				kjsElm.val(defKjs[field]);
			}

		});

	}

	this.resetKjs = function(resetBtnElm,formElm,option,outFields){
		resetKjs(resetBtnElm,formElm,option,outFields);
	}


	/**
	 * 現在の検索条件がデフォルトの検索条件を比較し、検索初期状態であるかチェックする。
	 * 
	 * @param outFields 比較対象外フィールド配列
	 * @param kjs 検索条件情報(省略可）
	 * @param defKjs デフォルト検索条件（省略可）
	 * @returns 検索初期状態 0:初期状態でない , 1:初期状態
	 */
	function isDefaultKjs(outFields,kjs,defKjs){

		// 検索条件情報が省略されている場合はHTMLの埋込JSONから取得する。
		if(kjs==null){
			var kjs_json = $('#kjs_json').html();
			kjs = JSON.parse(kjs_json);
		}

		// デフォルト検索条件が省略されている場合はHTMLの埋込JSONから取得する。
		if(defKjs==null){
			var defKjsJson = $('#defKjsJson').html();
			defKjs = JSON.parse(defKjsJson);
		}

		// 比較対象外フィールドマッピング
		var outFieldMap = {};
		for(var i in outFields){
			var field = outFields[i];
			outFieldMap[field] = 1;
		}

		var is_def_flg = 1; // 検索初期状態

		for(var field=0 in defKjs){

			// 対象外フィールドに存在するフィールドであればコンテニュー。
			if(outFieldMap[field]){
				continue;
			}

			if(kjs[field] === undefined){
				continue;
			}else{

				// null,undefined,空文字はnullとして扱う。
				var kjs_value = kjs[field];
				if(_emptyNotZero(kjs_value)){
					kjs_value = null;
				}
				
				var def_value = defKjs[field];
				if(_emptyNotZero(def_value)){
					def_value = null;
				}

				// 値が異なるのであれば検索初期状態 は初期状態でないと判定する。
				if(kjs_value != def_value){

					is_def_flg = 0;
					break
				}
				
			}

		}

		return is_def_flg;

	}

	this.isDefaultKjs = function(outFields,kjs,defKjs){
		return isDefaultKjs(outFields,kjs,defKjs)
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

	};


	/**
	* class属性またはname属性からフィールド名を取得する
	* 
	* @note
	* class属性が複数である場合、先頭のclass属性を取得する
	*
	* @parma elm 入力要素オブジェクト
	* @return フィールド名
	*/
	function _getFieldByClassOrName(elm){

		var field = elm.attr('class');
		if(!field){
			field = elm.attr('name');
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

	};


	/**
	 * 対象文字列をID属性とセレクタに分類する
	 * @param slt 対象文字列
	 * @returns res
	 *  - xid ID属性
	 *  - slt セレクタ
	 */
	function _classifySlt(slt){

		var xid='';
		var slt2 = '';

		if(!slt){
			return res = {
					'xid':xid,
					'slt':slt2
			}
		}

		var s1 = slt.charAt(0);
		if(s1=='#'){
			xid = slt.replace('#','');
			slt2 = slt;
		}else{
			xid = slt;
			slt2 = '#' + slt;
		}

		var res = {
				'xid':xid,
				'slt':slt2
		}

		return res;

	};


	//XSSサニタイズエンコード
	function _xssSanitaizeEncode(str){
		if(typeof str == 'string'){
			return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace('/&/','&amp;');;
		}else{
			return str;
		}
	}

	//XSSサニタイズデコード
	function _xssSanitaizeDecode(str){
		if(typeof str == 'string'){

			return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
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

	/**
	 * 空判定 | ただし「0」はfalseを返す
	 * @param v
	 */
	function _emptyNotZero(v){
		var res = _empty(v);
		if(res){
			if(v===0 || v==='0'){
				res = false;
			}
		}
		return res;
	}

	/**
	 * URLクエリデータを取得する
	 * 
	 * @return object URLクエリデータ
	 */
	function _getUrlQuery(){
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
	 * 入力フォームストラテジーのセッター
	 * @param obj 入力フォームストラテジーのオブジェクト
	 */
	function setShowFormStrategy(obj){
		self.showFormStrategy = obj;
	}
	this.setShowFormStrategy = function(obj){
		setShowFormStrategy(obj);
	}


	/**
	 * 要素の種類を問わずに値をセットする
	 * @param elm 要素(jQueryオブジェクト）
	 * @pramm v 値
	 * @version 1.0
	 */
	function _setValueEx(elm,v){

		if(!elm[0]){
			return;
		}

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
					v = v.replace(/</g, '&lt;').replace(/>/g, '&gt;');
				}
				v = v.replace(/\r\n|\n\r|\r|\n/g,'<br>');// 改行コートをBRタグに変換する
			}

			elm.html(v);
		}

	}


	//コンストラクタ呼出し(クラス末尾にて定義すること）
	this.constract();
};


