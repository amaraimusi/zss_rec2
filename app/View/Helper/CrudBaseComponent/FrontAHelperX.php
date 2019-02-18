<?php

/**
 * フロントAページ用ヘルパー
 *
 * @version 1.2.0
 * @date 2018-10-8 | 2019-2-13
 * @author k-uehara
 *
 */
class FrontAHelperX{
	
	/**
	 * 初期化 | 拡張用
	 * @param array $option
	 *
	 */
	public function init($option = array()){
		
	}
	
	
	/**
	 * トップ・ページリンクボタンを作成する
	 * @param array $pages ページデータ
	 * @return string トップ・ページリンクボタンHTML
	 */
	public function topLinkBtn(&$pages){
		if($pages['all_page_cnt'] <= 1) return '';
		
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
		
		if($pages['all_page_cnt'] <= 1) return '';
		
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
		
		if($pages['all_page_cnt'] <= 1) return '';
		
		$url = $pages['page_next_link'];
		$disabled = '';
		if(empty($url)) $disabled = 'disabled';
		
		return "<a href='{$url}' class='btn btn-success' {$disabled} >次へ</a>";
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
	 * @param string $midway_dp 中間ディレクトリパス
	 * @param string $class_v class属性値
	 */
	public function tdImage(&$ent, $field, $midway_dp = '../', $class_v = 'td_line'){
		
		$fn = $ent[$field];
		
		if($fn == null || $fn == ''){
			echo "<td class='{$class_v}'></td>";
			return;
		}
		
		// ファイルパスを組み立てる
		$orig_fp = $midway_dp . $ent[$field];
		$mid_fp = $midway_dp . str_replace('/orig/', '/mid/', $ent[$field]);

		echo "
			<td class='{$class_v}'>
			<img class='{$field} img-responsive' src='{$mid_fp}' alt='{$mid_fp}' />
			<a href='{$orig_fp}' class='btn btn-link btn-xs' target='blank'>[拡大]</a>
			</td>
		";
		
	}
	
	/**
	 * イメージTD出力(シンプル）
	 * @note IMG要素に値をセットするのみ
	 * @param array $ent データのエンティティ
	 * @param string $field フィールド名
	 * @param string $class_v class属性値
	 */
	public function tdImageSimple(&$ent,$field,$class_v = 'td_line'){
		
		$fn = $ent[$field];
		
		if($fn == null || $fn == ''){
			echo "<td class='{$class_v}'></td>";
			return;
		}
		
		echo "
			<td class='{$class_v}'>
			<img class='{$field} img-responsive' src='{$fn}' />
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
	
	
	
	/**
	 * hidden TD要素出力
	 * @param array $ent データのエンティティ
	 * @param string $field フィールド
	 * @param string $class_v class属性値
	 */
	public function tdHidden(&$ent,$field,$class_v = 'td_line'){
		echo "<td class='{$class_v}'><input type='hidden' name='{$field}' value='{$ent[$field]}' />";
	}
	
	
	
	
	
	
	
	
	
	
}