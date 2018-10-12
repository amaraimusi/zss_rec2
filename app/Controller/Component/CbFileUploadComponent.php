<?php
App::uses('Component', 'Controller');

/**
 * CrudBaseに特化したファイルアップロード関連のコンポーネント
 *
 *
 * @note
 * FileUploadK.phpに依存している。
 * 新規入力、編集の際、アップロードしたファイルを所定場所に配置。
 * 画像であるならサムネイル画像も作成する。
 * 抹消機能は不要ファイルを削除する。
 *
 * @date 2018-8-22 | 2018-10-3
 * @version 1.0.2
 * @histroy
 * 1.0.2 2018-2018-10-3 ファイル名にidを付けない状態をデフォルトにする
 * 1.0.1 2018-9-16 アップロードファイルの拡張子は小文字で統一
 * 1.0.0 2018-8-22 開発
 *
 */
class CbFileUploadComponent extends Component{
	

	
	public function __construct($collection){
		parent::__construct($collection);

	}
	/**
	 * アップロードファイル名を変換する。
	 * @param array $ent 更新データのエンティティ
	 * @param array $FILES $_FILES
	 * @param option
	 *  - fu_field
	 *  - 	id_flg ファイル名にidを表示(デフォ:false) ※ 新規入力のときにidが取れない問題あり
	 *  - 	fn_flg ファイル名に元ファイル名を表示(デフォ:true)
	 *  - 	date_flg ファイル名に日付を表示(デフォ:false)
	 *  - 	time_flg ファイル名に時刻を表示(デフォ:false)
	 * @return array アップロードファイル名変換後のエンティティ
	 */
	public function convUploadFileName(&$ent,&$FILES,$option = array()){

		// ファイルアップロード・フィールドリストを取得する(ファイル名が空なら除去するフィルタリングも行う)
		$fuFields = $this->getFuFields($ent,$FILES);

		if(empty($fuFields)) return $ent;
		
		// オプションに初期値をセットする。
		foreach($fuFields as $fu_field){
			if(empty($option[$fu_field])) $option[$fu_field] = array();
			$opt = $option[$fu_field];
			if(!isset($opt['id_flg'])) $opt['id_flg'] = false;
			if(!isset($opt['fn_flg'])) $opt['fn_flg'] = true;
			if(!isset($opt['date_flg'])) $opt['date_flg'] = false;
			if(!isset($opt['time_flg'])) $opt['time_flg'] = false;
			$option[$fu_field] = $opt;
		}
		
		// ファイル名の組み立て
		foreach($fuFields as $fu_field){
			
			$fn = ''; // ファイル名
			$orig_fn = $ent[$fu_field]; // 元ファイル名
			$path_param = pathinfo($orig_fn);
			$ext = $path_param['extension'];	//→ 'jpg'
			$ext = mb_strtolower($ext); // 拡張は小文字にする
			$filename = $path_param['filename'];	//→ 'habu'
			
			$opt = $option[$fu_field];
			
			$part = array(); // ファイル名のパーツ
			if($opt['id_flg']){
				if(!empty($ent['id'])){
					$part[] = $ent['id'];
				}
			}
			if($opt['fn_flg']){
				$part[] = $filename;
			}
			if($opt['date_flg']){
				$date_str = $this->getDateFromEnt($ent,'Y-m-d');
				$part[] = $date_str;
			}
			if($opt['time_flg']){
				$time_str = $this->getDateFromEnt($ent,'His');
				$part[] = $time_str;
			}
				
			if(!empty($part)){
				$fn = implode('_',$part);
			}else{
				$fn = $filename;
			}
			$fn = $fn . '.' . $ext;
			
			$ent[$fu_field] = $fn;
			
		}
		
		return $ent;
		
	}
	
	/**
	 * ファイルアップロード・フィールドリストを取得する(ファイル名が空なら除去するフィルタリングも行う)
	 * @param array $ent 更新データのエンティティ
	 * @param array $FILES $_FILES
	 * @return array ファイルアップロード・フィールドリスト
	 */
	private function getFuFields(&$ent,&$FILES){
		
		$fuFields0 = array_keys($FILES); // ファイルアップロード・フィールドリストを取得する
		
		// フィルタリング：ファイル名が空なら除去
		$fuFields = array();
		foreach($fuFields0 as $fu_field){
			if(!empty($ent[$fu_field])){
				$fuFields[] = $fu_field;
			}
		}
		
		return $fuFields;
	}
	
	
	/**
	 * エンティティから日時文字列を取得する
	 * @param array $ent 更新データエンティティ
	 * @param string $format 日時フォーマット
	 */
	private function getDateFromEnt(&$ent,$format='Y-m-d'){
		
		$d2 = '';
		if(!empty($ent['modified'])){
			$d1 = $ent['modified'];
			$d2=date($format,strtotime($d1));
		}else{
			$d2=date($format);
		}
		
		return $d2;
	}
	
	
	
	/**
	 * 一括作業
	 * @param string $form_type フォーム種別  new_inp,edit,eliminate
	 * @param string $dp_tmpl リソース保存先・ディレクトリパス・テンプレート
	 * @param array $viaDpFnMap 経由パスマッピング
	 * @param array $ent 更新エンティティ
	 * @param array $FILES $_FILES
	 * @param array $option FileUploadK.php::workAllAtOnceのオプション設定
	 * @return array FileUploadK.php::workAllAtOnceのレスポンス
	 *
	 */
	public function workAllAtOnce($form_type,$dp_tmpl,$viaDpFnMap,&$ent,&$FILES,&$option = array()){
		
		$dpDatas = array(); // ファイル保管ディレクトリ情報
		if(!empty($option['dpDatas'])) $dpDatas = $option['dpDatas'];

		// ファイルアップロード・フィールドリストを取得する(ファイル名が空なら除去するフィルタリングも行う)
		$fuFields = $this->getFuFields($ent,$FILES);
		
		// ファイル保管ディレクトリ情報の未設定部分にデフォルト情報をセットしていく。
		foreach($fuFields as $fu_field){
			if(empty($dpDatas[$fu_field])) $dpDatas[$fu_field] = array();
			$dpData = $dpDatas[$fu_field];
			
			// ファイル名をセット
			if(empty($dpData['fn'])){
				$dpData['fn'] = $ent[$fu_field];
			}
			
			// オリジナルディレクトリパスをセット
			if(empty($dpData['orig_dp'])){
				
				// ディレクトリパスを組み立てる
				$dpData['orig_dp'] = $this->buildDp('orig', $fu_field, $dp_tmpl, $viaDpFnMap, $ent);
				
			}
			
			// ▼ サムネイルディレクトリパス関連の処理
			if(empty($dpData['thums'])){
				
				// サムネイル系のディレクトリパス組み立て
				$mid_dp = $this->buildDp('mid', $fu_field, $dp_tmpl, $viaDpFnMap, $ent);
				$thum_dp = $this->buildDp('thum', $fu_field, $dp_tmpl, $viaDpFnMap, $ent);
				
				$dpData['thums'] = array(
						0 => array(
								'thum_dp' => $thum_dp,
								'thum_width' => 64,
								'thum_height' => 64,
						),
						1 => array(
								'thum_dp' => $mid_dp,
								'thum_width' => 480,
								'thum_height' => null,
						),
				);
			}
			
			$dpDatas[$fu_field] = $dpData;
			
		}

		
		// ファイルアップロードの一括作業
		App::uses('FileUploadK','Vendor/Wacg/FileUploadK');
		$fileUploadK = new FileUploadK();
		$option['dpDatas'] = $dpDatas;
		$res = $fileUploadK->workAllAtOnce($FILES,$option);

		return $res;
		
	}
	

	/**
	 * ディレクトリパスを組み立てる
	 * @param string $dn ディレクトリ名
	 * @parma string $fu_field フィールド
	 * @param string $dp_tmpl リソース保存先・ディレクトリパス・テンプレート
	 * @param array $viaDpFnMap
	 * @param array $ent 経由パスマッピング
	 * @return string ディレクトリパス
	 */
	private function buildDp($dn, $fu_field, $dp_tmpl, &$viaDpFnMap, &$ent){
		$dp = $dp_tmpl;
		$dp = str_replace('%field' , $fu_field , $dp );
		$dp = str_replace('%dn' , $dn , $dp );
		
		// 経由ディレクトリパス部分を置換
		$via_dp = ''; // 経由ディレクトリパス
		if(!empty($viaDpFnMap[$fu_field])){
			$via_dp_field = $viaDpFnMap[$fu_field];
			$via_dp = $ent[$via_dp_field];
		}
		$dp = str_replace('%via_dp' , $via_dp , $dp );
		$dp = str_replace('//' , '/' , $dp );
		
		return $dp;
	}

	
	

}
