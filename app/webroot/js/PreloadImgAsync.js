/**
 * 非同期型画像プリロード
 * 
 * @date 2017-10-5
 * @version 1.0
 * @auther kenji uehara
 * 
 */
var PreloadImgAsync =function(){

	this.fileData; // ファイルデータ
	
	this.readed_count = 0; // 読了カウンター： Number of image files read.
	
	this.next_index = 0; // 次インデックス
	

	var self=this; // Instance of self.

	/**
	 * initialized.
	 */
	this.constract=function(){

	};
	

	
	
	/**
	 * 非同期で画像のプリロード開始
	 * 
	 * @param fileData : ファイルデータ
	 *  - [][img_fp,last_update_date]
	 *   - img_fp 画像ファイルパス
	 *   - last_update_date 画像の最終更新日時
	 *   
	 * @param callbackOne(index,fEnt) 単画像読了コールバック:
	 *  → １つの画像の読み込み（プリロード）が終わるたびに呼び出されるコールバッグ
	 *  - index ファイルデータのインデックス
	 *  - fEnt ファイルデータのエンティティ
	 *  
	 * @param callbackAll(fileData) 全画像読了コールバック:
	 *  → 全画像の読み込みが終わったら呼び出されるコールバッグ
	 *  - fileData ファイルデータ
	 *  
	 * @param option
	 *  - first_index: 初回インデックス： 初回インデックスはファイルデータのインデックスであり、最初に読み込む画像を決定づけるものである。（省略時は0）
	 */
	function onload(fileData,callbackOne,callbackAll,option){
		
		if(_empty(fileData)){return;}
		
		// オプションの初期セット
		if(option == null){option = {};}
		if(option['first_index'] == null){
			option['first_index'] = 0;
		}

		for(var i in fileData){
			var fEnt = fileData[i];
			
			if(fEnt['last_update_date'] == null){
				fEnt['last_update_date'] = new Date().getTime();
			}
			
			// 最終更新日付から半角スペースや一部の記号を除去する
			fEnt.last_update_date = _slimLastUpdateDate(fEnt.last_update_date);

		}
		
		self.fileData = fileData;
		
		// 次インデックスに初回インデックスをセット
		self.next_index = option.first_index;
		
		// 単画像プリロード開始
		
		//　非同期で、単画像プリロード開始
		window.setTimeout(function(){
			_onloadOne(self.next_index,callbackOne,callbackAll);
		}, 1);
		
		

	}
	this.onload = function(fileData,callbackOne,callbackAll,option){
		onload(fileData,callbackOne,callbackAll,option);
	}
	
	
	/**
	 * 単画像プリロード開始
	 * @param index ファイルデータのインデックス
	 * @param callbackOne(index,fEnt) 単画像読了コールバック
	 * @param callbackAll(fileData) 全画像読了コールバック
	 */
	function _onloadOne(index,callbackOne,callbackAll){

		var fEnt = self.fileData[index];

		// 画像オブジェクトに画像ファイルパスをセットする
		var src = fEnt.img_fp + '?' + fEnt.last_update_date;
		var img1 = new Image();
		img1.src = src; // セットしたタイミングで画像プリロード開始する。プリロードが完了すると下記のonloadイベント、onerrorイベントのいずれかが発動する。
		
		
		img1.onload = function(e){
			
			var err_flg = 0; // エラーなしをセット
			
			// プリロード後の処理を引き受ける
			var next_index = _receiver(img1,index,err_flg,callbackOne,callbackAll);

			// 次のインデクスが終了（-1)でなければ、再起呼び出しを行う。
			if(next_index != -1){
				_onloadOne(next_index,callbackOne,callbackAll)
			}
		}
		
		img1.onerror = function() { 
			
			var err_flg = 1; // エラー有をセット
			
			// プリロード後の処理を引き受ける
			var next_index = _receiver(img1,index,err_flg,callbackOne,callbackAll);

			// 次のインデクスが終了（-1)でなければ、再起呼び出しを行う。
			if(next_index != -1){
				_onloadOne(next_index,callbackOne,callbackAll)
			}
		} 
		

	}
	
	

	/**
	 * Receive onload or error.
	 * And after loading all image files, execute callback.
	 * 
	 * @param img1 画像オブジェクト
	 * @param index ファイルデータのインデックス
	 * @param err_flg :  0:success  1:error
	 * @param callbackOne(index,fEnt) 単画像読了コールバック
	 * @param callbackAll(fileData) 全画像読了コールバック
	 * 
	 */
	function _receiver(img1,index,err_flg,callbackOne,callbackAll){
		self.readed_count ++;
		
		// ファイルデータに画像オブジェクトとエラーフラグをセットする
		var fileData = self.fileData;
		var fEnt = fileData[index];
		fEnt['img1'] = img1;
		fEnt['err_flg'] = err_flg;
		fEnt['readed'] = 1;
		
		// 単画像読了コールバックを実行する
		if(typeof callbackOne == 'function'){
			callbackOne(index,fEnt);
		}
		
		// 読了カウンターがファイルデータ数と一致する場合
		if(self.readed_count == fileData.length){

			if(typeof callbackAll == 'function'){
				callbackAll(fileData);
			}
			return -1; // 次インデックスは終了を表す-1を返す。
		}
		
		// 次インデックスを取得する
		var next_index = _getNextIndex();

		return next_index;
	
	}
	
	
	
	/**
	 * 次インデックスを取得する
	 * @returns 次インデックス
	 */
	function _getNextIndex(){
		
		var fileData = self.fileData; // ファイルデータ
		var fd_len = fileData.length; // データ数
		
		var i = self.next_index; // 探索インデックス
		
		var start_i = i; // スタートインデックス

		var next_index = -1; // 次インデックス
		
		// ファイルデータを回して次インデックスを探し出す
		while (i < 1000000){

			var fEnt = fileData[i];
			
			// 読了フラグがnullなら、探索インデックスを次インデックスとして処理抜け
			if(fEnt['readed'] == null){
				next_index = i;
				break;
			}

			i++;
			if(i == fd_len){

				i = 0;
			}
			
			// 一周してスタートインデックスに戻った場合、処理抜け
			if(i == start_i){

				break;
			}
			
		}

		self.next_index = next_index;
		return next_index;

	}
	
	
	
	/**
	 * 最終更新日付から半角スペースや一部の記号を除去してスリム化する
	 * 
	 * @param last_update_date 最終更新日時
	 * @return last_update_date スリム化した最終更新日時
	 */
	function _slimLastUpdateDate(last_update_date){
		
		if(last_update_date){
			last_update_date = last_update_date.replace(/ /g, '').replace(/-/g, '').replace(/:/g, '').replace(/\//g, '');
		}
		return last_update_date;
		
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
};