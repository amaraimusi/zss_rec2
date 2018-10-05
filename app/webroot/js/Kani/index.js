

$(function() {

	init();//初期化

});


/// カニ数値の数値範囲入力スライダー
var nusrKaniVal = new NoUiSliderWrap();

/// 列表示切替機能
var clmShowHide=new ClmShowHide();




/**
 * カニ画面の初期化
 * 
 * ◇主に以下の処理を行う。
 * - 日付系の検索入力フォームにJQueryカレンダーを組み込む
 * - 列表示切替機能の組み込み
 * - 数値範囲系の検索入力フォームに数値範囲入力スライダーを組み込む
 * 
 * @date 2015/10/16 新規作成
 * @author k-uehara
 */
function init(){
	//日付系の検索入力フォームにJQueryカレンダーを組み込む。
	$("#kj_kani_date1").datepicker({
		dateFormat:'yy-mm-dd'
	});
	$("#kj_kani_date2").datepicker({
		dateFormat:'yy-mm-dd'
	});



	//▽列表示切替機能の初期化
	var iniClmData=[1,1,1,1,1,1,0,1,0,0,0,0];// 1:初期表示   0:初期非表示
	clmShowHide.init('kani_tbl','clm_cbs',iniClmData,'rkt_kani_index');


	// 年月選択により月初日、月末日らのテキストボックスを連動させる。
	ympicker_tukishomatu('kj_kani_ym','kj_kani_date1','kj_kani_date2');

	//noUiSliderの初期化（数値範囲入力スライダー）
	nusrKaniVal.init(nusrKaniVal,{
			'slider':'#kani_val_slider',
			'tb1':'#kj_kani_val1',
			'tb2':'#kj_kani_val2',
			'value_preview':'#kani_val_preview',
			'step':5,
			'min':0,
			'max':200,
		});
}



/**
 * 詳細検索フォーム表示切替
 * 
 * 詳細ボタンを押した時に、実行される関数で、詳細検索フォームを表示します。
 */
function show_kj_detail(){
	$("#kjs2").fadeToggle();
}



/**
 * 検索条件をリセットする
 * 
 * リセット対象外フィールドを指定することができます。
 * 
 * @param array exempts リセット対象外フィールド配列（省略可）
 */
function resetKjs(exempts){
	
	if(exempts==null){
		exempts=[];
	}
	
	//デフォルト検索条件JSONを取得およびパースする。
	var def_kjs_json=$('#def_kjs_json').html();
	var defKjs=$.parseJSON(def_kjs_json);
	
	for(var key in defKjs){
		
		//リセット対象外でなければ、検索条件入力フォームをリセットする。
		if(exempts.indexOf(key) < 0){
			$('#' + key).val(defKjs[key]);
		}
		
	}
	
	
	//数値範囲入力スライダー・noUiSliderの再表示(nouislider_rap.js)
	nusrKaniVal.reload();
	
}















