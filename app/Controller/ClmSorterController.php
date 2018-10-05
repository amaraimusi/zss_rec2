<?php


/**
 * 列並替画面
 * 
 * @date 2016-1-20	新規作成
 * @author k-uehara
 */
class ClmSorterController extends AppController {

	
	public $name = 'ClmSorter';

	/// 使用しているモデル
	public $uses = array('CrudBase');
    
	public function index() {
		
		if(empty($this->request->query['p'])){
			echo 'NO PAGE';
			die();
		}
		
		//列表示配列を取得する
		$csh_u = $this->request->query['csh_u'];
		$csh_json = urldecode($csh_u);
		$csh_ary=json_decode($csh_json,true);//列表示配列

		//ページコードをURLクエリ（GET）から取得する。
		$page_code=$this->request->query['p'];
		
		//セッションからフィールドデータおよびアクティブフィールドデータを取得する。
		$ses_key=$page_code.'_sorter_field_data';//セッションキー
		$field_data = $this->Session->read($ses_key);
		$active=$field_data['active'];
		
		//アクティブフィールドデータに列情報配列をマージする。
		$active = $this->mergeCshAry($active,$csh_ary);
		
		//戻りURL
		$rtn_url = $this->webroot . $page_code;

		
		$this->set(array(
				'active'=>$active,
				'page_code'=>$page_code,
				'rtn_url'=>$rtn_url
				));
		
	}
	
	
	
	/**
	 * フィールドデータ適用   | Ajax
	 * 
	 * 並べ替えられたフィールド適用を適用します。
	 * 
	 * @return string jsonレスポンス
	 */
	public function ajax_ok(){

		$this->autoRender = false;//ビュー(ctp)を使わない。
	
		//AJAX送信されてきたパラメータを取得する
		$json_param=$_POST['key1'];
		$json_param=str_replace('\\','',$json_param);//PHPバージョンによってはバックスラッシュを除去しないとJSONエンコードできない。
		$param=json_decode($json_param,true);
		

		//パラメータから並替後フィールドデータを取得する。
		$p_field_data = $param['field_data'];

		//パラメータからページコードを取得し、セッションキーを作成する。
		$page_code = $param['page_code'];
		$ses_key=$page_code.'_sorter_field_data';//セッションキー
		
		//セッションキーを渡してセッションからフィールドデータを取得する。
		$field_data = $this->Session->read($ses_key);
		
		//フィールドデータに列並替変更フラグ=1をセット（列表示切替機能へ通知するため）
		$field_data['clm_sort_chg_flg'] = 1;
		
		//フィールドデータに並替後フィールドデータをアクティブフィールドデータとしてセットし、セッションへ書き込み。
		$field_data['active'] = $p_field_data;
		$this->Session->write($ses_key,$field_data);
		
		// フィールドデータが空でなければ、フィールドデータから一覧列情報を作成し、セッションに保存する。
		$table_fields = $this->CrudBase->makeTableFieldFromFieldData($field_data);
		$tf_ses_key = $page_code.'_table_fields';
		$this->Session->write($tf_ses_key,$table_fields);
	
		//レスポンス処理
		$res_flg='success';
		$res=array(
				'res_flg'=>$res_flg,
		);
		$json=json_encode($res);
	
		return $json;
	}
	
	
	
	/**
	 * 初期化ボタンアクション
	 * 
	 */
	/**
	 * 初期化ボタンアクション   | Ajax
	 *
	 * 初期の列並びに戻します。
	 *
	 * @return string jsonレスポンス
	 */
	public function def_btn(){

		$this->autoRender = false;//ビュー(ctp)を使わない。
		
		//AJAX送信されてきたパラメータを取得する
		$json_param=$_POST['key1'];
		$json_param=str_replace('\\','',$json_param);
		$param=json_decode($json_param,true);

		//パラメータからページコードを取得し、セッションキーを作成する。
		$page_code = $param['page_code'];
		$ses_key=$page_code.'_sorter_field_data';//セッションキー
		
		//セッションキーを渡してセッションからフィールドデータを取得する。
		$field_data = $this->Session->read($ses_key);
		
		//defをアクティブフィールドデータとして取得
		$active=$field_data['def'];
			
		//列並番号でアクティブフィールドデータを並び替えながらデータ構造を行い、セッションに再セットする。
		$active=$this->CrudBase->sortAndCombine($active);
		$field_data['active']=$active;
		$this->Session->write($ses_key,$field_data);

		//レスポンス処理
		$res_flg='success';
		$res=array(
				'res_flg'=>$res_flg,
		);
		$json=json_encode($res);
		
		return $json;
	}
	
	
	
	/**
	 * アクティブフィールドデータに列情報配列をマージする。
	 * @param array $active アクティブフィールドデータ
	 * @param array $csh_ary 列情報配列
	 * @return array マージ後のアクティブフィールドデータ
	 */
	private function mergeCshAry($active,$csh_ary){
		
		$i=0;
		foreach($active as &$ent){
			$ent['clm_show'] = $csh_ary[$i];
			$i++;
		}
		unset($ent);
		
		return $active;
	}
	
	
	
	
	
	
	

}