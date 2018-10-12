<?php
App::uses('FormHelper', 'View/Helper');

/**
 * フロントAページ用ヘルパー
 * 
 * @version 1.0.1
 * @date 2018-10-8
 * @author k-uehara
 *
 */

class FrontAHelper extends Helper {

	private $data; 
	private $dp_tmpl; // ディレクトリパステンプレート・データ
	private $viaDpFnMap; // 経由パスマッピング

	
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
	 *  - dp_tmpl ディレクトリパステンプレート
	 *  
	 */
	public function init($option){
		
		$data = $option['data'];
		$dp_tmpl = $option['dp_tmpl'];
		$viaDpFnMap = $option['viaDpFnMap'];

		$this->data = $data;
		$this->dp_tmpl = $dp_tmpl;
		$this->viaDpFnMap = $viaDpFnMap;

	}
	
	
	
	/**
	 * ディレクトリパスデータの作成
	 * @param array $data
	 * @param array $dp_tmpl ディレクトリパステンプレート・データ
	 * @return array ディレクトリパスデータ
	 */
	private function makeDps(&$data,&$dp_tmpl){
		
		$dps = array(); // ディレクトリパスデータ
		if(empty($data)) return $dps;
		
		// ▼ディレクトリパステンプレート・データとエンティティのキー（フィールド）からディレクトリパスデータを作成する。
		$ent = $data[0];
		foreach($ent as $field => $value){
			$dps[$field] = array();
			foreach($dp_tmpl as $key => $dpt){
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
		
		// ファイルパスを組み立てる
		$orig_fp = $this->buildFp('orig', $ent, $field);
		$mid_fp = $this->buildFp('mid', $ent, $field);

		echo "
			<td class='{$class_v}'>
			<img class='{$field} img-responsive' src='{$mid_fp}' alt='{$fn}' />
			<a href='{$orig_fp}' class='btn btn-link btn-xs' target='blank'>[拡大]</a>
			</td>
		";
		
	}
	
	
	/**
	 * ファイルパスを組み立てる
	 * @param string $dn ディレクトリ名
	 * @param array $ent データのエンティティ
	 * @param string $field フィールド
	 * @return string ファイルパス
	 */
	private function buildFp($dn, &$ent, $field){
		
		// ▼ ディレクトリパス・テンプレートのフィールド名、フォルダ名部分を置換する。
		$fp = $this->dp_tmpl;
		$fp = str_replace('%field', $field, $fp);
		$fp = str_replace('%dn', $dn, $fp);
		
		// ▼ 経由パス部分を置換する
		$via_dp = '';
		if(!empty($this->viaDpFnMap[$field])){
			$via_dp_field = $this->viaDpFnMap[$field];
			$via_dp = $ent[$via_dp_field];
		}
		
		$fp = str_replace('%via_dp', $via_dp, $fp);
		$fp = str_replace('//', '/', $fp);
		
		$fp .= $ent[$field]; // ファイル名を連結
		
		return $fp;
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