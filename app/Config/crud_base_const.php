<?php
/**
 * CrudBase定数ファイル
 * 
 * @version 1.2
 * @date 2016-2-5 新規作成
 * 
 */



// 値種別定数    この定数を主に利用しているファイルと関数 → 「app/View/Helper/AppHelper.php : ent_show_x」
define('CB_FLD_SANITAIZE','1'); // サニタイズ
define('CB_FLD_MONEY','2'); // 金額表記
define('CB_FLD_DELETE_FLG','3'); // 有無フラグ
define('CB_FLD_BR','4'); // 改行brタグ化
define('CB_FLD_BOUTOU','5'); // 長文字の冒頭
define('CB_FLD_TEXTAREA','6'); // テキストエリア用（改行対応）
define('CB_FLD_NULL_ZERO','7');// nullは0表記
define('CB_FLD_TA_CSV','8');// テキストエリアCSV出力用