<?php

/**
 * CrudBase FileUpload Helper Component.
 * CrudBase用ファイルアップロード・ヘルパーコンポーネント
 *
 * @version 1.1
 * @date 2018-8-23 | 2018-10-9
 * @history
 *  2018-10-9 v1.1 経由ディレクトリパスに対応
 *  2018-8-23 v1.0 開発着手
 *
 */
class CbFileUploadHComp{
	
	private $dp_tmpl; // リソース保存先・ディレクトリパス・テンプレート
	private $viaDpFnMap; // 経由パスマッピング
	private $origDps = array(); // オリジナルディレクトリパスリスト
	private $thumDps = array(); // サムネイルディレクトリパスリスト
	private $tdImageOption = array(); // 画像TD要素出力のオプション
	
	
	/**
	 * コンストラクタ
	 * @param string $dp_tmpl リソース保存先・ディレクトリパス・テンプレート
	 * @param array $viaDpFnMap 経由パスマッピング
	 */
	public function __construct($dp_tmpl, $viaDpFnMap){
		
		$this->dp_tmpl = $dp_tmpl;
		$this->viaDpFnMap = $viaDpFnMap;
	}
	
	
	/**
	 * 画像TD要素出力オプションの初期化
	 *
	 * @note
	 * tdImageメソッドと連動
	 *
	 * @param array $option
	 *  - cash_flg 0:キャッシュから読み込む（デフォ） , 1:キャッシュから読み込まない
	 *  - no_img_fp 画像ファイルが存在しないときに表示する画像パス
	 *  - td_type TDタイプ     省略:通常版  , lity:Lity.Js版
	 */
	public function initTdImageOption($tdImageOption = array()){
		if(empty($tdImageOption['cash_flg'])) $tdImageOption['cash_flg'] = 0;
		if(empty($tdImageOption['no_img_fp'])) $tdImageOption['no_img_fp'] = 'img/icon/none.gif';
		if(empty($tdImageOption['td_type'])) $tdImageOption['td_type'] = null;
		$this->tdImageOption = $tdImageOption;
	}
	/**
	 * 画像TD要素出力
	 * 
	 * @note
	 * オリジナル画像へのリンクあり
	 * 
	 * @param array $ent エンティティ
	 * @param string $field ﾌｨｰﾙﾄﾞ
	 * 
	 */
	public function tdImage(&$ent,$field){
		
		// 画像TD要素出力オプションの初期化
		if(empty($this->tdImageOption)) $this->initTdImageOption();
		
		$fn = $ent[$field];
		
		$orig_fp = '';
		$thum_fp = '';
		
		// ファイル名が空である場合のファイルパス作成
		if(empty($fn)){
			$orig_fp = $this->tdImageOption['no_img_fp'];
			$thum_fp = $this->tdImageOption['no_img_fp'];
		}
		
		// ▼ ファイル名が空でない場合のファイルパス作成
		else{
			
			// ▼ オリジナルディレクトリパスの作成および取得
			if(empty($this->origDps[$field])){
				
				$orig_dp = $this->dp_tmpl;
				$orig_dp = str_replace('%field' , $field , $orig_dp );
				$orig_dp = str_replace('%dn' , 'orig' , $orig_dp );
				$this->origDps[$field] = $orig_dp;
				
			}else{
				$orig_dp = $this->origDps[$field];
			}
			
			// ディレクトリパスの経由ディレクトリパス部分を置換する
			$orig_dp = $this->replaceViaDp($orig_dp,$field,$ent);

			$orig_fp = $orig_dp . $fn;

			// ▼ サムネイルディレクトリパスの作成および取得
			if(empty($this->thumDps[$field])){
				$thum_dp = $this->dp_tmpl;
				$thum_dp = str_replace('%field' , $field , $thum_dp );
				$thum_dp = str_replace('%dn' , 'thum' , $thum_dp );
				$this->thumDps[$field] = $thum_dp;
				
			}else{
				$thum_dp = $this->thumDps[$field];
			}
			
			// ディレクトリパスの経由ディレクトリパス部分を置換する
			$thum_dp = $this->replaceViaDp($thum_dp,$field,$ent);
			
			$thum_fp = $thum_dp . $fn;
			

		}

		// キャッシュフラグがＯＮである場合、画像ファイルをキャッシュから読み込まないよう日時を付け足す。
		if(!empty($this->tdImageOption['cash_flg'])){
			$dt = '?'.date('Ymdhis');
			$orig_fp .= $dt;
			$thum_fp .= $dt;
		}
		
		// 組み立て
		$td_html = '';
		if(empty($this->tdImageOption['td_type'])){
			$td_html = "<td>
				<input type='hidden' name='{$field}' value='{$fn}' />
				<label for='$field'>
				<a href='{$orig_fp}' target='brank' />
				<img src='{$thum_fp}' title='{$fn}' />
				</a>
				</label>
				</td>";
			
		}
		
		// Lity版
		else if($this->tdImageOption['td_type'] == 'lity'){
			$td_html = "<td>
				<input type='hidden' name='{$field}' value='{$fn}' />
				<label for='$field'>
				<a href='{$orig_fp}' data-lity='data-lity' />
				<img src='{$thum_fp}' data-file-preview = '{$field}' class='{$field}_display' title='{$fn}' />
				</a>
				</label>
				</td>";
		}
		
		return $td_html;
		
		
	}
	
	
	/**
	 * ディレクトリパスの経由ディレクトリパス部分を置換する
	 * @param string $dp ディレクトリパス
	 * @param string $field 
	 * @param array $ent データのエンティティ
	 * @return string 置換後のディレクトリパス
	 */
	private function replaceViaDp($dp,$field,&$ent){
		
		// ▼ 経由ディレクトリパスを取得する
		$via_dp = ''; //  経由ディレクトリパス
		if(!empty($this->viaDpFnMap[$field])){
			$via_dp_field = $this->viaDpFnMap[$field];
			$via_dp = $ent[$via_dp_field];
		}
		
		$dp = str_replace('%via_dp' , $via_dp , $dp );
		$dp = str_replace('//' , '/' , $dp );
		
		return $dp;

	}
	
	
}