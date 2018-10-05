<?php
$this->assign('css', $this->Html->css(array('ClmSorter/index')));
$this->assign('script', $this->Html->script(array('ClmSorter/index'),array('charset'=>'utf-8')));
$debug_mode=Configure::read('debug');//デバッグモード取得	0:実務モード    1:デバッグモード
$display_none='';
if($debug_mode == 0){
	$display_none='display:none';
}
?>



<h2>列並替機能</h2>

<div style="margin-left:46px;margin-bottom:15px">
	列の並べ替えは、列名ラベルをマウスのドラッグ＆ドロップで入れ替えてください。<br>
	また、列名ラベルのチェックボックスで列の表示切替ができます。<br>
</div>

<div id="btns" >

	
	<div class="btn-group">
		<a id="rtn_btn" class="btn btn-primary btn-lg" href="<?php echo $rtn_url ?>" title='列の並べ替えおよび列表示切替を適用します。'>
			<span class="glyphicon glyphicon-circle-arrow-left"></span>
		</a>
		<button id="ok_btn" type="button" class="btn btn-success btn-lg" onclick="ok_btn()" title='元の画面に戻ります。'>
			<span class="glyphicon glyphicon-ok"></span>
		</button>
	</div>
	<span id="ok_btn_success" >　列の並べ替えを適用しました。</span>
	
	<button class="btn btn-primary btn-xs" onclick="def_btn()" title="初期の列並びに戻します。"><span class="glyphicon glyphicon-warning-sign"></span></button>
</div>


<input id="webroot" type="hidden" value="<?php echo $this->Html->webroot?>" />
<div id="err_msg" style="color:red"></div>
<div id="debug_dump" style="color:#888888;<?php echo $display_none?>"></div>

<input id="page_code" type="hidden" value="<?php echo $page_code?>" />

<ul id="field_data">
<?php 
	//列並替リストを組み立て表示
	$chks=array(0=>'',1=>'checked');
	foreach($active as $ent){
		$clm_show=$ent['clm_show'];
		$fm_clm_show="<input type='checkbox' class='clm_show' {$chks[$clm_show]} value='1' />";
		$fm_name="<input type='hidden' class='name' value='{$ent['name']}' />";
		$fm_row_order="<input type='hidden' class='row_order' value='{$ent['row_order']}' />";
		$fm_name="<input type='hidden' class='f_name' value='{$ent['name']}' />";
		
		echo "<li id='{$ent['id']}' class='label label-primary'>{$fm_clm_show}&nbsp;{$ent['name']}{$fm_name}{$fm_row_order}</li>\n";
	}
?>
</ul>
<hr>

