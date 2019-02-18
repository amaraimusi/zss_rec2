<?php
echo $this->element('CrudBase/crud_base_helper_init');
$cbh = $this->CrudBase;
$frontA = $cbh->getFrontAHelper();


// CSSファイルのインクルード
$cssList = array(
		'bootstrap.min',
		'bootstrap-theme.min',
		'CrudBase/common.css?v=1.0.0',
		'Rec/front_a'// 当画面専用CSS
);
$this->assign('css', $this->Html->css($cssList));

// JSファイルのインクルード
$jsList = array(
		'jquery-2.1.4.min',
		'bootstrap.min',
		'CrudBase/dist/CrudBase.min.js',
		'Rec/front_a.js',
);
$this->assign('script', $this->Html->script($jsList,array('charset'=>'utf-8')));

?>
<h1><?php echo $title_for_layout; ?></h1>

<div id="err" style="color:red"></div>
<div class="cb_kj_main">
	<!-- 検索条件入力フォーム -->
	<?php echo $this->Form->create('Bukken', array('url' => true , 'class' => 'form_kjs')); ?>
	<?php $cbh->inputKjMain($kjs,'kj_main','',null,'複数の項目から検索します。');?>
	<input type='button' value='検索' onclick='searchKjs()' class='search_kjs_btn btn btn-success' />
	<div class="btn-group">
		<a href="" class="ini_rtn btn btn-info btn-xs" title="この画面を最初に表示したときの状態に戻します。（検索状態を初期状態に戻します。）">
			<span class="glyphicon glyphicon-certificate"  ></span></a>
		<button type="button" class="btn btn-default btn-xs" title="詳細検索項目を表示する" onclick="jQuery('.cb_kj_detail').toggle(300)">詳細</button>
	</div>
	
	<div class="cb_kj_detail" style="display:none">
	<?php 
	
	// --- CBBXS-1004
		$this->CrudBase->inputKjId($kjs);
		$this->CrudBase->inputKjSelect($kjs,'kj_title_id','タイトル',$titleIdList); 
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
	
	$cbh->inputKjLimit($kjs);
	echo "<input type='button' value='検索' onclick='searchKjs()' class='search_kjs_btn btn btn-success' />";
	echo $this->element('CrudBase/crud_base_cmn_inp');
	

	?>
		<div class="kj_div" style="margin-top:5px">
			<input type="button" value="リセット" title="検索入力を初期に戻します" onclick="resetKjs()" class="btn btn-primary btn-xs" />
		</div>
	</div>
	<?php echo $this->Form->end()?>
</div><!-- cb_kj_main -->




<div style="margin-top:8px;margin-bottom:8px;">
	<?php 
	echo $frontA->topLinkBtn($pages);
	echo $frontA->prevLinkBtn($pages);
	echo $frontA->nextLinkBtn($pages); 
	?>
	<div style="display:inline-block"><?php echo $pages['page_index_html']; ?></div>
	<div style="display:inline-block">件数:<?php echo $data_count ?></div>
</div>

<!-- 一覧テーブル -->
<table id="rec_tbl" border="1"  class="table_transform">

<tbody>
<?php

// // td要素出力を列並モードに対応させる
// $this->CrudBase->startClmSortMode($field_data);

foreach($data as $i=>$ent){

	echo "<tr id='ent{$ent['id']}'>";
	
	// CBBXS-1051

	$frontA->tdImage($ent,'img_fn', '/photos/halther/', 'td_image');
	echo $ent['sub_img_list_html'];
	$frontA->tdNote($ent,'note','td_note');
	$frontA->tdPlain($ent,'rec_date');

	// CBBXE
	
	echo "</tr>";
}

?>
</tbody>
</table>

<div style="margin-top:8px;margin-bottom:8px;">
	<?php 
	echo $frontA->topLinkBtn($pages);
	echo $frontA->prevLinkBtn($pages);
	echo $frontA->nextLinkBtn($pages); 
	?>
	<div style="display:inline-block"><?php echo $pages['page_index_html']; ?></div>
	<div style="display:inline-block">件数:<?php echo $data_count ?></div>
</div>

























