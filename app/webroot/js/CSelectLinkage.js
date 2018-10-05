
/**
 * CSelectLinkage.js カテゴリ連動型SELECT
 * 
 * @note
 * カテゴリ連動型SELECTはカテゴリSELECTと主SELECTの２つから構成される。
 * カテゴリSELECTで選択を行うと、連動して主SELECTの選択リストはカテゴリに属したリストに切り替わる。
 * 
 * 初期値は主SELECTのdata-value属性にセットする。
 * 例→ <select id="animal_sel" data-value="4" ></select>
 * ※ param.valueに初期値をセットしても良い
 * 
 * @version 1.3.1 resetを追加
 * @date 2016-11-11 | 2017-2-8
 * 
 * @param param
 * - main_select_slt	主SELECTのセレクタ	
 * - category_select_slt	カテゴリSELECTのセレクタ	
 * - data	エンティティの配列型データ	
 * - main_value_field	エンティティの主値フィールド名	
 * - category_field	エンティティのカテゴリフィールド名	
 * - display_name_field	エンティティの表記フィールド 	
 * - empty	主SELECTの未選択時の表記名	nullをセットすると未選択項目は表示されない。
 * - all_category_flg	全カテゴリフラグ	trueにすると、カテゴリSELECTで空を選択した際、主SELECTを全カテゴリの選択肢を表示する。
 * - def_value	初期値
 */
var CSelectLinkage =function(param){
	
	
	this.param = param;
	
	this.opHtmHash = {}; // 選択肢HTMLハッシュテーブル (key:カテゴリ値 , value:選択肢HTML)
	
	this.allOpHtm = "" // 全選択HTML
		
	this.old_category_v = -1;// 旧カテゴリ値
	
	var myself=this; // Instance of myself.

	/**
	 * initialized.
	 */
	this.constract=function(){
		
		// If Param property is empty, set a value.
		this.param = setParamIfEmpty(this.param);
		
		// 選択肢HTMLハッシュテーブルを生成する。
		this.opHtmHash = createHtmlHashTable(this.param);
		
		// 全カテゴリフラグがtrueなら全選択HTMLを生成する
		if(this.param.all_category_flg){
			this.allOpHtm = createAllOptionHtml(this.param);
		}
		
		// 初期値をセットする
		setDefaultValue(this.param);
		

		// カテゴリSELECTにチェンジイベントを登録
		$(myself.param.category_select_slt).click(function(e){
			
			var category_v=$(this).val();
			
			// カテゴリSELECTチェンジイベント
			categorySelectChange(category_v);

		});
		
	};
	
	// If Param property is empty, set a value.
	function setParamIfEmpty(param){
		
		if(param == undefined){
			param = {};
		}
		
		// 主SELECTのセレクタ
		if(param['main_select_slt'] == undefined){
			throw new Error('A main_select_slt is empty');
		}

		// カテゴリSELECTのセレクタ
		if(param['category_select_slt'] == undefined){
			throw new Error('A category_select_slt is empty');
		}

		// エンティティの配列型データ
		if(param['data'] == undefined){
			throw new Error('The data is empty');
		}

		// エンティティの主値フィールド名
		if(param['main_value_field'] == undefined){
			param['main_value_field'] = 'id';
		}

		// エンティティのカテゴリフィールド名
		if(param['category_field'] == undefined){
			param['category_field'] = 'category_id';
		}

		// エンティティの表記フィールド 
		if(param['display_name_field'] == undefined){
			param['display_name_field'] = 'category_name';
		}

		// 主SELECTの未選択時の表記名
		if(param['empty'] == undefined){
			param['empty'] = null;
		}

		// カテゴリSELECTの全カテゴリの表記名
		if(param['all_category_flg'] == undefined){
			param['all_category_flg'] = false;
		}

		// 初期値
		if(param['def_value'] == undefined){
			param['def_value'] = null;
		}
		
		return param;
	};
	
	/**
	 * 主SELECTに値をセットする
	 * 
	 * @note
	 * セットした値に合わせて、主SELECTおよびカテゴリSELECTを更新する。
	 */
	this.setValue = function(def_value){
		
		
		param = myself.param;
		
		var msElm = $(param.main_select_slt); // 主SELECT要素
		
		
		// デフォルト値からデフォルトカテゴリ値を取得する
		var def_category_value = null; // デフォルトカテゴリ値
		var data = param.data;
		for(var i in data){
			var ent = data[i];
			var main_v = ent[param.main_value_field]; // 主値を取得
			
			// 主値とデフォルト値が一致するなら、そのエンティティのカテゴリ値をデフォルトカテゴリ値として取得する
			if(main_v == def_value){
				def_category_value = ent[param.category_field];
				break;
			}
		}

		var csElm = $(param.category_select_slt); // カテゴリSELECT要素
		
		// カテゴリSELECTにデフォルトカテゴリ値をセットする
		if(def_category_value!==null){
			csElm.val(def_category_value);
			
			// 主SELECTのoption部分を切り替える
			changeOptionHtml(def_category_value);
			
			// 主SELECTに初期値をセット
			msElm.val(def_value);
		}else{
			setForNone();// 値なしの場合の設定処理
		}
		
		myself.old_category_v = def_category_value;
	}
	
	
	/**
	 * リフレッシュ
	 * 
	 * @note
	 * 主SELECTのdata-value属性値に合わせて、主SELECTおよびカテゴリSELECTを更新する。
	 */
	this.refresh = function(){
		var msElm = $(param.main_select_slt); // 主SELECT要素
		
		// 主SELECT要素にdata-value属性がセットされているなら、初期値として取得する
		var def_value = msElm.attr('data-value');
		if(!def_value){
			def_value = '';
		}

		myself.setValue(def_value);
	};
	
	/**
	 * リセット
	 */
	this.reset = function(){
		var category_v='';
		
		var csElm = $(param.category_select_slt); // カテゴリSELECT要素
		csElm.val('');
		
		// カテゴリSELECTチェンジイベント
		categorySelectChange(category_v);
	}
	
	
	
	/**
	 * 選択肢HTMLハッシュテーブルを生成する。
	 * @param param
	 * @return 選択肢HTMLハッシュテーブル
	 */
	function createHtmlHashTable(param){

		// ３つのフィールド名（主値、カテゴリ値、主表記）をparamから取得する
		var main_f = param.main_value_field;
		var category_f = param.category_field;
		var display_f = param.display_name_field;
		
		// カテゴリごとにデータを分類する
		var data2 = {}; // データ2【分類済】
		for(var i in param.data){
			var ent = param.data[i];
			
			// 主値、カテゴリ値、主表記をそれぞれ取得する
			var main_v = ent[main_f];
			var category_v = ent[category_f];
			var display_v = ent[display_f];

			// カテゴリごとに分類
			var ent2 = {'main_v':main_v,'display_v':display_v};
			if(!data2[category_v]){
				data2[category_v]= [];
			}
			data2[category_v].push(ent2);

		}
		
		
		
		
		// 未選択オプションを作成
		var emptyOption = "";
		if(param.empty){
			emptyOption = makeEmptyOption();// 未選択optionを作成する
		}
		
		var hash = {} // 選択肢HTMLハッシュテーブル
		
		// 選択肢HTMLハッシュテーブルを作成する
		for(var category_v in data2){
			var list = data2[category_v];
		
			var opHtm = emptyOption; // 選択肢HTML
			
			// 選択肢HTMLを作成する
			for(var i in list){
				var ent2 = list[i];
				var display_v = xssSanitaizeEncode(ent2.display_v); // XSSサニタイズ（「<>」記号をエンコードしないと選択肢が消えていしまうバグがある）
				opHtm += "<option value='" + ent2.main_v + "'>" + display_v + "</option>\n";
			}
			
			hash[category_v] = opHtm;
			
		}
		
		return hash;
	};
	
	/**
	 * 未選択optionを作成する
	 * @returns 未選択option
	 */
	function makeEmptyOption(){
		return "<option value=''>" + myself.param.empty + "</option>\n";
	}
	
	//XSSサニタイズエンコード
	function xssSanitaizeEncode(str){
		if(typeof str == 'string'){
			return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}else{
			return str;
		}
	}
	
	
	
	
	/**
	 * 全選択HTMLを生成する
	 * @param param
	 * @return 全選択HTML
	 */
	function createAllOptionHtml(param){
		// ３つのフィールド名（主値、カテゴリ値、主表記）をparamから取得する
		var main_f = param.main_value_field;
		var category_f = param.category_field;
		var display_f = param.display_name_field;
		
		// 未選択オプションを作成
		var emptyOption = "";
		if(param.empty){
			emptyOption = "<option value=''>" + param.empty + "</option>\n";
		}
		
		var opHtm = emptyOption; // 全選択HTML
		for(var i in param.data){
			var ent = param.data[i];
			
			// 主値、カテゴリ値、主表記をそれぞれ取得する
			var main_v = ent[main_f];
			var display_v = ent[display_f];

			opHtm += "<option value='" + main_v + "'>" + display_v + "</option>\n";
			
		}
		
		return opHtm;
		
	};
	
	
	
	
	/**
	 * 初期値をセットする
	 */
	function setDefaultValue(param){
		
		var msElm = $(param.main_select_slt); // 主SELECT要素
		
		var def_value = null; // 初期値
		
		// 主SELECT要素にdata-value属性がセットされているなら、初期値として取得する
		def_value = msElm.attr('data-value');

		// 初期値が取得できなかった場合、paramから取得を試みる。
		if(def_value==null){
			def_value = param.def_value;
		}
		
		// ここまでで初期値を取得できなかった場合、処理を抜ける。
		if(def_value==null){
			setForNone();// 値なしの場合の設定処理
			return;
		}
		
		myself.setValue(def_value);
		

	};
	
	
	
	
	
	
	/**
	 * カテゴリSELECTチェンジイベント
	 * @param category_v カテゴリ値
	 */
	function categorySelectChange(category_v){

		if(myself.old_category_v==category_v){
			return;
		}
		
		if(category_v == undefined || category_v == ""){
			// 全カテゴリフラグがtrueなら全選択HTMLをセットする
			if(myself.param.all_category_flg){
				$(myself.param.main_select_slt).html(myself.allOpHtm);
			}else{
				emptyOption = makeEmptyOption();// 未選択optionを作成する
				$(myself.param.main_select_slt).html(emptyOption);
			}
			
		}else{
			// 主SELECTのoption部分を切り替える
			changeOptionHtml(category_v);
		}
		myself.old_category_v = category_v;

		
	}

	/**
	 * 主SELECTのoption部分を切り替える
	 * @param category_v カテゴリ値
	 */
	function changeOptionHtml(category_v){
		// 選択肢HTMLハッシュテーブルから選択肢HTMLを取得する
		var opHtml = myself.opHtmHash[category_v];
		
		if(!opHtml){
			opHtml="";
		}
		
		// 主SELECTのoption部分を切り替える
		$(myself.param.main_select_slt).html(opHtml);
	}
	
	
	// 値なしの場合の設定処理
	function setForNone(){
		if(myself.param.all_category_flg){
			$(myself.param.main_select_slt).html(myself.allOpHtm);
		}
	}

	// call constractor method.
	this.constract();
};