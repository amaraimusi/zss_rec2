<?php

App::uses('AppController', 'Controller');

/**
 * CakePHPによるAjax認証
 * @date 2016-9-12 新規作成
 */
class AjaxLoginWithCakeController extends AppController {


	public function beforeFilter() {
		// login_checkアクションのみ認証と未認証の両方に対応したページする。
		$this->Auth->allow('login_check'); 
		parent::beforeFilter();
	}

	/**
	 * 認証状態を取得して返す。
	 * Ajaxで呼び出される。
	 */
	public function login_check() {

		$this->autoRender = false;//ビュー(ctp)を使わない。
		
		// 遷移元をセッションにセットする。
		$referer=$_SERVER['HTTP_REFERER'];
		$this->Session->write('ajax_login_with_cake_ses_key',$referer);
		
		// 認証状態を取得する
		$auth_flg = 0;
		if(!empty($this->Auth->user('id'))){
			$auth_flg = 1;//認証中
		}
		
		// レスポンス用JSONを作成
		$data=array('auth_flg'=>$auth_flg);
		$json_data=json_encode($data);//JSONに変換
		
		
		return $json_data;
	
	}
	
	
	/**
	 * ログイン画面を経由してリファラへリダイレクトで戻る
	 * 
	 * @note
	 * 未認証時にアクセスするとログイン画面へ遷移する。
	 * ログインすると当メソッドを実行し、リファラへリダイレクトで戻る。
	 */
	public function login_rap(){
		$this->autoRender = false;//ビュー(ctp)を使わない。
		
		// セッションから取り出したリファラへリダイレクトする。
		$referer=$this->Session->read('ajax_login_with_cake_ses_key');
		$this->redirect($referer);
		
		die;
	}
	
	
	
	
	
	
}
