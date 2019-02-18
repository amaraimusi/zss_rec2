<?php

// CrudBaseヘルパーの初期化。各種パラメータをセットする。
$this->CrudBase->init(array(
		'model_name'=>$model_name_c,
		'bigDataFlg'=>$bigDataFlg,
		'debug_mode'=>$debug_mode,
));