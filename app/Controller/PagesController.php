<?php
App::uses('AppController', 'Controller');

/**
 * 管理者トップ
 * 
 * @version 2.0
 * @date 2014-8-21 | 2018-10-9
 * @history
 * 2014-8-21 新規作成
 * 2018-10-9 シンプル化
 * @author k-uehara
 *
 */
class PagesController extends AppController {
	public $name = 'Pages';
	public $uses = false;
	public $components=null;//ログイン認証不要
	public $logout_flg=false;//ログアウトリンクを非表示

    public function index() {
    	$this->autoRender = false;//ビューを使わない。
    	$home_url = $this->webroot . '?a=1';
    	echo 'Logout.<br>';
    	echo "<a href='{$home_url}'>To system home.</a>";
    }


}