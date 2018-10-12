<?php 

	// CrudBaseヘルパーへ各種パラメータをセットする。
	$this->CrudBase->setCrudBaseParam(array(
			'bigDataFlg'=>$bigDataFlg,
			'debug_mode'=>$debug_mode,
			'dp_tmpl'=>$dp_tmpl,
			'viaDpFnMap'=>$viaDpFnMap,
	));
	
	$this->CrudBase->setKjs($kjs);
	
	$model_name_s = $this->CrudBase->getModelNameSnk();//スネーク記法モデル名
?>
<!-- CrudBase共通 -->





<div style="width:1px;height:20px;clear:both"></div>


<input type="button" value="列表示切替" class="btn btn-default btn-sm" onclick="$('#clm_cbs_detail').toggle(300)" />
<div id="clm_cbs_detail" style="display:none;margin-top:5px">
<div id="clm_cbs_rap">
	<p>列表示切替</p>
	<div id="clm_cbs"></div>
	
	<a href="#help_csh" class="livipage btn btn-info btn-xs" title="ヘルプ"><span class="glyphicon glyphicon-question-sign"></span></a>
</div>
<hr class="hr_purple">
</div>

<button type="button" class="btn btn-default" onclick="session_clear()" >セッションクリア</button>




<div style="width:1px;height:20px"></div>
<!-- CrudBase共通 ・ここまで -->