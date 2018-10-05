/**
 * 列表示切替用のJavaScript
 * 2015-05-08 新規作成
 */


$(function() {



	//列表示の初期化
	init_clm_display();


});

//列表示の初期化
function init_clm_display(){
	$.each($("#cds input[type='checkbox']"), function() {

		var checked=$(this).prop('checked');
		if(checked==false ||checked==''){
			var id=$(this).attr('id');
			var clmId=id.replace('cds','clm');

			//列表示切替
			clm_display_switching(clmId);

		}

	});

}


//すべての列表示切替チェックボックスにチェックを入れる。
function cds_all_chack(){

	$.each($("#cds input[type='checkbox']"), function() {

		var checked=$(this).prop('checked');
		if(checked==false ||checked==''){
			$(this).prop('checked',true);
			var cdsId=$(this).attr('id');
			var clmId=cdsId.replace('cds','clm');//一覧テーブル列のID
			clm_display_show(clmId);//列IDで指定した列を表示する

		}

	});

}


//列表示切替チェックボックスのチェックをデフォルトに戻す。
function cds_default(){


	$.each($("#cds input[class='def_cds']"), function() {
		var def_v=$(this).val();
		var def_id=$(this).attr('id');
		var cdsId=def_id.replace('def_cds','cds');//列表示切替チェックボックスのID
		var clmId=def_id.replace('def_cds','clm');//一覧テーブル列のID


		if(def_v =='' || def_v==null){
			$("#" + cdsId).prop('checked',false);
			clm_display_hide(clmId)
		}else{
			$("#" + cdsId).prop('checked',true);
			clm_display_show(clmId);
		}


	});



}



//列の表示切替
function clm_display_switching(clm){


	var clmObj=$("#" + clm);
	clmObj.toggle();

	var clm_index=clmObj.index();

	$.each($("#tbl1 tbody tr"), function() {

		var td=$(this).children();
		td.eq(clm_index).toggle();

	});


}

//列を表示
function clm_display_show(clm){


	var clmObj=$("#" + clm);
	clmObj.show();

	var clm_index=clmObj.index();

	$.each($("#tbl1 tbody tr"), function() {

		var td=$(this).children();
		td.eq(clm_index).show();

	});


}

//列を表示
function clm_display_hide(clm){


	var clmObj=$("#" + clm);
	clmObj.hide();

	var clm_index=clmObj.index();

	$.each($("#tbl1 tbody tr"), function() {

		var td=$(this).children();
		td.eq(clm_index).hide();

	});


}




