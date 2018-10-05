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
	 * @param array $dptData ディレクトリパステンプレート・データ
	 * @return array 調整後のディレクトリパステンプレート・データ
	 */
	public function adjustDpt(&$dptData){
		
		foreach($dptData as &$dpt){
			$dpt = '../' . $dpt;
		}
		unset($dpt);
		
		return $dptData;
	}
	
	

}
