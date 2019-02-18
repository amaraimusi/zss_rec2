<?php
App::uses('Model', 'Model');
App::uses('AppModel', 'Model');
App::uses('IDao', 'Vendor/CrudBase');

/**
 * CakePHP用のDao
 *
 * @date 2018-5-3 | 2019-1-8
 * @version 1.0.1
 *
 */
class DaoForCake extends AppModel implements IDao{
	
	public $useTable = false; // 特定のテーブルと関連づけない。
	
	public function sqlExe($sql){
		return $this->query($sql);
	}
	
	public function begin(){
		$dataSource = $this->getDataSource();
		$dataSource->begin();
	}
	
	public function rollback(){
		$dataSource = $this->getDataSource();
		$dataSource->rollback();
	}
	
	public function commit(){
		$dataSource = $this->getDataSource();
		$dataSource->commit();
	}
}