<?php
	
	$this->assign('css', $this->Html->css(array(
			'clm_show_hide',				//列表示切替
			'ympicker_rap',					//年月ダイアログ
			'nouislider.min',				//数値範囲入力スライダー・noUiSlider
			'NoUiSliderWrap',				//noUiSliderのラップ
			'CrudBase/index',				//CRUD共通
			'Kani/index',			//当画面専用CSS
	)));
	
	$this->assign('script', $this->Html->script(array(
			'clm_show_hide',				//列表示切替
			'date_ex',						//日付関連関数集
			'jquery.ui.ympicker',			//年月選択ダイアログ
			'ympicker_rap',					//年月選択ダイアログのラップ
			'nouislider.min',				//数値範囲入力スライダー・noUiSlider
			'NoUiSliderWrap',				//noUiSliderのラップクラス
			'CrudBase/index',				//CRUD共通
			'CrudBase/LogForWorkerThread',	//ワーカー用ログ
			'Kani/woker_thread',		//当画面専用のワーカースレッド（定期リロード）
			'Kani/notifi_worker',	//状況通知ワーカー（ワーカースレッド内）
			'Kani/index',			//当画面専用JavaScript
			
	)));
?>



<h2>カニ</h2>
<p>kani ver 1.1</p>

<?php
	$this->Html->addCrumb("トップ",'/');
	$this->Html->addCrumb("総合カニ");
	echo $this->Html->getCrumbs(" > ");
?>
<br>
<div style="color:red"><?php echo $errMsg;?></div>

<div style="margin-top:5px">
	<?php echo $this->Form->create('Kani', array('url' => true ));?>

	<div id="kjs1">


		<div class="kj_div">
			<?php
			echo $this->Form->input('kj_kani_name', array(
					'id' => 'kj_kani_name',
					'value' => $kjs['kj_kani_name'],
					'type' => 'text',
					'label' => false,
					'placeholder' => '-- カニ名前 --',
					'style'=>'width:300px',
					'title'=>'カニ名前名による部分一致検索',
			));
			?>
		</div>


		<div class="kj_div" style="margin-right:2px">

			<?php
			echo $this->Form->input('kj_kani_ym', array(
					'id' => 'kj_kani_ym',
					'value' => $kjs['kj_kani_ym'],
					'type' => 'text',
					'label' => false,
					'placeholder' => '-- カニ年月 --',
					'style'=>'width:100px;',
			));
			?>

		</div>
		<div class="kj_div">
			<input type="button" class="ympicker_toggle_btn" value="" onclick="$('.kj_kani_dates').fadeToggle()" title="日付範囲入力を表示します" />
		</div>

		<div class="kj_div kj_kani_dates" style="display:none">
			<?php
			echo $this->Form->input('kj_kani_date1', array(
					'id' => 'kj_kani_date1',
					'value' => $kjs['kj_kani_date1'],
					'type' => 'text',
					'label' => false,
					'placeholder' => '-- カニ日【範囲1】--',
					'style'=>'width:150px',
					'title'=>'入力日以降を検索',
			));
			?>
		</div>

		<div class="kj_div kj_kani_dates" style="display:none">
			<?php
			echo $this->Form->input('kj_kani_date2', array(
					'id' => 'kj_kani_date2',
					'value' => $kjs['kj_kani_date2'],
					'type' => 'text',
					'label' => false,
					'placeholder' => '-- カニ日【範囲2】--',
					'style'=>'width:150px',
					'title'=>'入力日以前を検索',
			));
			?>
		</div>
		
	</div><!-- kjs1 -->
	<div style="clear:both"></div>
	
		<div id="kjs2">
	
		<div class="kj_div">
			<?php
			echo $this->Form->input('kj_id', array(
					'id' => 'kj_id',
					'value' => $kjs['kj_id'],
					'type' => 'text',
					'label' => false,
					'placeholder' => '-- ID --',
					'style'=>'width:100px',
					'title'=>'IDによる検索',
			));
			?>
		</div>
	

		<table class="nouislider_rap"><!-- 数値範囲入力スライダー・noUiSlider -->
			<tr><td>
				<span class="nusr_label">カニ数値による範囲検索</span>&nbsp;
				<span id="kani_val_preview" class="nusr_preview"></span>
			</td></tr>
			<tr>
				<td><div id="kani_val_slider" title="カニ数値による範囲検索"></div></td>
				<td><input type="button" class="nusr_toggle_btn" value="" onclick="$('#kani_val_detail').fadeToggle()" title="日付範囲入力を表示します"></td>
			</tr>
			<tr id="kani_val_detail" class="nusr_detail">
				<td>
					<div class="kj_div">
					<?php
					echo $this->Form->input('kj_kani_val1', array(
							'id' => 'kj_kani_val1',
							'value' => $kjs['kj_kani_val1'],
							'type' => 'number',
							'label' => false,
							'style'=>'width:50px',
							'title'=>'カニ数値による範囲検索',
					));
					?>
					</div>
					<div class="kj_div">～</div>
					<div class="kj_div">
					<?php
					echo $this->Form->input('kj_kani_val2', array(
							'id' => 'kj_kani_val2',
							'value' => $kjs['kj_kani_val2'],
							'type' => 'number',
							'label' => false,
							'style'=>'width:50px',
							'title'=>'カニ数値による範囲検索',
					));
					?>
					</div>
				</td>

				<td></td>
			</tr>
		</table>
		
		

		<div class="kj_div">
		 <?php
			 echo $this->Form->input('kj_kani_group', array(
					'id' => 'kj_kani_group',
			 		'type' => 'select',
			 		'options' => $kaniGroupList,
			 		'empty' => '-- カニ種別 --',
			 		'default' => $kjs['kj_kani_group'],
			 		'label' => false,
					'style'=>'width:150px',
					'title'=>'カニ種別による検索',
			 ));
			 ?>
		</div>
		
		<div class="kj_div">
			<?php
			echo $this->Form->input('kj_kani_dt', array(
					'id' => 'kj_kani_dt',
					'value' => $kjs['kj_kani_dt'],
					'type' => 'text',
					'label' => false,
					'placeholder' => '-- カニ日時 --',
					'style'=>'width:150px',
					'title'=>'カニ日時による完全一致検索',
			));
			?>
		</div>
		
		<div class="kj_div">
			<?php
			echo $this->Form->input('kj_note', array(
					'id' => 'kj_note',
					'value' => $kjs['kj_note'],
					'type' => 'text',
					'label' => false,
					'placeholder' => '-- 備考 --',
					'style'=>'width:200px',
					'title'=>'部分一致検索',
			));
			?>
		</div>

		<div class="kj_div">
			 <?php
			 //削除フラグ
			 echo $this->Form->input('kj_delete_flg', array(
					'id' => 'kj_delete_flg',
			 		'type' => 'select',
			 		'options' => array(
			 				0=>'有効',
			 				1=>'削除',
			 		),
			 		'empty' => 'すべて表示',
			 		'default' => $kjs['kj_delete_flg'],
			 		'label' => false,
			 ));

			 ?>
		</div>
		
		<div class="kj_div">
			<?php
			echo $this->Form->input('kj_update_user', array(
					'id' => 'kj_update_user',
					'value' => $kjs['kj_update_user'],
					'type' => 'text',
					'label' => false,
					'placeholder' => '-- 更新者 --',
					'style'=>'width:150px',
					'title'=>'更新者による完全一致検索',
			));
			?>
		</div>
		
		<div class="kj_div">
			<?php
			echo $this->Form->input('kj_ip_addr', array(
					'id' => 'kj_ip_addr',
					'value' => $kjs['kj_ip_addr'],
					'type' => 'text',
					'label' => false,
					'placeholder' => '-- 更新IPアドレス --',
					'style'=>'width:200px',
					'title'=>'更新IPアドレスによる完全一致検索',
			));
			?>
		</div>
		
		<div class="kj_div">
			<?php
			echo $this->Form->input('kj_created', array(
					'id' => 'kj_created',
					'type' => 'select',
					'options' => $datetimeList,
					'default' => $kjs['kj_created'],
			 		'empty' => '-- 生成日時 --',
					'label' => false,
					'style' => 'height:27px'
			));
			?>
		</div>
		
		<div class="kj_div">
			<?php
			echo $this->Form->input('kj_modified', array(
					'id' => 'kj_modified',
					'type' => 'select',
					'options' => $datetimeList,
					'default' => $kjs['kj_modified'],
			 		'empty' => '-- 更新日時 --',
					'label' => false,
					'style' => 'height:27px'
			));
			?>
		</div>

		<div class="kj_div">
			 <?php
			 //表示件数
			 echo $this->Form->input('kj_limit', array(
					'id' => 'kj_limit',
			 		'type' => 'select',
			 		'options' => array(
							5=>'5件表示',
			 				10=>'10件表示',
			 				20=>'20件表示',
			 				50=>'50件表示',
			 				100=>'100件表示',
			 				200=>'200件表示',
			 				500=>'500件表示',
			 		),
			 		'default' => $kjs['kj_limit'],
			 		'label' => false,
					'style' => 'height:27px'
			 ));

			 ?>
		 </div>

		 <div class="kj_div" style="margin-top:4px;">
			<?php
			echo $this->Form->input("saveKjFlg",array(
				'type'=>'checkbox',
				'value' => 1,
				'checked'=>$saveKjFlg,
				'label'=>'検索入力保存',
				'div'=>false,
			));
			?>
		</div>
		
		<div class="kj_div" style="margin-top:5px">
			<input type="button" value="リセット" title="検索入力を初期に戻します" onclick="resetKjs()" class="btn btn-primary btn-xs" />
		</div>


		<div style="clear:both"></div>


		<div id="clm_cbs_rap">
			<p>列表示切替</p>
			<div id="clm_cbs"></div>
		</div>
		<hr class="hr_purple">

	</div><!-- kjs2 -->

	<div id="cb_func_btns">
		<div class="kj_div">
		<?php echo $this->Form->submit('検索', array(
				'name' => 'search',
				'class'=>'btn btn-success',
		));
		?>
		</div>
		<div class="kj_div" style="margin-top:5px">
			<input type="button" value="詳細" onclick="show_kj_detail()" class="btn btn-primary btn-sm" />
		</div>



	</div>
	<div style="clear:both"></div>
	<?php echo $this->Form->end()?>

	<div id="def_kjs_json" style="display:none"><?php echo $def_kjs_json ?></div>
</div>

<div id="check_new_record">
	<div style="float:right">
		<button type="button" class="btn btn-primary btn-xs" onclick="$('#check_new_record').hide()"><span class="glyphicon glyphicon-remove"></span>　閉じる</button>
	</div>
	<span id="check_new_record_summary">
		新しいレコードが追加されました。<br>
		新レコードを反映するにはブラウザをリロードするか検索ボタンをおしてください。<br>
	</span>
	
</div>

<div id="worker_thread">
	<div style="float:left">
		<div id="wt_nomarl" >定期リロード処理は稼働しています。</div>
		<div id="wt_error" >
			<div id="wt_error2">システムエラー</div>
			<div>定期リロードは停止中です。再開ボタンで稼働します。</div>
			<button type="button" class="btn btn-danger btn-xs" onclick="wt_start()">再開</button>
			<div id="wt_debug"></div>
		</div>
	</div>
	<div id="wt_counter">0</div>
	<div id="wt_log" style="clear:both"></div>
	<input id="wt_debug_mode" type="hidden" value="<?php echo Configure::read('debug');?>" />
	<input id="wt_web_root" type="hidden" value="<?php echo $this->Html->webroot ?>" />
</div>



<div style="margin-bottom:5px">
	<?php echo $pages['page_index_html'];//ページ目次 ?>
</div>


<table id="kani_tbl" border="1"  class="table table-striped table-bordered table-condensed">

<thead>
<tr>

	<?php
		foreach($table_fields as $sort_key => $v){
			echo "<th>{$pages['sorts'][$sort_key]}</th>";
		}

	?>


</tr>
</thead>
<tbody>
</tbody>
</table>


<br />


<div id="kaniGroupJson" style="display:none"><?php echo $kaniGroupJson ?></div>


