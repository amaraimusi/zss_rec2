<?php
App::uses('CrudBaseController', 'Controller');
App::uses('PagenationForCake', 'Vendor/CrudBase');

/**
 * タイトル
 * 
 * @note
 * タイトル画面ではタイトル一覧を検索閲覧、編集など多くのことができます。
 * 
 * @date 2015-9-16 | 2019-2-17
 * @version 3.2.3
 *
 */
class TitleController extends CrudBaseController {

	/// 名称コード
	public $name = 'Title';
	
	/// 使用しているモデル[CakePHPの機能]
	public $uses = array('Title','CrudBase');
	
	/// オリジナルヘルパーの登録[CakePHPの機能]
	public $helpers = array('CrudBase');

	/// デフォルトの並び替え対象フィールド
	public $defSortFeild='Title.sort_no';
	
	/// デフォルトソートタイプ	  0:昇順 1:降順
	public $defSortType=0;
	
	/// 検索条件情報の定義
	public $kensakuJoken=array();

	/// 検索条件のバリデーション
	public $kjs_validate = array();

	///フィールドデータ
	public $field_data=array();

	/// 編集エンティティ定義
	public $entity_info=array();

	/// 編集用バリデーション
	public $edit_validate = array();
	
	// 当画面バージョン (バージョンを変更すると画面に新バージョン通知とクリアボタンが表示されます。）
	public $this_page_version = '1.9.1';

	
	
	public function beforeFilter() {

		// 未ログイン中である場合、未認証モードの扱いでページ表示する。
		if(empty($this->Auth->user())){
			$this->Auth->allow(); // 未認証モードとしてページ表示を許可する。
		}
		
// 		if($this->action == 'front_a'){
// 			// 未ログイン中である場合、未認証モードの扱いでページ表示する。
// 			if(empty($this->Auth->user())){
// 				$this->Auth->allow(); // 未認証モードとしてページ表示を許可する。
// 			}
// 		}
	
		parent::beforeFilter();
	
		$this->initCrudBase();// フィールド関連の定義をする。
	
	}

	/**
	 * indexページのアクション
	 *
	 * indexページではタイトル一覧を検索閲覧できます。
	 * 一覧のidから詳細画面に遷移できます。
	 * ページネーション、列名ソート、列表示切替、CSVダウンロード機能を備えます。
	 */
	public function index() {
		
		// CrudBase共通処理（前）
		$crudBaseData = $this->indexBefore('Title');//indexアクションの共通先処理(CrudBaseController)
		
		// CBBXS-1019

		// CBBXE
		
		//一覧データを取得
		$data = $this->Title->findData($crudBaseData);

		// CrudBase共通処理（後）
		$crudBaseData = $this->indexAfter($crudBaseData);//indexアクションの共通後処理
		
		// CBBXS-1020

		// タイトルカテゴリリスト
		$titleCtgIdList = $this->Title->getTitleCtgIdList();
		$title_ctg_id_json = json_encode($titleCtgIdList,JSON_HEX_TAG | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_HEX_APOS);
		$this->set(array('titleCtgIdList' => $titleCtgIdList,'title_ctg_id_json' => $title_ctg_id_json));

		// CBBXE
		
		$this->set($crudBaseData);
		$this->set(array(
			'title_for_layout'=>'タイトル',
			'data'=> $data,
		));
		
		//当画面系の共通セット
		$this->setCommon();


	}
	
	
	/**
	 * フロントページA
	 */
	public function front_a(){
		
		// CrudBase共通処理（前）
		$option = array(
				'func_csv_export'=>0, // CSVエクスポート機能 0:OFF ,1:ON
				'func_file_upload'=>1, // ファイルアップロード機能 0:OFF , 1:ON
		);
		$crudBaseData = $this->indexBefore('Title',$option);//indexアクションの共通先処理(CrudBaseController)
		
		//一覧データを取得
		$data = $this->Title->findData($crudBaseData);
		
		// CrudBase共通処理（後）
		$crudBaseData = $this->indexAfter($crudBaseData,['method_url'=>'front_a']);//indexアクションの共通後処理
		
		// CBBXS-1020-2

		// タイトルカテゴリリスト
		$titleCtgIdList = $this->Title->getTitleCtgIdList();
		$title_ctg_id_json = json_encode($titleCtgIdList,JSON_HEX_TAG | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_HEX_APOS);
		$this->set(array('titleCtgIdList' => $titleCtgIdList,'title_ctg_id_json' => $title_ctg_id_json));

		// CBBXE
		
		
// 		// ▼ サブ画像集約ライブラリ
// 		App::uses('SubImgAgg', 'Vendor/CrudBase');
// 		$subImgAgg = new SubImgAgg();
// 		$data = $subImgAgg->agg($data,array(
// 				'note_field' => 'note',			// ノートフィールド名
// 				'img_fn_field' => 'img_fn' ,	// 画像フィールド名
//			));	// ディレクトリパス・テンプレート
		
		
		$this->set($crudBaseData);
		$this->setCommon();//当画面系の共通セット
		$this->set(array(
				'header' => 'front_a_header',
				'title_for_layout'=>'タイトル',
				'data'=> $data,
		));
		
		
		
	}


	
	
	
	
	/**
	 * DB登録
	 *
	 * @note
	 * Ajaxによる登録。
	 * 編集登録と新規入力登録の両方に対応している。
	 */
	public function ajax_reg(){
		App::uses('Sanitize', 'Utility');
		$this->autoRender = false;//ビュー(ctp)を使わない。
		$errs = array(); // エラーリスト

// 		// 認証中でなければエラー
// 		if(empty($this->Auth->user())){
// 			return 'Error:login is needed.';// 認証中でなければエラー
// 		}
		
		// 未ログインかつローカルでないなら、エラーアラートを返す。
		if(empty($this->Auth->user()) && $_SERVER['SERVER_NAME']!='localhost'){
			return '一般公開モードでは編集登録はできません。';
		}
		
		// JSON文字列をパースしてエンティティを取得する
		$json=$_POST['key1'];
		$ent = json_decode($json,true);
		
		// 登録パラメータ
		$reg_param_json = $_POST['reg_param_json'];
		$regParam = json_decode($reg_param_json,true);
		$form_type = $regParam['form_type']; // フォーム種別 new_inp,edit,delete,eliminate

		// CBBXS-1024

		// CBBXE

		// 更新ユーザーなど共通フィールドをセットする。
		$ent = $this->setCommonToEntity($ent);
	
		// エンティティをDB保存
		$this->Title->begin();
		$ent = $this->Title->saveEntity($ent,$regParam);
		$this->Title->commit();//コミット

		// ファイルアップロードの一括作業
		App::uses('FileUploadK','Vendor/CrudBase/FileUploadK');
		$fileUploadK = new FileUploadK();
		$res = $fileUploadK->putFile1($_FILES, 'img_fn', $ent['img_fn']);
		
		if(!empty($res['err_msg'])) $errs[] = $res['err_msg'];
		
		if($errs) $ent['err'] = implode("','",$errs); // フォームに表示するエラー文字列をセット

		$json_data=json_encode($ent,true);//JSONに変換
	
		return $json_data;
	}
	
	
	
	
	
	
	
	/**
	 * 削除登録
	 *
	 * @note
	 * Ajaxによる削除登録。
	 * 削除更新でだけでなく有効化に対応している。
	 * また、DBから実際に削除する抹消にも対応している。
	 */
	public function ajax_delete(){

 		$this->autoRender = false;//ビュー(ctp)を使わない。

		// JSON文字列をパースしてエンティティを取得する
		$json=$_POST['key1'];
		$ent0 = json_decode($json,true);
		
		// 登録パラメータ
		$reg_param_json = $_POST['reg_param_json'];
		$regParam = json_decode($reg_param_json,true);

		// 抹消フラグ
		$eliminate_flg = 0;
		if(isset($regParam['eliminate_flg'])) $eliminate_flg = $regParam['eliminate_flg'];
		
		// 削除用のエンティティを取得する
		$ent = $this->getEntForDelete($ent0['id']);
		$ent['delete_flg'] = $ent0['delete_flg'];
	
		// エンティティをDB保存
		$this->Title->begin();
		if($eliminate_flg == 0){
			$ent = $this->Title->saveEntity($ent,$regParam); // 更新
		}else{
			$this->Title->eliminateFiles($ent['id'], 'img_fn', $ent); // ファイル抹消（他のレコードが保持しているファイルは抹消対象外）
			$this->Title->delete($ent['id']); // 削除
		}
		$this->Title->commit();//コミット
		
		$json_str =json_encode($ent);//JSONに変換
	
		return $json_str;
	}
	
	
	/**
	* Ajax | 自動保存
	* 
	* @note
	* バリデーション機能は備えていない
	* 
	*/
	public function auto_save(){
		$this->autoRender = false;//ビュー(ctp)を使わない。
		
		App::uses('Sanitize', 'Utility');
		if(empty($this->Auth->user())) return 'Error:login is needed.';// 認証中でなければエラー
		
		
		$json=$_POST['key1'];
		
		$data = json_decode($json,true);//JSON文字を配列に戻す
		
		// データ保存
		$this->Title->begin();
		$this->Title->saveAll($data); // まとめて保存。内部でSQLサニタイズされる。
		$this->Title->commit();

		$res = array('success');
		
		$json_str = json_encode($res);//JSONに変換
		
		return $json_str;
	}
	
	/**
	 * 一括登録 | AJAX
	 * 
	 * @note
	 * 一括追加, 一括編集, 一括複製
	 */
	public function bulk_reg(){
		
		App::uses('DaoForCake', 'Model');
		App::uses('BulkReg', 'Vendor/CrudBase');
		
		$this->autoRender = false;//ビュー(ctp)を使わない。
		
		
		// 更新ユーザーを取得
		$update_user = 'none';
		if(!empty($this->Auth->user())){
			$userData = $this->Auth->user();
			$update_user = $userData['username'];
		}

		$json_param=$_POST['key1'];
		$param = json_decode($json_param,true);//JSON文字を配列に戻す
		
		// 一括登録
		$dao = new DaoForCake();
		$bulkReg = new BulkReg($dao, $update_user);
		$res = $bulkReg->reg('titles', $param);
		
		//JSONに変換
		$str_json = json_encode($res,JSON_HEX_TAG | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_HEX_APOS);
		
		return $str_json;
	}

	
	/**
	 * CSVインポート | AJAX
	 *
	 * @note
	 *
	 */
	public function csv_fu(){
		$this->autoRender = false;//ビュー(ctp)を使わない。
		if(empty($this->Auth->user())) return 'Error:login is needed.';// 認証中でなければエラー
		
		$this->csv_fu_base($this->Title,array('id','title_val','title_name','title_date','title_group','title_dt','title_flg','img_fn','note','sort_no'));
		
	}
	



	
	



	/**
	 * CSVダウンロード
	 *
	 * 一覧画面のCSVダウンロードボタンを押したとき、一覧データをCSVファイルとしてダウンロードします。
	 */
	public function csv_download(){
		$this->autoRender = false;//ビューを使わない。
	
		//ダウンロード用のデータを取得する。
		$data = $this->getDataForDownload();
		
		// ダブルクォートで値を囲む
		foreach($data as &$ent){
			unset($ent['xml_text']);
			foreach($ent as $field => $value){
				if(mb_strpos($value,'"')!==false){
					$value = str_replace('"', '""', $value);
				}
				$value = '"' . $value . '"';
				$ent[$field] = $value;
			}
		}
		unset($ent);
		
		//列名配列を取得
		$clms=array_keys($data[0]);
	
		//データの先頭行に列名配列を挿入
		array_unshift($data,$clms);
	
	
		//CSVファイル名を作成
		$date = new DateTime();
		$strDate=$date->format("Y-m-d");
		$fn='title'.$strDate.'.csv';
	
	
		//CSVダウンロード
		App::uses('CsvDownloader','Vendor/CrudBase');
		$csv= new CsvDownloader();
		$csv->output($fn, $data);
		 
	
	
	}
	
	

	
	
	//ダウンロード用のデータを取得する。
	private function getDataForDownload(){
		 
		
		//セッションから検索条件情報を取得
		$kjs=$this->Session->read('title_kjs');
		
		// セッションからページネーション情報を取得
		$pages = $this->Session->read('title_pages');

		$page_no = 0;
		$row_limit = 100000;
		$sort_field = $pages['sort_field'];
		$sort_desc = $pages['sort_desc'];
		
		$crudBaseData = array(
				'kjs' => $kjs,
				'pages' => $pages,
				'page_no' => $page_no,
				'row_limit' => $row_limit,
				'sort_field' => $sort_field,
				'sort_desc' => $sort_desc,
		);
		

		//DBからデータ取得
		$data=$this->Title->findData($crudBaseData);
		if(empty($data)){
			return array();
		}
	
		return $data;
	}
	

	/**
	 * 当画面系の共通セット
	 */
	private function setCommon(){

		
		// 新バージョンであるかチェックする。
		$new_version_flg = $this->checkNewPageVersion($this->this_page_version);
		
		$this->set(array(
				'header' => 'header',
				'new_version_flg' => $new_version_flg, // 当ページの新バージョンフラグ   0:バージョン変更なし  1:新バージョン
				'this_page_version' => $this->this_page_version,// 当ページのバージョン
		));
	}
	

	/**
	 * CrudBase用の初期化処理
	 *
	 * @note
	 * フィールド関連の定義をする。
	 *
	 *
	 */
	private function initCrudBase(){

		
		// CBBXS-3001 

		// CBBXE
		
		
		/// 検索条件情報の定義
		$this->kensakuJoken=array(
				
				array('name'=>'kj_main','def'=>null),
				// CBBXS-1000 
			array('name'=>'kj_id','def'=>null),
			array('name'=>'kj_title_name','def'=>null),
			array('name'=>'kj_title_ctg_id','def'=>null),
			array('name'=>'kj_note','def'=>null),
			array('name'=>'kj_public_flg','def'=>null),
			array('name'=>'kj_sort_no','def'=>null),
			array('name'=>'kj_delete_flg','def'=>0),
			array('name'=>'kj_update_user','def'=>null),
			array('name'=>'kj_ip_addr','def'=>null),
			array('name'=>'kj_created','def'=>null),
			array('name'=>'kj_modified','def'=>null),

				// CBBXE
				
				array('name'=>'row_limit','def'=>50),
				
		);
		
		
		
		
		
		/// 検索条件のバリデーション
		$this->kjs_validate=array(
				
				// CBBXS-1001
				'kj_id' => array(
						'naturalNumber'=>array(
								'rule' => array('naturalNumber', true),
								'message' => 'idは数値を入力してください',
								'allowEmpty' => true
						),
				),
				'kj_title_name'=> array(
						'maxLength'=>array(
								'rule' => array('maxLength', 255),
								'message' => 'タイトルは255文字以内で入力してください',
								'allowEmpty' => true
						),
				),
				'kj_title_ctg_id' => array(
						'custom'=>array(
								'rule' => array( 'custom', '/^[-]?[0-9]+$/' ),
								'message' => 'タイトルカテゴリは整数を入力してください。',
								'allowEmpty' => true
						),
				),
				'kj_note'=> array(
						'maxLength'=>array(
								'rule' => array('maxLength', 255),
								'message' => '備考は0文字以内で入力してください',
								'allowEmpty' => true
						),
				),
				'kj_sort_no' => array(
						'custom'=>array(
								'rule' => array( 'custom', '/^[-]?[0-9]+$/' ),
								'message' => '順番は整数を入力してください。',
								'allowEmpty' => true
						),
				),
				'kj_update_user'=> array(
						'maxLength'=>array(
								'rule' => array('maxLength', 255),
								'message' => '更新者は50文字以内で入力してください',
								'allowEmpty' => true
						),
				),
				'kj_ip_addr'=> array(
						'maxLength'=>array(
								'rule' => array('maxLength', 255),
								'message' => 'IPアドレスは40文字以内で入力してください',
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

				// CBBXE
		);
		
		
		
		
		
		///フィールドデータ
		$this->field_data = array('def'=>array(
		
			// CBBXS-1002
			'id'=>array(
					'name'=>'ID',//HTMLテーブルの列名
					'row_order'=>'Title.id',//SQLでの並び替えコード
					'clm_show'=>1,//デフォルト列表示 0:非表示 1:表示
			),
			'title_name'=>array(
					'name'=>'タイトル',
					'row_order'=>'Title.title_name',
					'clm_show'=>1,
			),
			'title_ctg_id'=>array(
					'name'=>'タイトルカテゴリ',
					'row_order'=>'Title.title_ctg_id',
					'clm_show'=>1,
			),
			'note'=>array(
					'name'=>'備考',
					'row_order'=>'Title.note',
					'clm_show'=>1,
			),
			'public_flg'=>array(
					'name'=>'公開',
					'row_order'=>'Title.public_flg',
					'clm_show'=>1,
			),
			'sort_no'=>array(
					'name'=>'順番',
					'row_order'=>'Title.sort_no',
					'clm_show'=>0,
			),
			'delete_flg'=>array(
					'name'=>'無効フラグ',
					'row_order'=>'Title.delete_flg',
					'clm_show'=>0,
			),
			'update_user'=>array(
					'name'=>'更新者',
					'row_order'=>'Title.update_user',
					'clm_show'=>0,
			),
			'ip_addr'=>array(
					'name'=>'IPアドレス',
					'row_order'=>'Title.ip_addr',
					'clm_show'=>0,
			),
			'created'=>array(
					'name'=>'生成日時',
					'row_order'=>'Title.created',
					'clm_show'=>0,
			),
			'modified'=>array(
					'name'=>'更新日時',
					'row_order'=>'Title.modified',
					'clm_show'=>0,
			),

			// CBBXE
		));

		// 列並び順をセットする
		$clm_sort_no = 0;
		foreach ($this->field_data['def'] as &$fEnt){
			$fEnt['clm_sort_no'] = $clm_sort_no;
			$clm_sort_no ++;
		}
		unset($fEnt);

		 
	}



}