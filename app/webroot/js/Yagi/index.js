/**
 * ヤギAjaxサンプルindexのJS
 * 2015-11-12	新規作成
 */
var yagiAction=new YagiAction();

$( function() {
	
	var debug_slc="#ajax_debug";
	var webroot=$('#webroot').val();
	
	yagiAction.init(webroot,debug_slc);
	
});

function yagiActionExecution(){
	yagiAction.execution(yagiAction);
}