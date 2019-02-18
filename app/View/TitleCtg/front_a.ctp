<?php
echo $this->element('CrudBase/crud_base_helper_init');
$cbh = $this->CrudBase;
$frontA = $cbh->getFrontAHelper();


// CSSファイルのインクルード
$cssList = array(
		'bootstrap.min',
		'bootstrap-theme.min',
		'CrudBase/common.css?v=1.0.0',
		'TitleCtg/front_a'// 当画面専用CSS
);
$this->assign('css', $this->Html->css($cssList));

// JSファイルのインクルード
$jsList = array(
		'jquery-2.1.4.min',
		'bootstrap.min',
		'CrudBase/dist/CrudBase.min.js',
		'TitleCtg/front_a.js',
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
		$this->CrudBase->inputKjText($kjs,'kj_title_ctg_name','タイトルカテゴリ');
		$this->CrudBase->inputKjText($kjs,'kj_note','備考');
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
<table id="title_ctg_tbl" border="1"  class="table_transform">

<thead>
<tr>
	<!-- CBBXS-1050 -->
	<th>id</th>
	<th>タイトルカテゴリ</th>
	<th>備考</th>
	<th>順番</th>
	<th>無効フラグ</th>
	<th>更新者</th>
	<th>IPアドレス</th>
	<th>生成日時</th>
	<th>更新日時</th>

	<!-- CBBXE -->
</tr>
</thead>
<tbody>
<?php

// td要素出力を列並モードに対応させる
$this->CrudBase->startClmSortMode($field_data);

foreach($data as $i=>$ent){

	echo "<tr id='ent{$ent['id']}'>";
	
	// CBBXS-1051
	$this->FrontA->tdPlain($ent,'id');
	$this->FrontA->tdStr($ent,'title_ctg_name');
	$this->FrontA->tdNote($ent,'note','td_note');
	$this->FrontA->tdPlain($ent,'sort_no');
	$this->FrontA->tdPlain($ent,'delete_flg');
	$this->FrontA->tdStr($ent,'update_user');
	$this->FrontA->tdStr($ent,'ip_addr');
	$this->FrontA->tdPlain($ent,'created');
	$this->FrontA->tdPlain($ent,'modified');

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

























