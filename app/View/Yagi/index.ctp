<?php
	$this->assign('script', $this->Html->script(array(
			'Yagi/yagi_action',			//管制チャット画面
			'Yagi/index'				//当画面専属JSファイル
		)));
?>

<h1>ヤギAjaxサンプル</h1>

<button type="button" class="btn btn-danger" onclick="yagiActionExecution()">AJAX通信テスト</button>

<div id="ajax_res"></div>
<input type="hidden" id="webroot" value="<?php echo $this->html->webroot; ?>" />
<hr>
<div id="ajax_debug"></div>