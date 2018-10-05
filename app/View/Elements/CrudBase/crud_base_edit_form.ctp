<?php 
echo $this->Form->input('referer', array('value' => $referer,'type' => 'hidden',));//リファラ
echo $this->Form->input('mode', array('value' => $mode,'type' => 'hidden',));//モード
echo "<input type='hidden' id='reload' name='reload' value='' />\n";//リロードチェック用
?>
