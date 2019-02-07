<?php
App::uses('CrudBaseController', 'Controller');
App::uses('PagenationForCake', 'Vendor/Wacg');

/**
 * 記録
 * 
 * @note
 * 記録画面では記録一覧を検索閲覧、編集など多くのことができます。
 * 
 * @date 2015-9-16 | 2018-10-10
 * @version 3.2.2
 *
 */
class RecController extends CrudBaseController {

	/// 名称コード
	public $name = 'Rec';
	
	/// 使用しているモデル[CakePHPの機能]
	public $uses = array('Rec','CrudBase');
	
	/// オリジナルヘルパーの登録[CakePHPの機能]
	public $helpers = array('CrudBase');

	/// デフォルトの並び替え対象フィールド
	public $defSortFeild='Rec.sort_no';
	
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
	
	/// リソース保存先・ディレクトリパス・テンプレート
	public $dp_tmpl = '/photos/halther/%field/%via_dp/%dn/';
	
	/// 経由パスマッピング
	public $viaDpFnMap = array('img_fn'=>'img_dp');// 例　'img_fn'=>'img_via_dp'



	public function beforeFilter() {

		if($this->action == 'front_a'){
			// 未ログイン中である場合、未認証モードの扱いでページ表示する。
			if(empty($this->Auth->user())){
				$this->Auth->allow(); // 未認証モードとしてページ表示を許可する。
			}
		}
	
		parent::beforeFilter();
	
		$this->initCrudBase();// フィールド関連の定義をする。
	
	}

	/**
	 * indexページのアクション
	 *
	 * indexページでは記録一覧を検索閲覧できます。
	 * 一覧のidから詳細画面に遷移できます。
	 * ページネーション、列名ソート、列表示切替、CSVダウンロード機能を備えます。
	 */
	public function index() {
		
		// CrudBase共通処理（前）
		$crudBaseData = $this->indexBefore('Rec');//indexアクションの共通先処理(CrudBaseController)
		
		//一覧データを取得
		$data = $this->Rec->findData($crudBaseData);

		// CrudBase共通処理（後）
		$crudBaseData = $this->indexAfter($crudBaseData);//indexアクションの共通後処理
		
		// CBBXS-1020

		// タイトルリスト
		$titleIdList = $this->Rec->getTitleIdList();
		$title_id_json = json_encode($titleIdList,JSON_HEX_TAG | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_HEX_APOS);
		$this->set(array('titleIdList' => $titleIdList,'title_id_json' => $title_id_json));

		// 記録カテゴリリスト
		$recCtgIdList = $this->Rec->getRecCtgIdList();
		$rec_ctg_id_json = json_encode($recCtgIdList,JSON_HEX_TAG | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_HEX_APOS);
		$this->set(array('recCtgIdList' => $recCtgIdList,'rec_ctg_id_json' => $rec_ctg_id_json));

		// CBBXE
		
		$this->set($crudBaseData);
		$this->set(array(
			'title_for_layout'=>'記録',
			'data'=> $data,
		));
		
		//当画面系の共通セット
		$this->setCommon();


	}
	
	
	/**
	 * フロントページA
	 */
	public function front_a(){
		
		Configure::write('debug', 0);
		
		// フロントA用のコンポーネント
		$this->RecFrontA = $this->Components->load('RecFrontA');

		// CrudBase共通処理（前）
		$option = array(
				'func_csv_export'=>0, // CSVエクスポート機能 0:OFF ,1:ON
				'func_file_upload'=>1, // ファイルアップロード機能 0:OFF , 1:ON
		);
		$crudBaseData = $this->indexBefore('Rec',$option);//indexアクションの共通先処理(CrudBaseController)
		
		//一覧データを取得
		$data = $this->Rec->findDataForFrontA($crudBaseData);
		

		// ▼ サブ画像集約ライブラリ
		App::uses('SubImgAgg', 'Vendor/Wacg');
		$subImgAgg = new SubImgAgg();
		$data = $subImgAgg->agg($data,array(
				'note_field' => 'note',			// ノートフィールド名
				'img_fn_field' => 'img_fn' ,	// 画像フィールド名
				'img_via_dp_field' => $this->viaDpFnMap['img_fn'], // 画像経由パスフィールド名
				'dp_tmpl' => $this->dp_tmpl));	// ディレクトリパス・テンプレート
		
		
		
		// CrudBase共通処理（後）
		$crudBaseData = $this->indexAfter($crudBaseData,['method_url'=>'front_a']);//indexアクションの共通後処理
		
		$title_name = 'None';
		if(!empty($data)){
			$title_name = $data[0]['title_name'] . ' | ワクガンス';
		}
		
		$this->set($crudBaseData);
		$this->setCommon();//当画面系の共通セット
		$this->set(array(
				'header' => 'front_a_header',
				'title_for_layout'=>$title_name,
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
		

		// 認証中でなければエラー
		if(empty($this->Auth->user())){
			return 'Error:login is needed.';// 認証中でなければエラー
		}
		
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


		// アップロードファイル名を変換する。
		$ent = $this->convUploadFileName($ent,$_FILES);

		// 更新ユーザーなど共通フィールドをセットする。
		$ent = $this->setCommonToEntity($ent);
	
		// エンティティをDB保存
		$this->Rec->begin();
		$ent = $this->Rec->saveEntity($ent,$regParam);
		$this->Rec->commit();//コミット
		
		// ファイルアップロード関連の一括作業
		$res = $this->workFileUploads($form_type,$this->dp_tmpl, $this->viaDpFnMap, $ent, $_FILES);
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
		App::uses('Sanitize', 'Utility');
	
		$this->autoRender = false;//ビュー(ctp)を使わない。
		if(empty($this->Auth->user())) return 'Error:login is needed.';// 認証中でなければエラー
	
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
		$this->Rec->begin();
		if($eliminate_flg == 0){
			$ent = $this->Rec->saveEntity($ent,$regParam); // 更新
		}else{
			$this->Rec->eliminateFiles($ent['id'], 'img_fn', $ent, $this->dp_tmpl, $this->viaDpFnMap); // ファイル抹消（他のレコードが保持しているファイルは抹消対象外）
			$this->Rec->delete($ent['id']); // 削除
		}
		$this->Rec->commit();//コミット
	
		$ent=Sanitize::clean($ent, array('encode' => true));//サニタイズ（XSS対策）
		$json_data=json_encode($ent);//JSONに変換
	
		return $json_data;
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
		$this->Rec->begin();
		$this->Rec->saveAll($data); // まとめて保存。内部でSQLサニタイズされる。
		$this->Rec->commit();

		$res = array('success');
		
		$json_str = json_encode($res);//JSONに変換
		
		return $json_str;
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
		
		$this->csv_fu_base($this->Rec,array('id','rec_val','rec_name','rec_date','rec_group','rec_dt','rec_flg','img_fn','note','sort_no'));
		
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
		
		
		// ユーザーエージェントなど特定の項目をダブルクォートで囲む
		foreach($data as $i=>$ent){
			if(!empty($ent['user_agent'])){
				$data[$i]['user_agent']='"'.$ent['user_agent'].'"';
			}
		}

		
		
		//列名配列を取得
		$clms=array_keys($data[0]);
	
		//データの先頭行に列名配列を挿入
		array_unshift($data,$clms);
	
	
		//CSVファイル名を作成
		$date = new DateTime();
		$strDate=$date->format("Y-m-d");
		$fn='rec'.$strDate.'.csv';
	
	
		//CSVダウンロード
		App::uses('CsvDownloader','Vendor/Wacg');
		$csv= new CsvDownloader();
		$csv->output($fn, $data);
		 
	
	
	}
	
	

	
	
	//ダウンロード用のデータを取得する。
	private function getDataForDownload(){
		 
		
		//セッションから検索条件情報を取得
		$kjs=$this->Session->read('rec_kjs');
		
		// セッションからページネーション情報を取得
		$pages = $this->Session->read('rec_pages');

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
		$data=$this->Rec->findData($crudBaseData);
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
			array('name'=>'kj_title_id','def'=>null),
			array('name'=>'kj_rec_date','def'=>null),
			array('name'=>'kj_note','def'=>null),
			array('name'=>'kj_rec_ctg_id','def'=>null),
			array('name'=>'kj_img_fn','def'=>null),
			array('name'=>'kj_img_dp','def'=>null),
			array('name'=>'kj_ref_url','def'=>null),
			array('name'=>'kj_no_a','def'=>null),
			array('name'=>'kj_no_b','def'=>null),
			array('name'=>'kj_rec_title','def'=>null),
			array('name'=>'kj_parent_id','def'=>null),
			array('name'=>'kj_public_flg','def'=>null),
			array('name'=>'kj_sort_no','def'=>null),
			array('name'=>'kj_delete_flg','def'=>0),
			array('name'=>'kj_update_user','def'=>null),
			array('name'=>'kj_ip_addr','def'=>null),
			array('name'=>'kj_created','def'=>null),
			array('name'=>'kj_modified','def'=>null),

				// CBBXE
				
			array('name'=>'row_limit','def'=>20),
				
		);
		
		
		
		
		
		/// 検索条件のバリデーション
		$this->kjs_validate=array(
				
				// CBBXS-1001
				'kj_id' => array(
						'naturalNumber'=>array(
								'rule' => array('naturalNumber', true),
								'message' => 'IDは数値を入力してください',
								'allowEmpty' => true
						),
				),
				'kj_title_id' => array(
						'custom'=>array(
								'rule' => array( 'custom', '/^[-]?[0-9]+$/' ),
								'message' => 'タイトルは整数を入力してください。',
								'allowEmpty' => true
						),
				),
				'kj_rec_date'=> array(
						'maxLength'=>array(
								'rule' => array('maxLength', 20),
								'message' => '記録日付は20文字以内で入力してください',
								'allowEmpty' => true
						),
				),
				'kj_note'=> array(
						'maxLength'=>array(
								'rule' => array('maxLength', 1000),
								'message' => 'ノートは1000文字以内で入力してください',
								'allowEmpty' => true
						),
				),
				'kj_rec_ctg_id' => array(
						'custom'=>array(
								'rule' => array( 'custom', '/^[-]?[0-9]+$/' ),
								'message' => '記録カテゴリは整数を入力してください。',
								'allowEmpty' => true
						),
				),
				'kj_img_fn'=> array(
						'maxLength'=>array(
								'rule' => array('maxLength', 255),
								'message' => '画像は128文字以内で入力してください',
								'allowEmpty' => true
						),
				),
				'kj_img_dp'=> array(
						'maxLength'=>array(
								'rule' => array('maxLength', 255),
								'message' => '画像ディレクトリパスは128文字以内で入力してください',
								'allowEmpty' => true
						),
				),
				'kj_ref_url'=> array(
						'maxLength'=>array(
								'rule' => array('maxLength', 255),
								'message' => '参照URLは2083文字以内で入力してください',
								'allowEmpty' => true
						),
				),
				'kj_no_a' => array(
						'custom'=>array(
								'rule' => array( 'custom', '/^[-]?[0-9]+$/' ),
								'message' => '番号Aは整数を入力してください。',
								'allowEmpty' => true
						),
				),
				'kj_no_b' => array(
						'custom'=>array(
								'rule' => array( 'custom', '/^[-]?[0-9]+$/' ),
								'message' => '番号Bは整数を入力してください。',
								'allowEmpty' => true
						),
				),
				'kj_rec_title'=> array(
						'maxLength'=>array(
								'rule' => array('maxLength', 255),
								'message' => 'rec_titleは50文字以内で入力してください',
								'allowEmpty' => true
						),
				),
				'kj_parent_id' => array(
						'naturalNumber'=>array(
								'rule' => array('naturalNumber', true),
								'message' => '親IDは数値を入力してください',
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
					'row_order'=>'Rec.id',//SQLでの並び替えコード
					'clm_show'=>1,//デフォルト列表示 0:非表示 1:表示
			),
			'title_id'=>array(
					'name'=>'タイトル',
					'row_order'=>'Rec.title_id',
					'clm_show'=>1,
			),
			'rec_date'=>array(
					'name'=>'記録日付',
					'row_order'=>'Rec.rec_date',
					'clm_show'=>1,
			),
			'note'=>array(
					'name'=>'ノート',
					'row_order'=>'Rec.note',
					'clm_show'=>1,
			),
			'rec_ctg_id'=>array(
					'name'=>'記録カテゴリ',
					'row_order'=>'Rec.rec_ctg_id',
					'clm_show'=>1,
			),
			'img_fn'=>array(
					'name'=>'画像',
					'row_order'=>'Rec.img_fn',
					'clm_show'=>1,
			),
			'img_dp'=>array(
					'name'=>'画像ディレクトリパス',
					'row_order'=>'Rec.img_dp',
					'clm_show'=>1,
			),
			'ref_url'=>array(
					'name'=>'参照URL',
					'row_order'=>'Rec.ref_url',
					'clm_show'=>0,
			),
			'no_a'=>array(
					'name'=>'番号A',
					'row_order'=>'Rec.no_a',
					'clm_show'=>0,
			),
			'no_b'=>array(
					'name'=>'番号B',
					'row_order'=>'Rec.no_b',
					'clm_show'=>0,
			),
			'rec_title'=>array(
					'name'=>'rec_title',
					'row_order'=>'Rec.rec_title',
					'clm_show'=>0,
			),
			'parent_id'=>array(
					'name'=>'親ID',
					'row_order'=>'Rec.parent_id',
					'clm_show'=>0,
			),
			'public_flg'=>array(
					'name'=>'公開',
					'row_order'=>'Rec.public_flg',
					'clm_show'=>1,
			),
			'sort_no'=>array(
					'name'=>'順番',
					'row_order'=>'Rec.sort_no',
					'clm_show'=>0,
			),
			'delete_flg'=>array(
					'name'=>'削除',
					'row_order'=>'Rec.delete_flg',
					'clm_show'=>0,
			),
			'update_user'=>array(
					'name'=>'更新者',
					'row_order'=>'Rec.update_user',
					'clm_show'=>0,
			),
			'ip_addr'=>array(
					'name'=>'IPアドレス',
					'row_order'=>'Rec.ip_addr',
					'clm_show'=>0,
			),
			'created'=>array(
					'name'=>'生成日時',
					'row_order'=>'Rec.created',
					'clm_show'=>0,
			),
			'modified'=>array(
					'name'=>'更新日時',
					'row_order'=>'Rec.modified',
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