$(function() {


	//▽出荷データ一覧の列表示切替機能の初期化
	var iniClmData1=[1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,1,1,1,0,1,0,0,0,0];// 1:初期表示   0:初期非表示
	var csh1=new ClmShowHide();
	csh1.init('shipping_table','shipping_clm_cbs',iniClmData1);

});
