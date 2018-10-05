<?php
App::uses('Controller', 'Controller');

/**
 * CakePHP標準基本コントローラ
 *
 */
class AppController extends Controller {
    public $uses = array();

    public $components = array(
        'Session',
        'Auth' => array(
            'loginRedirect' => array('controller' => 'pages', 'action' => 'index'),
            'logoutRedirect' => array('controller' => 'pages', 'action' => 'index')
        )
    );

	function _listExport($listName, $listData) {
		if (!empty($listData)) {
			$str = '<?php Configure::write(\'' .  $listName . '\', ' . var_export($listData, true) . ');';
	        $handle = fopen('../../app/Config/datas/' . $listName . '.php', "w");
	        fputs($handle, $str);
	        fclose($handle);
		}
	}

	public function beforeFilter(){
		

		
		// ■■■□□□■■■□□□■■■□□□一時的なバグ回避
		if(empty($role)){
			$role="developer";
		}
		
		$this->set('role',$role);
	}

	/**
	 * OPチャット設定情報をセッションから取得する。
	 * 
	 * @note
	 * セッション中に存在しなければデフォルトを取得。
	 * @return チャット設定情報
	 */
    protected function getOpChatConfig(){
    	$chatConfig=$this->Session->read('shch_chat_config');
    	if(empty($chatConfig)){
    		$chatConfig=Configure::read('chatConfig');
    	}
    	
    	
    	return $chatConfig;
    }
    
 
    
    
    /**
     * 拡張デバッグモードを取得する
     *
     * 拡張デバッグモードは通常のデバッグモードと同じ値を取得するが、
     * ホストがテスト用サーバーまたはローカルホストである場合、デバッグモードを0とする。
     *
     */
    protected function getDebugModeEx(){
    	 
    	$debug_mode_ex=0;
    	 
    	switch ($_SERVER['SERVER_NAME']) {
    		case '192.168.11.199'://社内LAN環境
    			 
    			$debug_mode_ex=Configure::read('debug');
    			break;
    
    		case 'localhost'://ローカル環境
    			 
    			$debug_mode_ex=Configure::read('debug');
    			break;
    	}
    	 
    	return $debug_mode_ex;
    	 
    	 
    }
    
    
    
	// 更新ユーザーなど共通フィールドをデータにセットする。
	protected function setCommonToData($data){
	
		// 更新ユーザー
		$update_user = $this->Auth->user('username');
		
		// ユーザーエージェント
		$user_agent = $_SERVER['HTTP_USER_AGENT'];
		$user_agent = mb_substr($user_agent,0,255);
	
		// IPアドレス
		$ip_addr = $_SERVER["REMOTE_ADDR"];
	
		// 本日
		$today = date('Y-m-d H:i:s');
	
		// データにセットする
		foreach($data as $i => $ent){
				
			$ent['update_user'] = $update_user;
			$ent['user_agent'] = $user_agent;
			$ent['ip_addr'] = $ip_addr;
				
			// idが空（新規入力）なら生成日をセットし、空でないなら除去
			if(empty($ent['id'])){
				$ent['created'] = $today;
			}else{
				unset($ent['created']);
			}
				
			$ent['modified'] = $today;
	
				
			$data[$i] = $ent;
		}
	
	
		return $data;
	
	}
    
    
    
    // 更新ユーザーなど共通フィールドをセットする。
	protected function setCommonToEntity($ent){
		
		// 更新ユーザーの取得とセット
		$update_user = $this->Auth->user('username');
		$ent['update_user'] = $update_user;
		
		// ユーザーエージェントの取得とセット
		$user_agent = $_SERVER['HTTP_USER_AGENT'];
		$user_agent = mb_substr($user_agent,0,255);
		$ent['user_agent'] = $user_agent;
		
		// IPアドレスの取得とセット
		$ip_addr = $_SERVER["REMOTE_ADDR"];
		$ent['ip_addr'] = $ip_addr;
		
		// idが空（新規入力）なら生成日をセットし、空でないなら除去
		if(empty($ent['id'])){
			$ent['created'] = date('Y-m-d H:i:s');
		}else{
			unset($ent['created']);
		}
		
		// 更新日時は除去（DB側にまかせる）
		if(isset($ent['modified'])){
			unset($ent['modified']);
		}
		
		return $ent;
		
	}
	
	/**
	 * 削除用のエンティティを取得する
	 * @param int $id ID
	 */
	protected function getEntForDelete($id){
		if(empty($id)){
			throw new Exception('IDが空です。');
		}
		
		$ent2 = array(
				'id'=>$id,
				'delete_flg'=>1,
		);
		
		// 更新ユーザーなど共通フィールドをセットする。
		$ent2 = $this->setCommonToEntity($ent2);
		
		return $ent2;
	}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

}