<?php
App::uses('FormHelper', 'View/Helper');

/**
 * フロントAページ用ヘルパー
 * 
 * @version 1.0.0
 * @date 2018-10-4
 * @author k-uehara
 *
 */

class FrontAHelper extends Helper {

	private $data; 
	
	private $dptData; // ディレクトリパステンプレート・データ
	
	private $dps = array(); // ディレクトリパスデータ
	
	
	/**
	 * トップ・ページリンクボタンを作成する
	 * @param array $pages ページデータ
	 * @return string トップ・ページリンクボタンHTML
	 */
	public function topLinkBtn(&$pages){
		$url = $pages['page_top_link'];
		
		$disabled = '';
		if(empty($url)) $disabled = 'disabled';
		
		return "<a href='{$url}' class='btn btn-default' {$disabled} >トップ</a>";
	}
	
	/**
	 * 前へ・ページリンクボタンを作成する
	 * @param array $pages ページデータ
	 * @return string 前へ・ページリンクボタンHTML
	 */
	public function prevLinkBtn(&$pages){
		$url = $pages['page_prev_link'];
		
		$disabled = '';
		if(empty($url)) $disabled = 'disabled';
		
		return "<a href='{$url}' class='btn btn-default' {$disabled} >前へ</a>";
	}
	
	/**
	 * 前へ・ページリンクボタンを作成する
	 * @param array $pages ページデータ
	 * @return string 次へ・ページリンクボタンHTML
	 */
	public function nextLinkBtn(&$pages){
		$url = $pages['page_next_link'];
		
		$disabled = '';
		if(empty($url)) $disabled = 'disabled';
		
		return "<a href='{$url}' class='btn btn-success' {$disabled} >次へ</a>";
	}
	
	/**
	 * 初期化
	 * @param array $option
	 *  - data 
	 *  - dtpData ディレクトリパステンプレート・データ
	 *  
	 */
	public function init($option){
		
		$data = $option['data'];
		$dptData = $option['dptData'];
		
		// ディレクトリパステンプレート・データのキーをフォルダ名に変換する
		$dptData = $this->convKeyOfDptData($dptData);
		
		// ディレクトリパスデータの作成
		$this->dps = $this->makeDps($data,$dptData);

		$this->data = $data;
		$this->dptData = $dptData;

	}
	
	/**
	 * ディレクトリパステンプレート・データのキーをフォルダ名に変換する
	 * @param array $dptData ディレクトリパステンプレート・データ
	 * @return array キー変換後のディレクトリパステンプレート・データ
	 */
	private function convKeyOfDptData($dptData){
		
		$dptData2 = array();
		foreach($dptData as $dpt){
			// ディレクトリパステンプレートからキーを取得する
			$key2 = $this->getKeyFromDpt($dpt);
			$dptData2[$key2] = $dpt;
		}
		
		return $dptData2;
	}
	
	
	/**
	 * ディレクトリパステンプレートからキーを取得する
	 * @param string $dpt ディレクトリパステンプレート
	 * @return string キー
	 */
	private function getKeyFromDpt($dpt){
		$strs = explode("/",$dpt);
		$strs = array_reverse($strs);
		foreach($strs as $str){
			if(!empty($str)) return $str;
		}
		return '';
	}
	
	
	/**
	 * ディレクトリパスデータの作成
	 * @param array $data
	 * @param array $dptData ディレクトリパステンプレート・データ
	 * @return array ディレクトリパスデータ
	 */
	private function makeDps(&$data,&$dptData){
		
		$dps = array(); // ディレクトリパスデータ
		if(empty($data)) return $dps;
		
		// ▼ディレクトリパステンプレート・データとエンティティのキー（フィールド）からディレクトリパスデータを作成する。
		$ent = $data[0];
		foreach($ent as $field => $value){
			$dps[$field] = array();
			foreach($dptData as $key => $dpt){
				$dp = str_replace('%field' , $field , $dpt );
				$dps[$field][$key] = $dp;
			}
		}
		
		return $dps;
	}
	
	
	/**
	 * プレーンTD出力
	 * @param array $ent データのエンティティ
	 * @param string $field フィールド
	 * @param string $class_v class属性値
	 */
	public function tdPlain(&$ent,$field,$class_v = 'td_line'){
		echo "<td class='{$class_v}'><span class='{$field}'>" . $ent[$field] . '</span></td>';
	}
	
	/**
	 * 文字列TD出力（XSS対策有）
	 * @param array $ent データのエンティティ
	 * @param string $field フィールド
	 * @param string $class_v class属性値
	 */
	public function tdStr(&$ent,$field,$class_v = 'td_line'){
		echo "<td class='{$class_v}'><span class='{$field}'>" . h($ent[$field]) . '</span></td>';
	}
	
	
	/**
	 * リストTD出力（XSS対策有）
	 * @param array $ent データのエンティティ
	 * @param string $field フィールド名
	 * @param array $list リスト
	 * @param string $class_v class属性値
	 */
	public function tdList(&$ent,$field,&$list,$class_v = 'td_line'){
		
		$v = $ent[$field];
		$v2='';
		if(isset($list[$v])) $v2 = $list[$v];
		$v2 = h($v2);
		echo "<td class='{$class_v}'><span class='{$field}' data-value='{$v}' >{$v2}</span></td>\n";

	}
	
	/**
	 * イメージTD出力
	 * @param array $ent データのエンティティ
	 * @param string $field フィールド名
	 * @param string $class_v class属性値
	 */
	public function tdImage(&$ent,$field,$class_v = 'td_line'){
		
		$fn = $ent[$field];
		
		if($fn == null || $fn == ''){
			echo "<td class='{$class_v}'></td>";
			return;
		}
		
		$mid_dp = $this->dps[$field]['mid'];
		$mid_fp = $mid_dp . $fn;
		$orig_dp = $this->dps[$field]['orig'];
		$orig_fp = $orig_dp . $fn;
		
		echo "
			<td class='{$class_v}'>
			<img class='{$field} img-responsive' src='{$mid_fp}' alt='{$fn}' /><br>
			<a href='{$orig_fp}' class='btn btn-link btn-xs' target='brank'>[拡大]</a>
			</td>
		";
		
	}
	
	/**
	 * 長文TD要素出力
	 * @param array $ent データのエンティティ
	 * @param string $field フィールド名
	 * @param string $class_v class属性値
	 */
	public function tdNote(&$ent,$field,$class_v = 'td_line'){
		
		$v = $ent[$field];
		
		$v2='';
		if(!empty($v)){
			$v = h($v);

			$v= str_replace("\r\n", '<br>', $v);
			$v= str_replace("\n", '<br>', $v);
			$v= str_replace('\\', '', $v);
		}
		
		echo "<td class='{$class_v}'><div class='{$field}'  >{$v}</div></td>\n";
		
	}
	
	
}