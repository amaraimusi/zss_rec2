<?php


App::uses('AppController', 'Controller');


/**
 * 認証不要ページのテスト
 * 
 * @date 2016-5-13 検証
 * 
 * @author k-uehara
 *
 */
class NoAuthController extends AppController {
	
	public $name = 'NoAuth';
	
	public function beforeFilter() {
		$this->Auth->allow(); // 認証と未認証の両方に対応したページする。
		parent::beforeFilter();//基本クラスのメソッドを呼び出し。
	}

	
    public function ajax_auth(){

    }
    
    public function ajax_auth_test1(){
    	
    	$this->autoRender = false;//ビュー(ctp)を使わない。
    	
    	// ★認証状態の確認
    	if(empty($this->Auth->user('id'))){
    		return '認証されていません';
    	}
    	
    	$json_param=$_POST['key1'];

    	return $json_param;
    }
	
    
    

    public function judge_auth() {
    	$msg="認証されていません。";
    	if(!empty($this->Auth->user('id'))){
    		$msg = "認証中です。";
    	}
    	$this->set(array('msg'=>$msg));
    }
    
    
    
    
    public function index(){
    	
    }

}