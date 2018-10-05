<?php 

	// CrudBase 1.8.2 までの仕様　削除予定■■■□□□■■■□□□■■■□□□

	$kj_xxx_date_ym = 'kj_'.$field.'_ym';
	$kj_xxx_date1 = 'kj_'.$field.'1';
	$kj_xxx_date2 = 'kj_'.$field.'2';
	$kj_xxx_dates = 'kj_'.$field.'s';
?>

<div class="kj_div" style="margin-right:2px">

	<?php
	echo $this->Form->input($kj_xxx_date_ym, array(
			'id' => $kj_xxx_date_ym,
			'value' => $kjs[$kj_xxx_date_ym],
			'type' => 'text',
			'label' => false,
			'placeholder' => '-- '.$wamei.'年月 --',
			'style'=>'width:100px;',
	));
	?>

</div>
<div class="kj_div">
	<input type="button" class="ympicker_toggle_btn" value="" onclick="$('.<?php echo $kj_xxx_dates;?>').fadeToggle()" title="日付範囲入力を表示します" />
</div>

<div class="kj_div <?php echo $kj_xxx_dates;?>" style="display:none">
	<?php
	echo $this->Form->input($kj_xxx_date1, array(
			'id' => $kj_xxx_date1,
			'value' => $kjs[$kj_xxx_date1],
			'type' => 'text',
			'label' => false,
			'placeholder' => '-- '.$wamei.'日【範囲1】--',
			'style'=>'width:150px',
			'title'=>'入力日以降を検索',
	));
	?>
</div>

<div class="kj_div <?php echo $kj_xxx_dates;?>" style="display:none">
	<?php
	echo $this->Form->input($kj_xxx_date2, array(
			'id' => $kj_xxx_date2,
			'value' => $kjs[$kj_xxx_date2],
			'type' => 'text',
			'label' => false,
			'placeholder' => '-- '.$wamei.'日【範囲2】--',
			'style'=>'width:150px',
			'title'=>'入力日以前を検索',
	));
	?>
</div>