<?php
App::uses('Model', 'Model');
App::uses('CrudBase', 'Model');

/**
 * 記録のCakePHPモデルクラス
 *
 * @date 2015-9-16 | 2018-10-10
 * @version 3.1.2
 *
 */
class Rec extends AppModel {

	public $name='Rec';
	
	// 関連付けるテーブル CBBXS-1040
	public $useTable = 'recs';

	// CBBXE


	/// バリデーションはコントローラクラスで定義
	public $validate = null;
	
	
	public function __construct() {
		parent::__construct();
		
		// CrudBaseロジッククラスの生成
		if(empty($this->CrudBase)) $this->CrudBase = new CrudBase();
	}
	
	/**
	 * 記録エンティティを取得
	 *
	 * 記録テーブルからidに紐づくエンティティを取得します。
	 *
	 * @param int $id 記録ID
	 * @return array 記録エンティティ
	 */
	public function findEntity($id){

		$conditions='id = '.$id;

		//DBからデータを取得
		$data = $this->find(
				'first',
				Array(
						'conditions' => $conditions,
				)
		);

		$ent=array();
		if(!empty($data)){
			$ent=$data['Rec'];
		}
		



		return $ent;
	}


	
	
	/**
	 * 一覧データを取得する
	 * @return array 記録画面一覧のデータ
	 */
	public function findData(&$crudBaseData){

		$kjs = $crudBaseData['kjs'];//検索条件情報
		$pages = $crudBaseData['pages'];//ページネーション情報


		$page_no = $pages['page_no']; // ページ番号
		$row_limit = $pages['row_limit']; // 表示件数
		$sort_field = $pages['sort_field']; // ソートフィールド
		$sort_desc = $pages['sort_desc']; // ソートタイプ 0:昇順 , 1:降順
		
		
		//条件を作成
		$conditions=$this->createKjConditions($kjs);
		
		// オフセットの組み立て
		$offset=null;
		if(!empty($row_limit)) $offset = $page_no * $row_limit;
		
		// ORDER文の組み立て
		$order = $sort_field;
		if(empty($order)) $order='sort_no';
		if(!empty($sort_desc)) $order .= ' DESC';
		
		$option=array(
				'conditions' => $conditions,
				'limit' =>$row_limit,
				'offset'=>$offset,
				'order' => $order,
		);
		
		//DBからデータを取得
		$data = $this->find('all',$option);
		
		//データ構造を変換（2次元配列化）
		$data2=array();
		foreach($data as $i=>$tbl){
			foreach($tbl as $ent){
				foreach($ent as $key => $v){
					$data2[$i][$key]=$v;
				}
			}
		}
		
		return $data2;
	}

	
	
	/**
	 * SQLのダンプ
	 * @param  $option
	 */
	private function dumpSql($option){
		$dbo = $this->getDataSource();
		
		$option['table']=$dbo->fullTableName($this->Rec);
		$option['alias']='Rec';
		
		$query = $dbo->buildStatement($option,$this->Rec);
		
		Debugger::dump($query);
	}



	/**
	 * 検索条件情報からWHERE情報を作成。
	 * @param array $kjs	検索条件情報
	 * @return string WHERE情報
	 */
	private function createKjConditions($kjs){

		$cnds=null;
		
		$this->CrudBase->sql_sanitize($kjs); // SQLサニタイズ
		
		if(!empty($kjs['kj_main'])){
			$cnds[]="CONCAT( IFNULL(Rec.rec_date, '') ,IFNULL(Rec.note, ''),IFNULL(Rec.img_fn, ''),IFNULL(Rec.img_dp, ''),IFNULL(Rec.ref_url, ''),IFNULL(Rec.no_a, ''),IFNULL(Rec.no_b, ''),IFNULL(Rec.rec_title, '')) LIKE '%{$kjs['kj_main']}%'";
		}
		
		// CBBXS-1003
		if(!empty($kjs['kj_id']) || $kjs['kj_id'] ==='0' || $kjs['kj_id'] ===0){
			$cnds[]="Rec.id = {$kjs['kj_id']}";
		}
		if(!empty($kjs['kj_title_id']) || $kjs['kj_title_id'] ==='0' || $kjs['kj_title_id'] ===0){
			$cnds[]="Rec.title_id = {$kjs['kj_title_id']}";
		}
		if(!empty($kjs['kj_rec_date'])){
			$kj_rec_date = $kjs['kj_rec_date'];
			$dtInfo = $this->CrudBase->guessDatetimeInfo($kj_rec_date);
			$cnds[]="DATE_FORMAT(Rec.rec_date,'{$dtInfo['format_mysql_a']}') = DATE_FORMAT('{$dtInfo['datetime_b']}','{$dtInfo['format_mysql_a']}')";
		}
		if(!empty($kjs['kj_note'])){
			$cnds[]="Rec.note LIKE '%{$kjs['kj_note']}%'";
		}
		if(!empty($kjs['kj_rec_ctg_id']) || $kjs['kj_rec_ctg_id'] ==='0' || $kjs['kj_rec_ctg_id'] ===0){
			$cnds[]="Rec.rec_ctg_id = {$kjs['kj_rec_ctg_id']}";
		}
		if(!empty($kjs['kj_img_fn'])){
			$cnds[]="Rec.img_fn LIKE '%{$kjs['kj_img_fn']}%'";
		}
		if(!empty($kjs['kj_img_dp'])){
			$cnds[]="Rec.img_dp LIKE '%{$kjs['kj_img_dp']}%'";
		}
		if(!empty($kjs['kj_ref_url'])){
			$cnds[]="Rec.ref_url LIKE '%{$kjs['kj_ref_url']}%'";
		}
		if(!empty($kjs['kj_no_a']) || $kjs['kj_no_a'] ==='0' || $kjs['kj_no_a'] ===0){
			$cnds[]="Rec.no_a = {$kjs['kj_no_a']}";
		}
		if(!empty($kjs['kj_no_b']) || $kjs['kj_no_b'] ==='0' || $kjs['kj_no_b'] ===0){
			$cnds[]="Rec.no_b = {$kjs['kj_no_b']}";
		}
		if(!empty($kjs['kj_rec_title'])){
			$cnds[]="Rec.rec_title LIKE '%{$kjs['kj_rec_title']}%'";
		}
		if(!empty($kjs['kj_parent_id']) || $kjs['kj_parent_id'] ==='0' || $kjs['kj_parent_id'] ===0){
			$cnds[]="Rec.parent_id = {$kjs['kj_parent_id']}";
		}
		$kj_public_flg = $kjs['kj_public_flg'];
		if(!empty($kjs['kj_public_flg']) || $kjs['kj_public_flg'] ==='0' || $kjs['kj_public_flg'] ===0){
			if($kjs['kj_public_flg'] != -1){
				$cnds[]="Rec.public_flg = {$kjs['kj_public_flg']}";
			}
		}
		if(!empty($kjs['kj_sort_no']) || $kjs['kj_sort_no'] ==='0' || $kjs['kj_sort_no'] ===0){
			$cnds[]="Rec.sort_no = {$kjs['kj_sort_no']}";
		}
		$kj_delete_flg = $kjs['kj_delete_flg'];
		if(!empty($kjs['kj_delete_flg']) || $kjs['kj_delete_flg'] ==='0' || $kjs['kj_delete_flg'] ===0){
			if($kjs['kj_delete_flg'] != -1){
			   $cnds[]="Rec.delete_flg = {$kjs['kj_delete_flg']}";
			}
		}
		if(!empty($kjs['kj_update_user'])){
			$cnds[]="Rec.update_user LIKE '%{$kjs['kj_update_user']}%'";
		}
		if(!empty($kjs['kj_ip_addr'])){
			$cnds[]="Rec.ip_addr LIKE '%{$kjs['kj_ip_addr']}%'";
		}
		if(!empty($kjs['kj_created'])){
			$kj_created=$kjs['kj_created'].' 00:00:00';
			$cnds[]="Rec.created >= '{$kj_created}'";
		}
		if(!empty($kjs['kj_modified'])){
			$kj_modified=$kjs['kj_modified'].' 00:00:00';
			$cnds[]="Rec.modified >= '{$kj_modified}'";
		}

		// CBBXE
		
		$cnd=null;
		if(!empty($cnds)){
			$cnd=implode(' AND ',$cnds);
		}

		return $cnd;

	}

	/**
	 * エンティティをDB保存
	 *
	 * 記録エンティティを記録テーブルに保存します。
	 *
	 * @param array $ent 記録エンティティ
	 * @param array $option オプション
	 *  - form_type フォーム種別  new_inp:新規入力 , copy:複製 , edit:編集
	 *  - ni_tr_place 新規入力追加場所フラグ 0:末尾 , 1:先頭
	 * @return array 記録エンティティ（saveメソッドのレスポンス）
	 */
	public function saveEntity($ent,$option=array()){

		// 新規入力であるなら新しい順番をエンティティにセットする。
		if($option['form_type']=='new_inp' ){
			if(empty($option['ni_tr_place'])){
				$ent['sort_no'] = $this->CrudBase->getLastSortNo($this); // 末尾順番を取得する
			}else{
				$ent['sort_no'] = $this->CrudBase->getFirstSortNo($this); // 先頭順番を取得する
			}
		}
		

		//DBに登録('atomic' => false　トランザクションなし。saveでSQLサニタイズされる）
		$ent = $this->save($ent, array('atomic' => false,'validate'=>false));

		//DBからエンティティを取得
		$ent = $this->find('first',
				array(
						'conditions' => "id={$ent['Rec']['id']}"
				));

		$ent=$ent['Rec'];
		if(empty($ent['delete_flg'])) $ent['delete_flg'] = 0;

		return $ent;
	}

	


	/**
	 * 全データ件数を取得
	 *
	 * limitによる制限をとりはらった、検索条件に紐づく件数を取得します。
	 *  全データ件数はページネーション生成のために使われています。
	 *
	 * @param array $kjs 検索条件情報
	 * @return int 全データ件数
	 */
	public function findDataCnt($kjs){

		//DBから取得するフィールド
		$fields=array('COUNT(id) AS cnt');
		$conditions=$this->createKjConditions($kjs);

		//DBからデータを取得
		$data = $this->find(
				'first',
				Array(
						'fields'=>$fields,
						'conditions' => $conditions,
				)
		);

		$cnt=$data[0]['cnt'];
		return $cnt;
	}
	
	/**
	 * アップロードファイルの抹消処理
	 * 
	 * @note
	 * 他のレコードが保持しているファイルは抹消対象外
	 * 
	 * @param int $id
	 * @param string $fn_field_strs ファイルフィールド群文字列（複数ある場合はコンマで連結）
	 * @param array $ent エンティティ
	 * @param string $dp_tmpl ディレクトリパス・テンプレート
	 * @param string $viaDpFnMap 中継パスマッピング
	 */
	public function eliminateFiles($id, $fn_field_strs, &$ent, $dp_tmpl, $viaDpFnMap){
		$this->CrudBase->eliminateFiles($this, $id, $fn_field_strs, $ent, $dp_tmpl, $viaDpFnMap);
	}
	
	
	// CBBXS-1021
	/**
	 * タイトルリストをDBから取得する
	 */
	public function getTitleIdList(){
		if(empty($this->Title)){
			App::uses('Title','Model');
			$this->Title=ClassRegistry::init('Title');
		}
		$fields=array('id','title_name');//SELECT情報
		$conditions=array("delete_flg = 0");//WHERE情報
		$order=array('sort_no');//ORDER情報
		$option=array(
				'fields'=>$fields,
				'conditions'=>$conditions,
				'order'=>$order,
		);

		$data=$this->Title->find('all',$option); // DBから取得
		
		// 構造変換
		if(!empty($data)){
			$data = Hash::combine($data, '{n}.Title.id','{n}.Title.title_name');
		}
		
		return $data;
	}
	/**
	 * 記録カテゴリリストをDBから取得する
	 */
	public function getRecCtgIdList(){
		if(empty($this->RecCtg)){
			App::uses('RecCtg','Model');
			$this->RecCtg=ClassRegistry::init('RecCtg');
		}
		$fields=array('id','rec_ctg_name');//SELECT情報
		$conditions=array("delete_flg = 0");//WHERE情報
		$order=array('sort_no');//ORDER情報
		$option=array(
				'fields'=>$fields,
				'conditions'=>$conditions,
				'order'=>$order,
		);

		$data=$this->RecCtg->find('all',$option); // DBから取得
		
		// 構造変換
		if(!empty($data)){
			$data = Hash::combine($data, '{n}.RecCtg.id','{n}.RecCtg.rec_ctg_name');
		}
		
		return $data;
	}

	// CBBXE


	/**
	 * サブ画像集約
	 * @param array $data
	 * @param array $param パラメータ
	 *  - note_field ノートフィールド名
	 *  - img_field 画像フィールド名
	 *  - img_via_dp_field 画像経由パスフィールド名
	 *  - dp_tmpl ディレクトリパス・テンプレート
	 * @return array 集約後のデータ
	 */
	public function aggSubImg(&$data, $param){
		
		App::uses('SubImgAgg', 'Vendor/Wacg');
		$subImgAgg = new SubImgAgg();
		$data2 = $subImgAgg->agg($data,$param);
		return $data2;
		
	}
}
