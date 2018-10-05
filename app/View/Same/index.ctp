<?php

$this->assign('script', $this->Html->script(array(
		'jquery.upload-1.0.2.min',		//ファイルアップロード用ライブラリ
		'livipage',
		'Same/index'			//当画面専用JavaScript
),array('charset'=>'utf-8')));


?>


<h2>サメファイル読込</h2>
ファイル読込のデモシステムです。
<hr>






<input type='hidden' id="webroot" value='<?php echo $this->Html->webroot?>' />

<input type="file" name="file1" id="file1" class="btn btn-warning" ><br />

<a id="reload_a" style="display:none" href="<?php echo $this->Html->webroot?>same/">CSV読み直し</a>
<div id="loading" style="color:blue;display:none"><img src="<?php echo $this->Html->webroot?>img/Same/loading.gif" /><span id="loading_msg">CSVファイルを読込中です。しばらくお待ちください・・・</span></div>
<div id="res" style="margin:20px;background-color:#eff8fc"></div>
<div id="err_msg" style="color:red"></div>
<br>





<!-- ヘルプ用  -->
<input type="button" class="btn btn-info btn-sm" onclick="$('#help_x').toggle()" value="ヘルプ" />
<div id="help_x" class="help_x" style="display:none">
	<h2>ヘルプ</h2>

	Ajaxによるファイル読込です。<br>
	CSV読込機能、画像アップロード機能などに応用できます。<br>
	<br>
	
	巨大なファイルをアップロードすると「Warning: POST Content-Length of ...」というエラーが発生します。<br>
	<br>
	
</div>




