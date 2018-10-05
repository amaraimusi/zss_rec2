<?php

$this->CrudBase->hiddenX('act_flg',1);
$this->CrudBase->hiddenX('page_no',$pages['page_no'] );
$this->CrudBase->hiddenX('sort_field',$pages['sort_field'] );
$this->CrudBase->hiddenX('sort_desc',$pages['sort_desc'] );
$this->CrudBase->hiddenX('webroot',$this->Html->webroot );
$this->CrudBase->hiddenX('csh_json',$csh_json );
$this->CrudBase->hiddenX('bigDataFlg',$bigDataFlg );
$this->CrudBase->hiddenX('debug_mode',$debug_mode );
$this->CrudBase->hiddenX('row_exc_flg',$row_exc_flg );
$this->CrudBase->hiddenX('def_kjs_json',$def_kjs_json );
$this->CrudBase->hiddenX('kjs_json',$kjs_json );
$this->CrudBase->hiddenX('dpt_json',json_encode($dptData,true));// ファイルアップロード用のディレクトリパステンプレート情報

?>