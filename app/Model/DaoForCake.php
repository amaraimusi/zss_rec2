<?php
App::uses('Model', 'Model');
App::uses('IDao', 'Vendor/Wacg');

/**
 * CakePHP用のDao
 *
 * @date 2018-5-31
 * @version 1.0
 *
 */
class DaoForCake extends AppModel implements IDao{
	
	public $useTable = false; // 特定のテーブルと関連づけない。
	
	public function sqlExe($sql){
		return $this->query($sql);
	}
}