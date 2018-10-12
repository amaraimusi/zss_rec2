<?php
App::uses('Component', 'Controller');

/**
 * ネコ・フロントA画面のコンポーネント
 *
 *
 * @note
 * ネコ・フロントA画面専用の処理を記述する。
 *
 * @date 2018-10-4
 * @version 1.0.0
 * @histroy
 * 1.0.0 2018-10-4 新規作成
 *
 */
class NekoFrontAComponent extends Component{

	public function __construct($collection){
		parent::__construct($collection);
		

		
	}
	
	/**
	 * ディレクトリパステンプレートを調整する
	 * 
	 * @note
	 * ディレクトリパステンプレートは相対パスであるが、
	 * index用に合わせているためindex意外だとズレが生じる。
	 * そのため当メソッドでパスの調整をする。
	 * 
	 * @param array $dp_tmpl ディレクトリパス・テンプレート
	 * @return array 調整後のディレクトリパス・テンプレート
	 */
	public function adjustDpt(&$dp_tmpl){

		return '../' . $dp_tmpl;
	}
	
	

}
