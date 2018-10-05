<?php 

	// CrudBase 1.8.2 までの仕様　削除予定■■■□□□■■■□□□■■■□□□

	//<!-- 数値範囲入力スライダー・noUiSlider -->
	
	$detail_noui = $field.'_detail';
?>
<table class="nouislider_rap">
	<tr><td>
		<span class="nusr_label"><?php echo $wamei; ?>による範囲検索</span>&nbsp;
		<span id="<?php echo $field ?>_preview" class="nusr_preview"></span>
	</td></tr>
	<tr>
		<td><div id="<?php echo $field ?>_slider" title="<?php echo $wamei; ?>による範囲検索"></div></td>
		<td><input type="button" class="nusr_toggle_btn" value="" onclick="$('#<?php echo $detail_noui?>').fadeToggle()" title="日付範囲入力を表示します"></td>
	</tr>
	<tr id="<?php echo $detail_noui ?>" class="nusr_detail">
		<td>
			<div class="kj_div">
			<?php
			$key='kj_'.$field.'1';
			echo $this->Form->input($key, array(
					'id' => $key,
					'value' => $kjs[$key],
					'type' => 'number',
					'label' => false,
					'style'=>'width:50px',
					'title'=>$wamei.'による範囲検索',
			));
			?>
			</div>
			<div class="kj_div">～</div>
			<div class="kj_div">
			<?php
			$key='kj_'.$field.'2';
			echo $this->Form->input($key, array(
					'id' => $key,
					'value' => $kjs[$key],
					'type' => 'number',
					'label' => false,
					'style'=>'width:50px',
					'title'=>$wamei.'による範囲検索',
			));
			?>
			</div>
		</td>

		<td></td>
	</tr>
</table>