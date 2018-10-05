$(function() {


	//▽入金データ一覧の列表示切替機能の初期化
	var iniClmData2=[1,0,1,1,1,1,1,1,1,0,0,0,0,0];// 1:初期表示   0:初期非表示
	var csh2=new ClmShowHide();
	csh2.init('payment_table','payment_clm_cbs',iniClmData2,'rkt_order_sale_edit');

});
