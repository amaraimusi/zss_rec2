<?php
App::uses('CrudBaseController', 'Controller');
App::uses('PagenationForCake', 'Vendor/Wacg');

/**
 * カニ画面のコントローラクラス
 * 
 * ワーカースレッドによるバックグランド処理が組み込まれています。
 * 
 * @date 2015/10/16	新規作成
 * @author k-uehara
 *
 */
class KaniController extends CrudBaseController {

	///名称コード
	public $name = 'Kani';
	
	///使用しているモデル
	public $uses = array('Kani');

	///デフォルトの並び替え対象フィールド
	var $defSortFeild='Kani.id';//デフォルトの並び替え対象フィールド

	///検索条件のセッション保存フラグ
	public $kj_session_flg=true;

	
	///検索条件情報の定義
	public $kensakuJoken=array(

		array('name'=>'kj_id','def'=>null),
		array('name'=>'kj_kani_val1','def'=>null),
		array('name'=>'kj_kani_val2','def'=>null),
		array('name'=>'kj_kani_name','def'=>null),
		array('name'=>'kj_kani_ym','def'=>null),
		array('name'=>'kj_kani_date1','def'=>null),
		array('name'=>'kj_kani_date2','def'=>null),
		array('name'=>'kj_kani_group','def'=>null),
		array('name'=>'kj_kani_dt','def'=>null),
		array('name'=>'kj_note','def'=>null),
		array('name'=>'kj_delete_flg','def'=>0),
		array('name'=>'kj_update_user','def'=>null),
		array('name'=>'kj_ip_addr','def'=>null),
		array('name'=>'kj_created','def'=>null),
		array('name'=>'kj_modified','def'=>null),
		array('name'=>'row_limit','def'=>50),
			
	);



	///検索条件のバリデーション
	public $kjs_validate = array(

			'kj_id' => array(
					'naturalNumber'=>array(
							'rule' => array('naturalNumber', true),
							'message' => 'IDは数値を入力してください',
							'allowEmpty' => true
					),
			),
			
			'kj_kani_val1' => array(
					'custom'=>array(
							'rule' => array( 'custom', '/^[-]?[0-9]+?$/' ),
							'message' => 'カニ数値1は整数を入力してください。',
							'allowEmpty' => true
					),
			),
			
			'kj_kani_val2' => array(
					'custom'=>array(
							'rule' => array( 'custom', '/^[-]?[0-9]+?$/' ),
							'message' => 'カニ数値2は整数を入力してください。',
							'allowEmpty' => true
					),
			),
			

			'kj_kani_name'=> array(
					'maxLength'=>array(
							'rule' => array('maxLength', 255),
							'message' => 'カニ名前は255文字以内で入力してください',
							'allowEmpty' => true
					),
			),

			'kj_kani_date1'=> array(
					'rule' => array( 'date', 'ymd'),
					'message' => 'カニ日【範囲1】は日付形式【yyyy-mm-dd】で入力してください。',
					'allowEmpty' => true
			),

			'kj_kani_date2'=> array(
					'rule' => array( 'date', 'ymd'),
					'message' => 'カニ日【範囲2】は日付形式【yyyy-mm-dd】で入力してください。',
					'allowEmpty' => true
			),
			
			'kj_note'=> array(
					'maxLength'=>array(
							'rule' => array('maxLength', 30),
							'message' => '備考は30文字以内で入力してください',
							'allowEmpty' => true
					),
			),
			
			'kj_update_user'=> array(
					'maxLength'=>array(
							'rule' => array('maxLength', 50),
							'message' => '更新者は50文字以内で入力してください',
							'allowEmpty' => true
					),
			),
			
			'kj_ip_addr'=> array(
					'maxLength'=>array(
							'rule' => array('maxLength', 40),
							'message' => '更新IPアドレスは40文字以内で入力してください',
							'allowEmpty' => true
					),
			),
			
			'kj_created'=> array(
					'maxLength'=>array(
							'rule' => array('maxLength', 20),
							'message' => '生成日時は20文字以内で入力してください',
							'allowEmpty' => true
					),
			),
			
			'kj_modified'=> array(
					'maxLength'=>array(
							'rule' => array('maxLength', 20),
							'message' => '更新日時は20文字以内で入力してください',
							'allowEmpty' => true
					),
			),
	);




	///一覧列情報（ソート機能付き）
	public $table_fields=array(
		'Kani.id'=>'ID',
		'Kani.kani_val'=>'カニ数値',
		'Kani.kani_name'=>'カニ名前',
		'Kani.kani_date'=>'カニ日',
		'Kani.kani_group'=>'カニ種別',
		'Kani.kani_dt'=>'カニ日時',
		'Kani.note'=>'備考',
		'Kani.delete_flg'=>'削除フラグ',
		'Kani.update_user'=>'更新者',
		'Kani.ip_addr'=>'更新IPアドレス',
		'Kani.created'=>'生成日時',
		'Kani.modified'=>'更新日時',
			
	);




	/**
	 * indexページのアクション
	 *
	 * indexページでは一覧を検索閲覧できます。
	 * 一覧データの表示はAjaxのワーカースレッド処理にて行われています。
	 * indexアクションではワーカースレッド処理に必要なIDリストや、ページネーション情報、最大IDを取得します。
	 * IDリストは対応テーブルを検索条件で検索して取得されます。
	 * 最大IDは対応テーブルに新しいレコードが作られた時、それを検知するのに使われます。
	 *
	 */
    public function index() {
    	
    	$res=$this->index_before('Kani',$this->request->data);//indexアクションの共通先処理(CrudBaseController)
    	$kjs=$res['kjs'];
    	$errMsg=$res['errMsg'];
    	$paginations=$res['paginations'];
    	$saveKjFlg=$res['saveKjFlg'];
    	
    	
    	
    	//IDリストを取得する
    	$ids=$this->Kani->findIdList($kjs,$paginations['page_no'],$paginations['limit'],$paginations['find_order']);
    	

    	//MAX IDを取得する。MAX IDは新レコードの検知に利用する。
    	$maxId=null;
    	if(!empty($ids)){
    		$maxId=max($ids);
    	}
    	
    	//最新窓口データ取得ワーカー（tw_get_show_worker）用に以下のパラメータをセッションに保存しておく。
    	$ses_param=array(
    			'ids'=>$ids,
    			'paginations'=>$paginations,
    			'maxId'=>$maxId,
    	);
    	$this->Session->write('gir_notifi_worker_ses_param',$ses_param);
    	

    	$res=$this->index_after($kjs);//indexアクションの共通後処理
    	
    	$pages=$res['pages'];
    	
    	// リセット用に、検索条件情報からデフォルト検索JSONを取得する
    	$def_kjs_json=$this->getDefKjsJson();
    	 
    	
    	//更新ユーザーを取得
    	$user=$this->Auth->user();
    	$update_user=$user['username'];
    	 
    	$kaniGroupList=$this->getKaniGroupList();//カニ種別名リストを取得
    	$kaniGroupJson=json_encode($kaniGroupList);//JSで利用するため、カニ種別名リストをJSON可する。
    	
    	$datetimeList=$this->createDateTimeList();//日時系検索用のセレクト選択肢
    	
    	$this->set(array(
    			'header' => 'header_demo',
    			'title_for_layout'=>'窓口一覧',
    			'kjs'=>$kjs,
    			'table_fields'=>$this->table_fields,
    			'pages'=>$pages,
    			'errMsg'=>$errMsg,
    			'saveKjFlg'=>$saveKjFlg,
    			'def_kjs_json'=>$def_kjs_json,
    			'update_user'=>$update_user,
    			'kaniGroupList'=>$kaniGroupList,
    			'kaniGroupJson'=>$kaniGroupJson,
    			'datetimeList'=>$datetimeList,

    	));
    	

    }

    
    /**
     * カニ・通知ワーカー | Ajax
     * 
     * ワーカースレッド処理により、Ajaxを通して、数秒おきに呼び出されるアクションです。
     * 対応テーブルの変化を随時チェックします。
     * 変化があれば、案内ルームデータを取得し、JSONに変換してワーカースレッド処理（JavaScript側）に返します。
     * 
     * レスポンスは3種類で、「エラー」、「変化なし」、「変化あり」があります。
     * 「変化あり」の場合のみ、案内ルームデータを取得します。
     * データ変化があるときだけ、データ取得処理を行うことにより、サーバー負荷や通信トラフィックを軽減しています。
     * 
     * @return string
     * - error 「エラー」。送信パラメータに異常がある場合、エラーを返す。
     * - unchanged 「変化なし」。データ取得は行われません。
     * - json 「変化あり」。案内ルームデータなどから構成されるJSONデータ文字列。
     * 
     */
    public function notifi_worker(){
    	
		$this->autoRender = false;//ビュー(ctp)を使わない。

		App::uses('Sanitize', 'Utility');
	
		if(empty($_POST['key1'])){
			return 'error';
		}
		

	
		//POSTからJSONを取得し、パース変換してパラメータを取得。
		$json_param=$_POST['key1'];
		$param=json_decode($json_param,true);//JSON文字を配列に戻す
		
		//総合カニ・通知ワーカー用のバリデーション
		if($this->validForNotifiWorker($param)==false){
			return 'error';
		}

		//セッションから検索条件情報とページネーション情報を取り出す。空なら「変化なし」を返して処理抜けする。
		$ses_param=$this->Session->read('gir_notifi_worker_ses_param');
		if(empty($ses_param)){
			return 'unchanged';
		}

		//indexアクションにてセットされたセッションのパラメータを取得する。
		$ids=$ses_param['ids'];//カニIDリスト
		$paginations=$ses_param['paginations'];
		
		
		
		//Ajax送信パラメータから取得。
		$last_dt = $param['last_dt'];//最終日時
		$wt_status =  $param['wt_status'];//ワーカースレッド状態 0:初回スレッドループ,  1:2回目以降のスレッドループ
		
		//最新判定を行う。  ( 0:変化なし    1:更新あり )
		$chkRes=$this->Kani->checkNew($ids,$last_dt);
		
		//窓口最新チェック結果が「変化なし」である場合、処理を抜ける。
		if($chkRes==0){
			return 'unchanged';
		}
		
		//新レコードチェックを行う。
		$r_param['new_record_flg'] = $this->checkNewRecord($wt_status);
		
		
		//最終日時を窓口テーブルから取得
		$r_param['last_dt'] = $this->Kani->getLastDt($ids);
		

		//カニテーブルからデータを取得
		$data=$this->Kani->findData($ids,$paginations['find_order']);
		
		//サニタイズ（XSS対策）
		$data=Sanitize::clean($data, array('encode' => true));
		

		
		$res=array(
			'data'=>$data,
			'r_param'=>$r_param,
			);

		$json_data=json_encode($res);//JSONに変換

		return $json_data;
    }

    


    /*
     * 総合カニ・通知ワーカー用のバリデーション
     */
    private function validForNotifiWorker($param){

    	if(!is_numeric($param['wt_status'])){
    		return false;
    	}
    	
    	//最終窓口更新日時の日時バリデーション
    	if($this->isDatetime($param['last_dt'], false)==false){
    		return false;
    	}
    
    
    	return true;;
    }
    
    /**
     * 日時入力チェックのバリデーション
     * ※日付のみあるいは時刻は異常と見なす。
     * @param $strDateTime	日時文字列
     * @param $reqFlg	必須許可フラグ
     * @return boolean	true:正常　　　false:異常
     */
    private function isDatetime($strDateTime,$reqFlg){
    
    	//空値且つ、必須入力がnullであれば、trueを返す。
    	if(empty($strDateTime) && empty($reqFlg)){
    		return true;
    	}
    
    	//空値且つ、必須入力がtrueであれば、falseを返す。
    	if(empty($strDateTime) && !empty($reqFlg)){
    		return false;
    	}
    
    
    	//日時を　年月日時分秒に分解する。
    	$aryA =preg_split( '|[ /:_-]|', $strDateTime );
    	if(count($aryA)!=6){
    		return false;
    	}
    
    	foreach ($aryA as $key => $val){
    
    		//▼正数以外が混じっているば、即座にfalseを返して処理終了
    		if (!preg_match("/^[0-9]+$/", $val)) {
    			return false;
    		}
    
    	}
    
    	//▼グレゴリオ暦と整合正が取れてるかチェック。（閏年などはエラー） ※さくらサーバーではemptyでチェックするとバグになるので注意。×→if(empty(checkdate(12,11,2012))){・・・}
    	if(checkdate($aryA[1],$aryA[2],$aryA[0])==false){
    		return false;
    	}
    
    	//▼時刻の整合性をチェック
    	if($aryA[3] < 0 || $aryA[3] > 23){
    		return false;
    	}
    	if($aryA[4] < 0 ||  $aryA[4] > 59){
    		return false;
    	}
    	if($aryA[5] < 0 || $aryA[5] > 59){
    		return false;
    	}
    
    	return true;
    }

    /**
     * 新レコードチェック
     * @param $wt_status ワーカースレッド状態 0:初回スレッドループ,  1:2回目以降のスレッドループ
     * @return 0:新レコードなし  ,  1:新レコードあり
     */
    private function checkNewRecord($wt_status){
    
    	$sesKey="kani_check_new_record";//セッションキー
    
    	//カニテーブルから最大ID1を取得する。
    	$maxId1=$this->Kani->getMaxId();
 
    	// 初回スレッドである場合。
    	if($wt_status==0){
    		// セッションに最大ID1を保存し、0(新レコードなし)を返す。
    		$this->Session->write($sesKey,$maxId1);
    		return 0;
    	}
    
    
    	// 2回目以降のスレッドループである場合
    	else if($wt_status==1){
    			
    		// セッションから最大ID2を取得する
    		$maxId2=$this->Session->read($sesKey);
    			
    		//最大ID2と最大ID1が同じである場合、0(新レコードなし)を返す。
    		if($maxId1 == $maxId2){
    			return 0;
    		}
    		// 最大ID2と最大ID1が異なる場合、セッションに最大IDを保存し、1(新レコードあり)を返す。
    		else{
    			
    			$this->Session->write($sesKey,$maxId1);
    			return 1;
    		}
    	}
    
    
    	//バグ
    	else{
    		return -1;
    	}
    }

    /**
     * カニ種別名リストを取得
     */
    private function getKaniGroupList(){
    	return array(1=>'サワガニ',2=>'ビワガニ',3=>'ガサミ',4=>'モクズガニ',5=>'ズワイガニ',6=>'タラバガニ');
    }
    
    /**
     * //日時系検索用のセレクト選択肢
     */
    private function createDateTimeList(){
    	 
    	$d1=date('Y-m-d');//本日
    	$d2=$this->getBeginningWeekDate($d1);//週初め日付を取得する。
    	$d3 = date('Y-m-d', strtotime("-10 day"));//10日前
    	$d4 = $this->getBeginningMonthDate($d1);//今月一日を取得する。
    	$d5 = date('Y-m-d', strtotime("-30 day"));//30日前
    	$d6 = date('Y-m-d', strtotime("-50 day"));//50日前
    	$d7 = date('Y-m-d', strtotime("-100 day"));//100日前
    	$d8 = date('Y-m-d', strtotime("-180 day"));//180日前
    	$d9 = $this->getBeginningYearDate($d1);//今年元旦を取得する
    	$d10 = date('Y-m-d', strtotime("-365 day"));//365日前
    	 
    	$list= array(
    			$d1=>'本日',
    			$d2=>'今週（日曜日から～）',
    			$d3=>'10日以内',
    			$d4=>'今月（今月一日から～）',
    			$d5=>'30日以内',
    			$d6=>'50日以内',
    			$d7=>'100日以内',
    			$d8=>'半年以内（180日以内）',
    			$d9=>'今年（今年の元旦から～）',
    			$d10=>'1年以内（365日以内）',
    	);
    	 
    
    	return $list;
    	 
    }
    
    /**
     * 引数日付の週の週初め日付を取得する。
     * 週初めは日曜日とした場合。
     * @param $ymd
     * @return 週初め
     */
    private function getBeginningWeekDate($ymd) {
    	 
    	$w = date("w",strtotime($ymd));
    	$bwDate = date('Y-m-d', strtotime("-{$w} day", strtotime($ymd)));
    	return $bwDate;
    	 
    }
    
    /**
     * 引数日付から月初めの日付を取得する。
     * @param $ymd
     */
    private function getBeginningMonthDate($ymd) {
    
    	$ym = date("Y-m",strtotime($ymd));
    	$d=$ym.'-01';
    	 
    	return $d;
    
    }
    
    /**
     * 引数日付から元旦日を取得する。
     * @param $ymd
     */
    private function getBeginningYearDate($ymd) {
    
    	$y = date("Y",strtotime($ymd));
    	$d=$y.'-01-01';
    	 
    	return $d;
    
    }







}