<?php

/**
 * CrudBase FileUpload Helper Component.
 * CrudBase用ファイルアップロード・ヘルパーコンポーネント
 *
 * @version 1.0
 * @date 2018-8-23
 * @history
 *  2018-8-23 開発着手
 *
 */
class CbFileUploadHComp{
	
	private $dptData; // ディレクトリパステンプレート情報
	private $origDps = array(); // オリジナルディレクトリパスリスト
	private $thumDps = array(); // サムネイルディレクトリパスリスト
	
	
	public function __construct($dptData){
		
		$this->dptData = $dptData;
		
	}
	
	
	/**
	 * サムネイル画像のTD要素を出力。（オリジナル画像へのリンクあり）
	 * @param array $ent エンティティ
	 * @param string $field ﾌｨｰﾙﾄﾞ
	 * @param array $option
	 *  - orig_dp オリジナル・ディレクトリパス
	 *  - thum_dp サムネイル・ディレクトリパス
	 *  - cash_flg 0:キャッシュから読み込む（デフォ） , 1:キャッシュから読み込まない
	 *  - no_img_fp 画像ファイルが存在しないときに表示する画像パス
	 *  - td_type TDタイプ     省略:通常版  , lity:Lity.Js版
	 */
	public function tdImage(&$ent,$field,&$option = array()){
		
		$fn = $ent[$field];
		
		$orig_fp = '';
		$thum_fp = '';
		
		// ファイル名が空である場合のファイルパス作成
		if(empty($fn)){
			if(empty($option['no_img_fp'])){
				$orig_fp = 'img/icon/none.gif';
				$thum_fp = 'img/icon/none.gif';
			}else{
				$orig_fp = $option['no_img_fp'];
				$thum_fp = $option['no_img_fp'];
			}
		}
		
		// ファイル名が空でない場合のファイルパス作成
		else{
			
			// オリジナルディレクトリパス
			if(empty($this->origDps[$field])){
				$orig_dp = $this->dptData['orig_dp_tmpl'];
				$orig_dp = str_replace('%field' , $field , $orig_dp );
				$this->origDps[$field] = $orig_dp;
			}else{
				$orig_dp = $this->origDps[$field];
			}
			$orig_fp = $orig_dp . $fn;

			// サムネイルディレクトリパス
			if(empty($this->thumDps[$field])){
				$thum_dp = $this->dptData['thum1_dp_tmpl'];
				$thum_dp = str_replace('%field' , $field , $thum_dp );
				$this->thumDps[$field] = $thum_dp;
			}else{
				$thum_dp = $this->thumDps[$field];
			}
			$thum_fp = $thum_dp . $fn;
			

		}

		// キャッシュフラグがＯＮである場合、画像ファイルをキャッシュから読み込まないよう日時を付け足す。
		if(!empty($option['cash_flg'])){
			$dt = '?'.date('Ymdhis');
			$orig_fp .= $dt;
			$thum_fp .= $dt;
		}
		
		// 組み立て
		$td_html = '';
		if(empty($option['td_type'])){
			$td_html = "<td>
				<input type='hidden' name='{$field}' value='{$fn}' />
				<label for='$field'>
				<a href='{$orig_fp}' target='blank' />
				<img src='{$thum_fp}' title='{$fn}' />
				</a>
				</label>
				</td>";
			
		}
		
		// Lity版
		else if($option['td_type'] == 'lity'){
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
	
	
}