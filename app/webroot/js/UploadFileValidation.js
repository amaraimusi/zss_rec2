/**
 * アップロードファイルのバリデーションクラス | UploadFileValidation.js
 * @date 2016-12-20 | 2017-2-21
 * @version 1.0.1 IE11で起こるバグを修正
 * 
 */
var UploadFileValidation =function(){
	

	var myself=this; // Instance of myself.
	
	
	/**
	 * チェンジイベントデータからアップロードファイルのバリデーションを行う
	 * 
	 * @param e チェンジイベント情報 onchangeイベントの引数
	 * @param array permitExts 許可拡張子リスト
	 * @param array permitMimes 許可MIMEリスト
	 * @param bool allowEmpty 空許可フラグ true:空値を許可,false:空値を不許可（必須）
	 * @return エラー情報配列。 正常である場合はnullを返す
	 */
	this.check = function(e,permitExts,permitMimes,allowEmpty){
		
		if(!allowEmpty){
			allowEmpty = false;
		}

		var oFile = e.target.files[0];
		var err = myself.checkFileObject(oFile,permitExts,permitMimes,allowEmpty);
		return err;
		
	}


	/**
	 * 画像用 | チェンジイベントデータからアップロードファイルのバリデーションを行う
	 * 
	 * @param e チェンジイベント情報 onchangeイベントの引数
	 * @param bool allowEmpty 空許可フラグ true:空値を許可,false:空値を不許可（必須）
	 * @return エラー情報。 正常である場合はnullを返す
	 */
	this.checkImage = function(e,allowEmpty){
		
		if(!allowEmpty){
			allowEmpty = false;
		}
		
		var oFile = e.target.files[0];
		var err = myself.checkFileObjForImg(oFile,allowEmpty);
		return err;
	}


	/**
	 * 画像用 | ファイルオブジェクトからアップロードファイルのバリデーションを行う
	 * @param object oFile ファイルオブジェクト
	 * @param bool allowEmpty 空許可フラグ true:空値を許可,false:空値を不許可（必須）
	 * @return エラー情報。 正常である場合はnullを返す
	 */
	this.checkFileObjForImg = function(oFile,allowEmpty){
		var err = myself.checkFileObject(oFile,['png','jpg','jpeg','gif'],['image/png','image/jpeg','image/gif'],allowEmpty);
		return err;
	}
	
	
	/**
	 * ファイルオブジェクトからアップロードファイルのバリデーションを行う
	 * @param object oFile ファイルオブジェクト
	 * @param array permitExts 許可拡張子リスト
	 * @param array permitMimes 許可MIMEリスト
	 * @param bool allowEmpty 空許可フラグ true:空値を許可,false:空値を不許可（必須）
	 * @return エラー情報。 正常である場合はnullを返す
	 */
	this.checkFileObject = function(oFile,permitExts,permitMimes,allowEmpty){
		
		if(!allowEmpty){
			allowEmpty = false;
		}
		
		// ファイル名を取得する
		var fn = oFile['name'];
		
		// ファイル名が空でないか？
		if(fn == "" || fn == null){
			if(allowEmpty==true){
				return null;
			}else{
				return "ファイル名が空です。";
			}
		}
		
		// ファイル名に不正文字が含まれていないかチェックする
		var reg_exp_res = fn.match(';|<|>|%|$|./|\\\\');
		if(reg_exp_res != ""){
			return "ファイル名に不正記号が含まれています。";
		}
		
		// ファイル名から拡張子を取得する。
		var ext1 = stringRightRev(fn,'.');
		
		// 拡張子が空でないか？
		if(ext1 == "" || ext1 == null){
			return "ファイル名に拡張子がありません。ファイル名【" + fn + "】";
		}
		
		// ファイルサイズが0であるかチェックする。
		if(oFile['size'] == undefined || oFile['size']==0){
			return "ファイルサイズが0です。ファイル名【" + fn + "】";
		}
		
		ext1 = ext1.toLowerCase();
		
		// 許可拡張子リストに存在する拡張子であるか？
		var flg = permitExts.indexOf(ext1);
		if(flg == -1){
			return "無効の拡張子です。【" + fn + "】";
		}
		
		// MIMEを取得する
		var mime_type = oFile['type'];
		
		// MIMEが空でないか？
		if(mime_type == "" || mime_type == null){
			return "MIMEタイプが空です。";
		}
		
		// 許可拡張子リストに存在する拡張子であるか？
		var flg = permitMimes.indexOf(mime_type);
		
		if(flg == -1){
			return "無効のMIMEタイプです。【" + mime_type + "】";
		}
		
		return null;
	}
	
	
	
	/**
	 * 文字列を右側から印文字を検索し、右側の文字を切り出す。
	 * @param s 対象文字列
	 * @param mark 印文字
	 * @return 印文字から右側の文字列
	 */
	function stringRightRev(s,mark){
		if (s==null || s==""){
			return s;
		}
		
		var a=s.lastIndexOf(mark);
		var s2=s.substring(a+mark.length,s.length);
		return s2;
	}
	


	
	
};