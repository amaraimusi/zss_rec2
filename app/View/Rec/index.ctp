<?php
echo $this->element('CrudBase/crud_base_helper_init');

// CSSファイルのインクルード
$cssList = $this->CrudBase->getCssList();
$cssList[] = 'Rec/index'; // 当画面専用CSS
$this->assign('css', $this->Html->css($cssList));

// JSファイルのインクルード
$jsList = $this->CrudBase->getJsList();
$jsList[] = 'Rec/index'; // 当画面専用JavaScript
$this->assign('script', $this->Html->script($jsList,array('charset'=>'utf-8')));

?>






<div class="cb_func_line">


	<div class="cb_breadcrumbs">
	<?php
		$this->Html->addCrumb("トップ",'/');
		$this->Html->addCrumb("記録画面");
		echo $this->Html->getCrumbs(" > ");
	?>
	</div>
	
	<div class="cb_kj_main">
		<!-- 検索条件入力フォーム -->
		<?php echo $this->Form->create('Rec', array('url' => true , 'class' => 'form_kjs')); ?>
		<?php $this->CrudBase->inputKjMain($kjs,'kj_main','',null,'記録,日付を検索');?>
		<?php $this->CrudBase->inputKjSelect($kjs,'kj_title_id','タイトル',$titleIdList); ?>
		<input type='button' value='検索' onclick='searchKjs()' class='search_kjs_btn btn btn-success' />
		<div class="btn-group">
			<a href="" class="ini_rtn btn btn-info btn-xs" title="この画面を最初に表示したときの状態に戻します。（検索状態、列並べの状態を初期状態に戻します。）">
				<span class="glyphicon glyphicon-certificate"  ></span></a>
			<button type="button" class="btn btn-default btn-xs" title="詳細検索項目を表示する" onclick="jQuery('.cb_kj_detail').toggle(300)">詳細</button>
		</div>
		
		<div class="cb_kj_detail" style="display:none">
		<?php 
		
		// --- CBBXS-1004
		$this->CrudBase->inputKjId($kjs);
		$this->CrudBase->inputKjMoDateRng($kjs,'kj_rec_date','記録日付');
		$this->CrudBase->inputKjText($kjs,'kj_note','ノート');
		$this->CrudBase->inputKjSelect($kjs,'kj_rec_ctg_id','記録カテゴリ',$recCtgIdList); 
		$this->CrudBase->inputKjText($kjs,'kj_img_fn','画像');
		$this->CrudBase->inputKjText($kjs,'kj_file_name','ファイル名');
		$this->CrudBase->inputKjText($kjs,'kj_img_dp','画像ディレクトリパス');
		$this->CrudBase->inputKjText($kjs,'kj_ref_url','参照URL');
		$this->CrudBase->inputKjNumRange($kjs,'no_a','番号A');
		$this->CrudBase->inputKjNumRange($kjs,'no_b','番号B');
		$this->CrudBase->inputKjText($kjs,'kj_rec_title','rec_title');
		$this->CrudBase->inputKjText($kjs,'kj_parent_id','親ID');
		$this->CrudBase->inputKjFlg($kjs,'kj_public_flg','公開');
		$this->CrudBase->inputKjHidden($kjs,'kj_sort_no');
		$this->CrudBase->inputKjDeleteFlg($kjs);
		$this->CrudBase->inputKjText($kjs,'kj_update_user','更新者');
		$this->CrudBase->inputKjText($kjs,'kj_ip_addr','IPアドレス');
		$this->CrudBase->inputKjCreated($kjs);
		$this->CrudBase->inputKjModified($kjs);

		// --- CBBXE
		
		$this->CrudBase->inputKjLimit($kjs);
		echo "<input type='button' value='検索' onclick='searchKjs()' class='search_kjs_btn btn btn-success' />";
		echo $this->element('CrudBase/crud_base_cmn_inp');
		

		?>
			<div class="kj_div" style="margin-top:5px">
				<input type="button" value="リセット" title="検索入力を初期に戻します" onclick="resetKjs()" class="btn btn-primary btn-xs" />
			</div>
		</div>
		<?php echo $this->Form->end()?>
	</div>
	
	<div id="cb_func_btns" class="btn-group" >
		<button type="button" onclick="$('#detail_div').toggle(300);" class="btn btn-default">
			<span class="glyphicon glyphicon-wrench"></span></button>
	</div>
		
</div><!-- cb_func_line -->

<div style="clear:both"></div>

<!-- 一括追加機能  -->
<div id="crud_base_bulk_add" style="display:none"></div>

<?php echo $this->element('CrudBase/crud_base_new_page_version');?>
<div id="err" class="text-danger"><?php echo $errMsg;?></div>


<div style="clear:both"></div>

<div id="detail_div" style="display:none">
	
	<div id="main_tools" style="margin-bottom:10px;">
		<?php 
			// 列表示切替機能
			echo $this->element('CrudBase/clm_cbs'); 
			
			// CSVエクスポート機能
			$csv_dl_url = $this->html->webroot . 'rec/csv_download';
			$this->CrudBase->makeCsvBtns($csv_dl_url);

		?>

		<button id="crud_base_bulk_add_btn" type="button" class="btn btn-default btn-sm" onclick="crudBase.crudBaseBulkAdd.showForm()" >一括追加</button>
		
	</div><!-- main_tools -->
	
	<div id="sub_tools">
		<input type="button" value="ボタンサイズ変更" class="btn btn-default btn-xs" onclick="jQuery('#CbBtnSizeChanger').toggle(300);" />
		<div id="CbBtnSizeChanger" style="display:none"></div>
		
		<button id="calendar_view_k_btn" type="button" class="btn btn-default btn-xs" onclick="calendarViewKShow()" >
			<span class="glyphicon glyphicon-time" >カレンダーモード</span></button>
		
		<button type="button" class="btn btn-default btn-xs" onclick="session_clear()" >セッションクリア</button>
	
		<button id="table_transform_tbl_mode" type="button" class="btn btn-default btn-xs" onclick="tableTransform(0)" style="display:none">一覧の変形・テーブルモード</button>	
		<button id="table_transform_div_mode" type="button" class="btn btn-default btn-xs" onclick="tableTransform(1)" >一覧の変形・スマホモード</button>
		
		<a href="rec/front_a?<?php echo $pages['query_str']; ?>" class="btn btn-default btn-xs" target="brank" >フロント画面表示</a>
	</div><!-- sub_tools -->
</div><!-- detail_div -->


<div id="new_inp_form_point"></div><!-- 新規入力フォーム表示地点 -->


<div style="margin-top:8px;">
	<div style="display:inline-block">
		<?php echo $pages['page_index_html'];//ページ目次 ?>
	</div>
	<div style="display:inline-block">件数:<?php echo $data_count ?></div>
</div>

<div id="calendar_view_k"></div>


<div id="crud_base_auto_save_msg" style="height:20px;" class="text-success"></div>

<?php if(!empty($data)){ ?>
	<button type="button" class="btn btn-warning btn-sm" onclick="newInpShow(this, 'add_to_top');">
		<span class="glyphicon glyphicon-plus-sign" title="新規入力"> 追加</span></button>
<?php } ?>
	
<!-- 一覧テーブル -->
<table id="rec_tbl" class="table table-striped table-bordered table-condensed" style="display:none;margin-bottom:0px">

<thead>
<tr>
	<?php
	foreach($field_data as $ent){
		$row_order=$ent['row_order'];
		echo "<th class='{$ent['id']}'>{$pages['sorts'][$row_order]}</th>";
	}
	?>
	<th></th>
</tr>
</thead>
<tbody>
<?php

// td要素出力を列並モードに対応させる
$this->CrudBase->startClmSortMode($field_data);

foreach($data as $i=>$ent){

	echo "<tr id='ent{$ent['id']}' >";
	// CBBXS-1005
	$this->CrudBase->tdId($ent,'id',array('checkbox_name'=>'pwms'));
	$this->CrudBase->tdList($ent,'title_id',$titleIdList);
	$this->CrudBase->tdPlain($ent,'rec_date');
	$this->CrudBase->tdNote($ent,'note');
	$this->CrudBase->tdList($ent,'rec_ctg_id',$recCtgIdList);
	$this->CrudBase->tdImage($ent,'img_fn', '/photos/halther/');
	$this->CrudBase->tdStr($ent,'file_name');
	$this->CrudBase->tdStr($ent,'img_dp');
	$this->CrudBase->tdStr($ent,'ref_url');
	$this->CrudBase->tdPlain($ent,'no_a');
	$this->CrudBase->tdPlain($ent,'no_b');
	$this->CrudBase->tdStr($ent,'rec_title');
	$this->CrudBase->tdPlain($ent,'parent_id');
	$this->CrudBase->tdFlg($ent,'public_flg');
	$this->CrudBase->tdPlain($ent,'sort_no');
	$this->CrudBase->tdDeleteFlg($ent,'delete_flg');
	$this->CrudBase->tdStr($ent,'update_user');
	$this->CrudBase->tdStr($ent,'ip_addr');
	$this->CrudBase->tdPlain($ent,'created');
	$this->CrudBase->tdPlain($ent,'modified');

	// CBBXE
	
	$this->CrudBase->tdsEchoForClmSort();// 列並に合わせてTD要素群を出力する
	
	// 行のボタン類
	echo "<td><div style='display:inline-block'>";
	$id = $ent['id'];
	echo  "<input type='button' value='↑↓' onclick='rowExchangeShowForm(this)' class='row_exc_btn btn btn-info btn-xs' />";
	$this->CrudBase->rowEditBtn($id);
	$this->CrudBase->rowPreviewBtn($id);
	$this->CrudBase->rowCopyBtn($id);
	echo "</div>&nbsp;";
	echo "<div style='display:inline-block'>";
	$this->CrudBase->rowDeleteBtn($ent); // 削除ボタン
	$this->CrudBase->rowEnabledBtn($ent); // 有効ボタン
	echo "&nbsp;";
	$this->CrudBase->rowEliminateBtn($ent);// 抹消ボタン
	echo "</div>";
	echo "</td>";
	echo "</tr>";
}

?>
</tbody>
</table>

<button type="button" class="btn btn-warning btn-sm" onclick="newInpShow(this, 'add_to_bottom');">
	<span class="glyphicon glyphicon-plus-sign" title="新規入力"> 追加</span></button>
	
<?php echo $this->element('CrudBase/crud_base_pwms'); // 複数選択による一括処理 ?>

<table id="crud_base_forms">

	<!-- 新規入力フォーム -->
	<tr id="ajax_crud_new_inp_form" class="crud_base_form" style="display:none;padding-bottom:60px"><td colspan='5'>
	
		<div>
			<div style="color:#3174af;float:left">新規入力</div>
			<div style="float:left;margin-left:10px">
				<button type="button"  onclick="newInpReg();" class="btn btn-success btn-xs reg_btn">
					<span class="glyphicon glyphicon-ok reg_btn_msg"></span>
				</button>
			</div>
			<div style="float:right">
				<button type="button" class="btn btn-primary btn-xs" onclick="closeForm('new_inp')"><span class="glyphicon glyphicon-remove"></span></button>
			</div>
		</div>
		<div style="clear:both;height:4px"></div>
		<div class="err text-danger"></div>
		
		<div style="display:none">
	    	<input type="hidden" name="form_type">
	    	<input type="hidden" name="row_index">
	    	<input type="hidden" name="sort_no">
		</div>
	
	
		<!-- CBBXS-1006 -->
		<div class="cbf_inp_wrap">
			<div class='cbf_inp_label' >タイトル: </div>
			<div class='cbf_input'>
				<?php $this->CrudBase->selectX('title_id',null,$titleIdList,null);?>
				<label class="text-danger" for="title_id"></label>
			</div>
		</div>

		<div class="cbf_inp_wrap">
			<div class='cbf_inp_label' >記録日付: </div>
			<div class='cbf_input'>
				<input type="text" name="rec_date" class="valid datepicker" value=""  pattern="([0-9]{4})(/|-)([0-9]{1,2})(/|-)([0-9]{1,2})" title="日付形式（Y-m-d）で入力してください(例：2012-12-12)" />
				<label class="text-danger" for="rec_date"></label>
			</div>
		</div>
		<div class="cbf_inp_wrap_long">
			<div class='cbf_inp_label' >ノート： </div>
			<div class='cbf_input'>
				<textarea name="note" maxlength="1000" title="1000文字以内で入力してください" style="height:100px;width:100%"></textarea>
				<label class="text-danger" for="note"></label>
			</div>
		</div>
		<div class="cbf_inp_wrap">
			<div class='cbf_inp_label' >記録カテゴリ: </div>
			<div class='cbf_input'>
				<?php $this->CrudBase->selectX('rec_ctg_id',null,$recCtgIdList,null);?>
				<label class="text-danger" for="rec_ctg_id"></label>
			</div>
		</div>

		<div class="cbf_inp_wrap">
			<div class='cbf_inp_label_long' >画像: </div>
			<div class='cbf_input'>
				<label for="img_fn_n" class="fuk_label" style="width:100px;height:100px;">
					<input type="file" id="img_fn_n" class="img_fn" style="display:none" accept="image/*" title="画像ファイルをドラッグ＆ドロップ(複数可)"  data-inp-ex='image_fuk' data-fp='' />
				</label>
			</div>
		</div>
		<div class="cbf_inp_wrap">
			<div class='cbf_inp' >ファイル名: </div>
			<div class='cbf_input'>
				<input type="text" name="file_name" class="valid " value=""  maxlength="512" title="512文字以内で入力してください" />
				<label class="text-danger" for="file_name"></label>
			</div>
		</div>

		<div class="cbf_inp_wrap">
			<div class='cbf_inp' >画像ディレクトリパス: </div>
			<div class='cbf_input'>
				<input type="text" name="img_dp" class="valid " value=""  maxlength="128" title="128文字以内で入力してください" />
				<label class="text-danger" for="img_dp"></label>
			</div>
		</div>

		<div class="cbf_inp_wrap">
			<div class='cbf_inp' >参照URL: </div>
			<div class='cbf_input'>
				<input type="text" name="ref_url" class="valid " value=""  maxlength="2083" title="2083文字以内で入力してください" />
				<label class="text-danger" for="ref_url"></label>
			</div>
		</div>

		<div class="cbf_inp_wrap">
			<div class='cbf_inp_label' >番号A: </div>
			<div class='cbf_input'>
				<input type="text" name="no_a" class="valid" value="" pattern="^[+-]?([0-9]*[.])?[0-9]+$" maxlength="11" title="数値を入力してください" />
				<label class="text-danger" for="no_a" ></label>
			</div>
		</div>
		<div class="cbf_inp_wrap">
			<div class='cbf_inp_label' >番号B: </div>
			<div class='cbf_input'>
				<input type="text" name="no_b" class="valid" value="" pattern="^[+-]?([0-9]*[.])?[0-9]+$" maxlength="11" title="数値を入力してください" />
				<label class="text-danger" for="no_b" ></label>
			</div>
		</div>
		<div class="cbf_inp_wrap">
			<div class='cbf_inp' >rec_title: </div>
			<div class='cbf_input'>
				<input type="text" name="rec_title" class="valid " value=""  maxlength="50" title="50文字以内で入力してください" />
				<label class="text-danger" for="rec_title"></label>
			</div>
		</div>

		<div class="cbf_inp_wrap">
			<div class='cbf_inp_label' >親ID: </div>
			<div class='cbf_input'>
				<input type="text" name="parent_id" class="valid" value="" pattern="^[+-]?([0-9]*[.])?[0-9]+$" maxlength="11" title="数値を入力してください" />
				<label class="text-danger" for="parent_id" ></label>
			</div>
		</div>
		<div class="cbf_inp_wrap">
			<div class='cbf_inp_label' >公開: </div>
			<div class='cbf_input'>
				<input type="checkbox" name="public_flg" class="valid"/>
				<label class="text-danger" for="public_flg" ></label>
			</div>
		</div>

		<!-- CBBXE -->
		
		<div style="clear:both"></div>
		<div class="cbf_inp_wrap">
			<button type="button" onclick="newInpReg();" class="btn btn-success reg_btn">
				<span class="glyphicon glyphicon-ok reg_btn_msg"></span>
			</button>
		</div>
	</td></tr><!-- new_inp_form -->



	<!-- 編集フォーム -->
	<tr id="ajax_crud_edit_form" class="crud_base_form" style="display:none"><td colspan='5'>
		<div  style='width:100%'>
	
			<div>
				<div style="color:#3174af;float:left">編集</div>
				<div style="float:left;margin-left:10px">
					<button type="button"  onclick="editReg();" class="btn btn-success btn-xs reg_btn">
						<span class="glyphicon glyphicon-ok reg_btn_msg"></span>
					</button>
				</div>
				<div style="float:right">
					<button type="button" class="btn btn-primary btn-xs" onclick="closeForm('edit')"><span class="glyphicon glyphicon-remove"></span></button>
				</div>
			</div>
			<div style="clear:both;height:4px"></div>
			<div class="err text-danger"></div>
			
			<!-- CBBXS-1007 -->
			<div class="cbf_inp_wrap">
				<div class='cbf_inp' >ID: </div>
				<div class='cbf_input'>
					<span class="id"></span>
				</div>
			</div>
		<div class="cbf_inp_wrap">
			<div class='cbf_inp_label' >タイトル: </div>
			<div class='cbf_input'>
				<?php $this->CrudBase->selectX('title_id',null,$titleIdList,null);?>
				<label class="text-danger" for="title_id"></label>
			</div>
		</div>

		<div class="cbf_inp_wrap">
			<div class='cbf_inp_label' >記録日付: </div>
			<div class='cbf_input'>
				<input type="text" name="rec_date" class="valid datepicker" value=""  pattern="([0-9]{4})(/|-)([0-9]{1,2})(/|-)([0-9]{1,2})" title="日付形式（Y-m-d）で入力してください(例：2012-12-12)" />
				<label class="text-danger" for="rec_date"></label>
			</div>
		</div>

		<div class="cbf_inp_wrap_long">
			<div class='cbf_inp_label' >ノート： </div>
			<div class='cbf_input'>
				<textarea name="note" maxlength="1000" title="1000文字以内で入力してください" style="height:100px;width:100%"></textarea>
				<label class="text-danger" for="note"></label>
			</div>
		</div>

		<div class="cbf_inp_wrap">
			<div class='cbf_inp_label' >記録カテゴリ: </div>
			<div class='cbf_input'>
				<?php $this->CrudBase->selectX('rec_ctg_id',null,$recCtgIdList,null);?>
				<label class="text-danger" for="rec_ctg_id"></label>
			</div>
		</div>

			<div class="cbf_inp_wrap">
				<div class='cbf_inp_label_long' >画像: </div>
				<div class='cbf_input'>
					<label for="img_fn_e" class="fuk_label" style="width:100px;height:100px;">
						<input type="file" id="img_fn_e" class="img_fn" style="display:none" accept="image/*" title="画像ファイルをドラッグ＆ドロップ(複数可)" data-inp-ex='image_fuk' data-fp='' />
					</label>
				</div>
			</div>
		<div class="cbf_inp_wrap">
			<div class='cbf_inp' >ファイル名: </div>
			<div class='cbf_input'>
				<input type="text" name="file_name" class="valid " value=""  maxlength="512" title="512文字以内で入力してください" />
				<label class="text-danger" for="file_name"></label>
			</div>
		</div>


		<div class="cbf_inp_wrap">
			<div class='cbf_inp' >画像ディレクトリパス: </div>
			<div class='cbf_input'>
				<input type="text" name="img_dp" class="valid " value=""  maxlength="128" title="128文字以内で入力してください" />
				<label class="text-danger" for="img_dp"></label>
			</div>
		</div>


		<div class="cbf_inp_wrap">
			<div class='cbf_inp' >参照URL: </div>
			<div class='cbf_input'>
				<input type="text" name="ref_url" class="valid " value=""  maxlength="2083" title="2083文字以内で入力してください" />
				<label class="text-danger" for="ref_url"></label>
			</div>
		</div>


		<div class="cbf_inp_wrap">
			<div class='cbf_inp' >番号A: </div>
			<div class='cbf_input'>
				<input type="text" name="no_a" class="valid " value=""  maxlength="11" title="11文字以内で入力してください" />
				<label class="text-danger" for="no_a"></label>
			</div>
		</div>

		<div class="cbf_inp_wrap">
			<div class='cbf_inp' >番号B: </div>
			<div class='cbf_input'>
				<input type="text" name="no_b" class="valid " value=""  maxlength="11" title="11文字以内で入力してください" />
				<label class="text-danger" for="no_b"></label>
			</div>
		</div>

		<div class="cbf_inp_wrap">
			<div class='cbf_inp' >rec_title: </div>
			<div class='cbf_input'>
				<input type="text" name="rec_title" class="valid " value=""  maxlength="50" title="50文字以内で入力してください" />
				<label class="text-danger" for="rec_title"></label>
			</div>
		</div>


		<div class="cbf_inp_wrap">
			<div class='cbf_inp' >親ID: </div>
			<div class='cbf_input'>
				<input type="text" name="parent_id" class="valid " value=""  maxlength="11" title="11文字以内で入力してください" />
				<label class="text-danger" for="parent_id"></label>
			</div>
		</div>

		<div class="cbf_inp_wrap">
			<div class='cbf_inp_label' >公開: </div>
			<div class='cbf_input'>
				<input type="checkbox" name="public_flg" class="valid"/>
				<label class="text-danger" for="public_flg" ></label>
			</div>
		</div>

			<div class="cbf_inp_wrap">
				<div class='cbf_inp_label' >削除：</div>
				<div class='cbf_input'>
					<input type="checkbox" name="delete_flg" class="valid"  />
				</div>
			</div>

			<!-- CBBXE -->
			
			<div style="clear:both"></div>
			<div class="cbf_inp_wrap">
				<button type="button"  onclick="editReg();" class="btn btn-success reg_btn">
					<span class="glyphicon glyphicon-ok reg_btn_msg"></span>
				</button>
			</div>
			
			<div class="cbf_inp_wrap" style="padding:5px;">
				<input type="button" value="更新情報" class="btn btn-default btn-xs" onclick="$('#ajax_crud_edit_form_update').toggle(300)" /><br>
				<aside id="ajax_crud_edit_form_update" style="display:none">
					更新日時: <span class="modified"></span><br>
					生成日時: <span class="created"></span><br>
					ユーザー名: <span class="update_user"></span><br>
					IPアドレス: <span class="ip_addr"></span><br>
					ユーザーエージェント: <span class="user_agent"></span><br>
				</aside>
			</div>
		</div>
	</td></tr>
</table>







<!-- 削除フォーム -->
<div id="ajax_crud_delete_form" class="panel panel-danger" style="display:none">

	<div class="panel-heading">
		<div class="pnl_head1">削除</div>
		<div class="pnl_head2"></div>
		<div class="pnl_head3">
			<button type="button" class="btn btn-default btn-sm" onclick="closeForm('delete')"><span class="glyphicon glyphicon-remove"></span></button>
		</div>
	</div>
	
	<div class="panel-body" style="min-width:300px">
	<table><tbody>

		<!-- Start ajax_form_new -->
		<tr><td>ID: </td><td>
			<span class="id"></span>
		</td></tr>
		

		<tr><td>記録名: </td><td>
			<span class="rec_name"></span>
		</td></tr>
		
		<tr><td>画像ファイル: </td><td>
			<label for="img_fn"></label><br>
			<img src="" class="img_fn" width="80" height="80" ></img>
		</td></tr>


		<!-- Start ajax_form_end -->
	</tbody></table>
	<br>
	

	<button type="button"  onclick="deleteReg();" class="btn btn-danger">
		<span class="glyphicon glyphicon-remove"></span>　削除する
	</button>
	<hr>
	
	<input type="button" value="更新情報" class="btn btn-default btn-xs" onclick="$('#ajax_crud_delete_form_update').toggle(300)" /><br>
	<aside id="ajax_crud_delete_form_update" style="display:none">
		更新日時: <span class="modified"></span><br>
		生成日時: <span class="created"></span><br>
		ユーザー名: <span class="update_user"></span><br>
		IPアドレス: <span class="ip_addr"></span><br>
		ユーザーエージェント: <span class="user_agent"></span><br>
	</aside>
	

	</div><!-- panel-body -->
</div>



<!-- 抹消フォーム -->
<div id="ajax_crud_eliminate_form" class="panel panel-danger" style="display:none">

	<div class="panel-heading">
		<div class="pnl_head1">抹消</div>
		<div class="pnl_head2"></div>
		<div class="pnl_head3">
			<button type="button" class="btn btn-default btn-sm" onclick="closeForm('eliminate')"><span class="glyphicon glyphicon-remove"></span></button>
		</div>
	</div>
	
	<div class="panel-body" style="min-width:300px">
	<table><tbody>

		<!-- Start ajax_form_new -->
		<tr><td>ID: </td><td>
			<span class="id"></span>
		</td></tr>
		

		<tr><td>記録名: </td><td>
			<span class="rec_name"></span>
		</td></tr>


		<!-- Start ajax_form_end -->
	</tbody></table>
	<br>
	

	<button type="button"  onclick="eliminateReg();" class="btn btn-danger">
		<span class="glyphicon glyphicon-remove"></span>　抹消する
	</button>
	<hr>
	
	<input type="button" value="更新情報" class="btn btn-default btn-xs" onclick="$('#ajax_crud_eliminate_form_update').toggle(300)" /><br>
	<aside id="ajax_crud_eliminate_form_update" style="display:none">
		更新日時: <span class="modified"></span><br>
		生成日時: <span class="created"></span><br>
		ユーザー名: <span class="update_user"></span><br>
		IPアドレス: <span class="ip_addr"></span><br>
		ユーザーエージェント: <span class="user_agent"></span><br>
	</aside>
	

	</div><!-- panel-body -->
</div>


<br />

<!-- 埋め込みJSON -->
<div style="display:none">
	
	<!-- CBBXS-1022 -->
	<input id="title_id_json" type="hidden" value='<?php echo $title_id_json; ?>' />
	<input id="rec_ctg_id_json" type="hidden" value='<?php echo $rec_ctg_id_json; ?>' />

	<!-- CBBXE -->
</div>



<!-- ヘルプ用  -->
<input type="button" class="btn btn-info btn-sm" onclick="$('#help_x').toggle()" value="ヘルプ" />
<div id="help_x" class="help_x" style="display:none">
	<h2>ヘルプ</h2>

	<?php echo $this->element('CrudBase/crud_base_help');?>

</div>























