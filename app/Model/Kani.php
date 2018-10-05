<?php
App::uses('Model', 'Model');

/**
 * カニ画面のモデル
 * 
 * 各種のデータ取得メソッドを備えています。
 * ワーカースレッドで定期的に呼び出されるメソッドも多く、使用頻度が高いため、無駄を省いたSQLを実行するようにしています。
 * 
 * @date 2015/10/16	新規作成
 * @author k-uehara
 *
 */
class Kani extends Model {

	///関連付けているテーブル名：カニテーブル
	public $name='kanis';

	///バリデーション情報。コントローラにて定義
	public $validate = null;



	/**
	 * カニテーブルから検索条件、ページ番号、表示件数、ソート情報からDBを検索し、IDリストを取得します。
	 * 
	 * @param array $kjs 検索条件情報
	 * @param int $page_no ページ番号（ページネーション関係）
	 * @param int $limit 表示件数	
	 * @param string $findOrder ソート情報
	 * @return array IDリスト
	 */
	public function findIdList($kjs,$page_no,$limit,$findOrder){

		//SELECT情報
		$fields=array('id');
		
		//条件を作成
		$conditions=$this->createKjConditions($kjs);
		
		
		//ORDERのデフォルトをセット
		if(empty($findOrder)){
			$findOrder='id';
		}
		
		$offset=null;
		if(!empty($limit)){
			$offset=$page_no * $limit;
		}
		
		//DBからデータを取得
		$data = $this->find(
				'list',
				Array(
						'fields'=>$fields,
						'conditions' => $conditions,
						'limit' =>$limit,
						'offset'=>$offset,
						'order' => $findOrder,
						)
				);
		
		
		return $data;
	}
	
	

	/**
	 * 検索条件情報からWHERE情報を作成。
	 * @param $kjs	検索条件情報
	 * @return WHERE情報
	 */
	private function createKjConditions($kjs){

		$cnds=null;
		
		if(!empty($kjs['kj_id'])){
			$cnds[]="Kani.id = {$kjs['kj_id']}";
		}
		
		if(!empty($kjs['kj_kani_val1'])){
			$cnds[]="Kani.kani_val >= {$kjs['kj_kani_val1']}";
		}
		
		if(!empty($kjs['kj_kani_val2'])){
			$cnds[]="Kani.kani_val <= {$kjs['kj_kani_val2']}";
		}
		
		if(!empty($kjs['kj_kani_name'])){
			$cnds[]="Kani.kani_name LIKE '%{$kjs['kj_kani_name']}%'";
		}
		
		if(!empty($kjs['kj_kani_date1'])){
			$cnds[]="Kani.kani_date >= '{$kjs['kj_kani_date1']}'";
		}
		
		if(!empty($kjs['kj_kani_date2'])){
			$cnds[]="Kani.kani_date <= '{$kjs['kj_kani_date2']}'";
		}
		
		if(!empty($kjs['kj_kani_group'])){
			$cnds[]="Kani.kani_group = {$kjs['kj_kani_group']}";
		}
		
		if(!empty($kjs['kj_kani_dt'])){
			$cnds[]="Kani.kani_dt = '{$kjs['kj_kani_dt']}'";
		}
		
		if(!empty($kjs['kj_note'])){
			$cnds[]="Kani.note LIKE '%{$kjs['kj_note']}%'";
		}
		
		if(!empty($kjs['kj_delete_flg']) || $kjs['kj_delete_flg'] ==='0' || $kjs['kj_delete_flg'] ===0){
			$cnds[]="Kani.delete_flg = {$kjs['kj_delete_flg']}";
		}
		
		if(!empty($kjs['kj_update_user'])){
			$cnds[]="Kani.update_user = '{$kjs['kj_update_user']}'";
		}
		
		if(!empty($kjs['kj_ip_addr'])){
			$cnds[]="Kani.ip_addr = '{$kjs['kj_ip_addr']}'";
		}
		
		if(!empty($kjs['kj_created'])){
			$kj_created=$kjs['kj_created'].' 00:00:00';
			$cnds[]="Kani.created >= '{$kj_created}'";
		}
		
		if(!empty($kjs['kj_modified'])){
			$kj_modified=$kjs['kj_modified'].' 00:00:00';
			$cnds[]="Kani.modified >= '{$kj_modified}'";
		}
		
		$cnd=null;
		if(!empty($cnds)){
			$cnd=implode(' AND ',$cnds);
		}
		
		return $cnd;

	}



	/**
	 * 全データ件数を取得
	 * 
	 * limitによる制限をとりはらった、検索条件に紐づく件数を取得します。
	 * 
	 * @param array $kjs 検索条件情報
	 * @return int 全データ件数
	 */
	public function findDataCnt($kjs){

		
		$ids=$this->findIdList($kjs,null,null,null);
		$cnt=count($ids);
		return $cnt;
		

	}

	

	/**
	 * 一覧データを取得
	 * 
	 * カニテーブルから一覧データを取得します。
	 * 
	 * @param array $ids IDリスト
	 * @param string $findOrder	ソート情報
	 * @return array 一覧データ
	 */
	public function findData($ids,$findOrder){
		
		if(empty($ids)){
			return array();
		}
		
		//WHERE情報
		$joinId=join(',',$ids);
		$conditions=array(
				"id IN ({$joinId})",
			);
		

		//ORDERのデフォルトをセット
		if(empty($findOrder)){
			$findOrder='id';
		}
		
		


	
		//DBからデータを取得
		$data = $this->find(
				'all',
				Array(

						'conditions' => $conditions,
						'order' => $findOrder,
						)
				);
		

 		$data=Hash::extract($data, '{n}.Kani');
	
		return $data;
	}
	
	

	
	
	
	/**
	 * 最新判定
	 * 
	 * カニテーブルが更新されているかチェックするメソッドです。
	 * 頻繁に呼ばれるメソッドであるため、なるべく最適化したSQLを実行しています。
	 *
	 * @param array $ids	IDリスト
	 * @param datetime $last_dt	最終日時
	 * @return bool 0:変化なし    1:更新あり
	 */
	public function checkNew($ids,$last_dt){
	
		//カニIDリストが空である場合、「最新なし」と判定する。
		if(empty($ids)){
			return 0;
		}
	
		//最終日時が空である場合、「最新あり」と判定する。
		if(empty($last_dt)){
			return 1;
		}
	

		//SELECT情報
		$fields=array('id');
	
		//WHERE情報
		$joinId=join(',',$ids);
		$conditions=array(
				"id IN ({$joinId})",
				"modified > '{$last_dt}'",
		);
	
		//オプション
		$option=array(
				'fields'=>$fields,
				'conditions'=>$conditions,
		);
	
		//DBから取得
		$data=$this->find('first',$option);
	
		//データが存在しなければ「変化なし」と判定する。
		if(empty($data)){
			return 0;
		}
		
		return 1;
	
	
	}
	
	
	/**
	 * 最終日時を取得
	 * 
	 * カニテーブルからIDリストに紐づくレコードのうち、もっとも最新な更新日を最終日時として取得します。
	 * 最終日時は最新判定（checkNew）で使われています。
	 * 
	 * @param array $ids	カニIDリスト
	 * @return datetime 最終日時
	 */
	public function getLastDt($ids){
	

	
		//SELECT情報
		$fields=array('MAX(modified) AS last_dt');
	
		//WHERE情報
		$joinId=join(',',$ids);
		$conditions=array(
				"id IN ({$joinId})",
		);
	
		//オプション
		$option=array(
				'fields'=>$fields,
				'conditions'=>$conditions,
		);
	
		//DBから取得
		$data=$this->find('first',$option);
	
	
		//データが存在しなければnullを返す。
		if(empty($data)){
			return null;
		}
	
	
		//最終日時を取得
		$last_dt=$data[0]['last_dt'];
	
		return $last_dt;
	
	}


	
	/**
	 * カニテーブルから最大IDを取得する
	 * 
	 * 最大IDはカニテーブルの新レコード検知に利用されます。
	 * 
	 * @return int 最大ID
	 */
	public function getMaxId(){
		$ent = $this->find('first',
				array(
						'fields' => array("MAX(id) as max_id")
				));
		
		$maxId=0;
		
		if(!empty($ent)){
			$maxId=$ent[0]['max_id'];
		}
		
		return $maxId;
		
	}
	
	
	


}