/**
 * CrudBase・ファイルアップロードコンポーネント | CrudBase File Upload Component
 * 
 * @note
 * CurdBase.jsのコンポーネントの一つ
 * 
 * @date 2018-8-24 | 2018-9-19
 * @version 1.1.2
 * @history
 * 2018-9-19 v1.1.2 ファイルアップロード機能：DnDに対応
 * 2018-9-18 v1.1.1 コールバックパラメータを追加（pacb_param)
 * 2018-9-17 v1.1.0 画像ファイルが空の時に新規登録すると2行目のサムネイル画像が表示される
 * 2018-8-24 v1.0.0 開発
 * 
 */
class CbFileUploadComponent{
	
	
	/**
	 * コンストラクタ
	 * 
	 * @param param fuIds file要素idリスト
	 * @param object option FileUploadK:addEventのoption
	 * 
	 */
	constructor(fuIds,option){
		
		
		this.fileUploadK = this._factoryFileUploadK(fuIds,option); // 拡張ファイルアップロード・オブジェクト
		
		this.fuIds = fuIds; // file要素idリスト
		this.fields = this._fueIdsToFields(fuIds); // FUフィールドリスト
		this.dpData = this._makeDtData(this.fields); // ディレクトリパス情報
		
		this.none_img_fp = 'img/icon/none.gif';
		
	}
	
	/**
	 * ディレクトリパス情報
	 * @param array fuIds file要素idリスト
	 * @return array ディレクトリパス情報
	 */
	_makeDtData(fields){
		var dpData = {}; // ディレクトリパスデータ
		
		// ファイルアップロード用のディレクトリパステンプレート情報を取得
		var dpt_json = jQuery('#dpt_json').val();
		var dptData = JSON.parse(dpt_json);

		var dpTypes = ['orig','thum1','thum2']; // ディレクトリパスタイプリスト
		
		for(var dpt_i in dpTypes){
			var dp_type = dpTypes[dpt_i];
			var dp_tmpl = dptData[dp_type + '_dp_tmpl']; // ・ディレクトリパステンプレート

			for(var i in fields){
				var field = fields[i];
				var dp = dp_tmpl.replace('%field',field);
				if(dpData[field] == null) dpData[field] = {};
				dpData[field][dp_type] = dp;
			}
		}

		return dpData;
		
	}
	
	
	/**
	 * file要素idリストからフィールドリストを取得する
	 * @param array fuIds file要素idリスト
	 * @return array フィールドリスト
	 */
	_fueIdsToFields(fuIds){
		
		var fields = [];
		
		for(var i in fuIds){
			var fue_id = fuIds[i];
			var field = this._fudIdToField(fue_id); // file要素idからフィールドに変換する。
			fields.push(field);
		}
		
		fields = this._array_unique(fields); // 重複を除去する

		return fields;
	}
	
	/**
	 * file要素idからフィールドに変換する
	 * @param string fue_id file要素ID
	 * @return string フィールド
	 */
	_fudIdToField(fue_id){
		
		var field = fue_id; // フィールド
		if(fue_id == null) return field;
		if(fue_id.length < 3) return field;
		
		var es2 = field.slice(-2); // ディレクトリパスから末尾の2文字を取得する。
		
		
		if(es2 == '_n' || es2 == '_e'){
			var field = field.substr(0,field.length - 2);
		}
		
		return field;
	}
	
	
	/**
	* 配列から重複を除去する
	*/
	_array_unique(ary){
		var ary2= ary.filter(function (x, i, self) {
			return self.indexOf(x) === i;
		});
		
		return ary2;
	}
	


	/**
	 * 拡張ファイルアップロード・コンポーネントのファクトリーメソッド
	 * @param array fuIds file要素idリスト
	 * @param object option FileUploadK:addEventのoption
	 * @return FileUploadK 拡張ファイルアップロード・コンポーネント
	 */
	_factoryFileUploadK(fuIds,option){
		
		// 拡張ファイルアップロードクラスの生成
		var fileUploadK = new FileUploadK({
			'prog_slt':'#prog1',
			'err_slt':'#err',
			'valid_ext':'image',
			'img_width':120,
			'img_height':120,
			});
		
		
		// file要素を拡張
		for(var i in fuIds){
			var fue_id = fuIds[i];
			fileUploadK.addEvent(fue_id,option);
		}

		return fileUploadK;
		
	}
	
	
	
	/**
	 * ファイルアップロード関連のイベントを追加する。
	 * 
	 * @note
	 * ファイルチェンジイベントの追加。
	 * DnDイベントの追加
	 * 
	 * @param fue_id ファイルアップロード要素のid属性
	 * @param option 
	 *  - valid_ext バリデーション拡張子(詳細はconstructor()の引数を参照）
	 *  - pacb プレビュー後コールバック関数
	 *  - img_width プレビュー画像サイスX　（画像ファイルのみ影響）
	 *  - img_height プレビュー画像サイスY
	 */
	addEvent(fue_id,option){
		return this.fileUploadK.addEvent(fue_id,option);
	}
	
	
	/**
	 * ファイル群のパラメータデータを取得する
	 * @return object ファイル群のパラメータデータ
	 */
	getFileParams(){
		return this.fileUploadK.getFileParams();
	}
	
	
	/**
	 * AJAXによるアップロード
	 * 
	 * @param callback(res) ファイルアップロード後コールバック
	 * @param withData 一緒に送るデータ
	 * @param option 未使用
	 */
	uploadByAjax(callback,withData,option){
		return this.fileUploadK.uploadByAjax(callback,withData,option);
	}
	
	
	/**
	 * ファイル名リストを取得
	 * @param int fue_id ファイル要素のID属性値（省略可）
	 * @return array ファイル名リスト
	 */
	getFileNames(fue_id){
		return this.fileUploadK.getFileNames(fue_id);
	}
	
	
	/**
	 * file要素にファイルパスをセットする
	 * @param string fue_id file要素のid
	 * @param array fn ファイル名リスト（ ファイル名一つを文字列指定可）
	 * @param object option addEventのoptionと同じ
	 */
	setFilePaths(fue_id,fns,option){
		
		if(typeof fns == 'string'){
			fns = [fns];
		}
		
		
		var field = this._fudIdToField(fue_id); // file要素idからフィールドに変換する。
		var dp = this.dpData[field]['orig']; // ディレクトリパスを取得

		// ファイルパスリストを組み立て
		var fps = [];
		for(var i in fns){
			var fn = fns[i];
			var fp = this._joinDpFn(dp,fn); // ディレクトリとファイル名を連結してファイルパスを作成
			fps.push(fp);
		}
		
		// file要素にファイルパスをセットする
		this.fileUploadK.setFilePaths(fue_id,fps,option);
		
		var res = {'fps':fps};
		
		return res;
		
		
	}
	
	
	/**
	 * ディレクトリとファイル名を連結してファイルパスを作成
	 * 
	 * @note
	 * ディレクトリパス末尾のセパレータ有無を自動判別してファイルパスを作成する。
	 * 2種類のセパレータ,「/」と「\」に対応している。
	 *
	 * @param dp ディレクトリパス
	 * @param fn ファイル名
	 * @returns string ファイルパス
	 */
	_joinDpFn(dp,fn){
		
		var fp = ''; // ファイルパス
		
		// ディレクトリパスが空であるならファイル名をファイルパスとして返す。
		if(dp == null || dp == '' || dp == 0) return fn;
	
		var end_str = dp.slice(-1); // ディレクトリパスから末尾の一文字を取得する。
		
		// 末尾の一文字がセパレータである場合
		if(end_str == '/' || end_str == '\\'){
			fp = dp + fn;
		}
		
		// 末尾の一文字がセパレータでない場合
		else{
			
			// セパレータを取得
			var sep = '/';
			var i = dp.lastIndexOf('\\');
			if(i >= 0) sep = '\\';
			
			fp = dp + sep + fn;
		}
		
	
		return fp;
	}
	
	
	/**
	 * 画像をTR要素に表示する
	 * @param jQuery tr TR要素オブジェクト
	 * @param object ent データエンティティ
	 */
	setImageToTr(tr,ent){

		for(var i in this.fields){
			var field = this.fields[i];
			
			// TR要素からLabel要素を取得する。
			var lbl = tr.find("[for='" + field + "']");
			if(!lbl[0]) continue;
			var imgElm = lbl.find('img');
			if(imgElm[0]){
				
				var fn = ent[field]; // ファイル名
				
				// ファイル名が空である場合、空画像パスをセットする。
				if(fn == null || fn == ''){
					imgElm.attr('src',this.none_img_fp);
					var aElm = lbl.find('a');
					if(aElm[0]){
						aElm.attr('href',this.none_img_fp);
					}
					return;
				}

				var orig_dp = this.dpData[field]['orig']; // オリジナルディレクトリパス
				var orig_fp = this._joinDpFn(orig_dp,fn); // オリジナルファイルパス
				var thum_dp = this.dpData[field]['thum1']; // サムネイルディレクトリパス
				var thum_fp = this._joinDpFn(thum_dp,fn); // サムネイルファイルパス
				
				// IMG要素に画像を表示する。
				var imgObj = new Image();
				imgObj.src = thum_fp;
				imgObj.onload = () => {
					imgElm.attr('src',thum_fp);
				};

				// アンカー要素を取得し、オリジナルファイルパスをセットする。
				var aElm = lbl.find('a');
				if(aElm[0]){
					aElm.attr('href',orig_fp);
				}
				
			}
			
			
		}
			
	}
	
	
	/**
	 * FDにファイルオブジェクトをセットする
	 * @param FileData fd FD
	 * @parma string form_type フォーム種別 :new_inp,edit
	 * @return FileData FD
	 */
	setFilesToFd(fd,form_type){
		
		var box = this.fileUploadK.box;

		for(var fu_id in box){
			var fieldInfo = this._getFieldInfoFromFuKey(fu_id); // fu_keyからフィールドInfoを取得する
			if(fieldInfo.form_type != form_type) continue;
			
			var files = box[fu_id]['files']; // FDにセット予定のファイルオブジェクトを取得する
			if(files == null) continue;
			if(files[0] == null) continue;
			
			var fileData = box[fu_id]['fileData']; // エラーチェックのためにフィールドデータを取得 （フィールドデータにはFU要素やDnD由来のMIME,サイズ、ファイル名がセットされている。）
			if(fileData[0] == null) continue;
			
			var fEnt = fileData[0]; // フィールドエンティティを取得 (単一アップロードなので一行目のみ取得)
			if(fEnt.err_flg == false){ // エラーでない場合
				fd.append(fieldInfo.field, files[0]); // FDにファイルオブジェクトをセットする
			}

		}
		return fd;

	}
	
	/**
	 * fu_keyからフィールドInfoを取得する
	 * @param string fu_id
	 * @return フィールドInfo
	 */
	_getFieldInfoFromFuKey(fu_id){
		
		// フィールドInfoのデフォルト
		var fieldInfo = {
				'fu_id':fu_id,
				'field':fu_id,
				'form_type':'none',
		}
		
		if(fu_id == null || fu_id == '') return fieldInfo;
		if(fu_id.length < 3) return fieldInfo;
		
		var end_str = fu_id.slice(-2); // 末尾の2文字を取得
		if(end_str == '_n'){
			fieldInfo.form_type = 'new_inp';
			fieldInfo.field = fu_id.substr(0,fu_id.length-2); // 末尾の2文字を削る
		}else if(end_str == '_e'){
			fieldInfo.form_type = 'edit';
			fieldInfo.field = fu_id.substr(0,fu_id.length-2);
		}else{
			return fieldInfo;
		}
		
		return fieldInfo;
		
	}
	
	
	
}