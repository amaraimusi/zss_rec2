<?php
App::uses('Model', 'Model');

/**
 * DB情報のモデルクラス
 * 
 * テーブル一覧やフィールド一覧を取得します。
 * 
 * @date 2015-12-9	新規作成
 * @author k-uehara
 *
 */
class DbInfo extends Model {


	///動作させるため、適当なテーブル名を指定
	public $name='User';

	/// バリデーションなし
	public $validate = null;

	/**
	 * テーブル一覧を取得
	 * @param string $dbName DB名
	 * @return array テーブル一覧
	 */
	public function getTblList($dbName){
		
		$sql="SHOW TABLES FROM {$dbName}";
		
		//SQLを実行してデータを取得
		$data=$this->query($sql);
		
		//構造変換
		if(!empty($data)){
			$data=Hash::extract($data, '{n}.TABLE_NAMES.Tables_in_'.$dbName);
		}
		
		return $data;
	}
	
	
	
	
	/**
	 * テーブル名からフィールドデータを取得する
	 * 
	 * @param string $tbl テーブル名
	 * @return array フィールドデータ
	 */
	public function getFieldData($tbl){
		$sql="SHOW FULL COLUMNS FROM {$tbl}";
		
		//SQLを実行してデータを取得
		$data=$this->query($sql);
		
		//構造変換
		if(!empty($data)){
			$data=Hash::extract($data, '{n}.COLUMNS');
		}

		return $data;
	}




}