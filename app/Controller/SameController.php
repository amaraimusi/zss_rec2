<?php
App::uses('AppController', 'Controller');

/**
 * サメファイル読込
 * 
 * @date 2016-3-8 新規作成
 * @author k-uehara
 *
 */
class SameController extends AppController {
	public $name = 'same';

	/**
	 * 初期表示
	 */
	function index() {

		$this->set(array (
    			'title_for_layout'=>'サメファイル読込',
		));
	}

	/**
	 * ファイルアップロードAjax
	 * 
	 * ユーザーがファイルアップロードをしたときに呼び出されるAjax処理。
	 * 
	 * @return string jsonデータ
	 */
	function ajax() {

		$this->autoRender = false;//ビュー(ctp)を使わない。
		
		if(empty($_FILES["file1"])){
			return 'error:ファイルアップロードに失敗しました。';
		}

		//一時ファイル名。すぐに消えるので、どこかに配置する必要がある場合はコピーする。
		//$tmpFn=$_FILES["file1"]["tmp_name"];

		$json=json_encode($_FILES["file1"]);
		

		return $json;

	}



}