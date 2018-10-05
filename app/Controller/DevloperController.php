<?php
App::uses('AppController', 'Controller');

/**
 * 開発者用隠しページのコントローラー
 * 
 * 何らかのバグがあったときの調査用として活用します。
 * 
 * 開発者用ですが、ログインできるユーザーはこの画面を閲覧できます。
 * ですので新しく調査用の画面を作る場合、セキュリティ的に危険なものは作っていけません。
 * 
 * @date 2015-9-25	新規作成
 * @date 2015-12-9	db_infoを追加
 * @author k-uehara
 *
 */
class DevloperController extends AppController {
	
	///名称コード
	public $name = 'Devloper';
	
	///使用しているモデル
	public $uses = array ('Devloper');

	/**
	 * 目次アクション
	 * 
	 * 何も処理はありません。ビュー側に各調査画面への目次リンクがあります。
	 */
	public function index() {

	}


	/**
	 * 
	 * PHP環境情報表示アクション
	 * 
	 * phpinfoによるPHP環境情報を表示します。
	 * 
	 */
	function php_info() {

		
	}

	
	/**
	 * DB情報を表示する
	 */
	function db_info(){
		
		if(empty($this->DbInfo)){
			App::uses('DbInfo','Model');
			$this->DbInfo=new DbInfo();
		}
		
		//DB名
		$db_name="cake_demo";
		if($_SERVER['SERVER_NAME'] == 'amaraimusi.sakura.ne.jp'){
			$db_name="amaraimusi_cake_demo";
		}

		// テーブル一覧を取得
		$tblList=$this->DbInfo->getTblList($db_name);
		
		//フィールド情報の取得
		$fieldData2=array();//フィールド情報2
		foreach($tblList as $tbl){
			
			//テーブル名からフィールドデータを取得してフィールド情報2に追加する。
			$fieldData=$this->DbInfo->getFieldData($tbl);
			$fieldData2[]=$fieldData;
		}
		
		
		
		
		$this->set(array(
				'tblList'=>$tblList,
				'fieldData2'=>$fieldData2,
		));
		
	}

	


}