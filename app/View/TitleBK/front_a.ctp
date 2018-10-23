<?php

$this->FrontA = $this->Helpers->load('FrontA');// ヘルパー
$this->FrontA->init(array(
		'data'=>$data,
		'dptData'=>$dptData,
));

// CSSファイルのインクルード
$cssList = array(
		'bootstrap.min',
		'bootstrap-theme.min',
		'Title/front_a'// 当画面専用CSS
);
$this->assign('css', $this->Html->css($cssList));

// JSファイルのインクルード
$jsList = array(
		'jquery-2.1.4.min',
		'bootstrap.min',
);
$this->assign('script', $this->Html->script($jsList,array('charset'=>'utf-8')));

?>
<h1><?php echo $title_for_layout; ?></h1>

<div style="margin-top:8px;margin-bottom:8px;">
	<?php 
	echo $this->FrontA->topLinkBtn($pages);
	echo $this->FrontA->prevLinkBtn($pages);
	echo $this->FrontA->nextLinkBtn($pages); 
	?>
	<div style="display:inline-block"><?php echo $pages['page_index_html']; ?></div>
	<div style="display:inline-block">件数:<?php echo $data_count ?></div>
</div>

<!-- 一覧テーブル -->
<table id="title_tbl"  class="table">

<thead>
<tr>
	<!-- CBBXS-1050 -->
	<th>id</th>
	<th>タイトル</th>
	<th>タイトルカテゴリ</th>
	<th>備考</th>
	<th>公開</th>
	<th>順番</th>
	<th>無効フラグ</th>

	<!-- CBBXE -->
</tr>
</thead>
<tbody>
<?php

// td要素出力を列並モードに対応させる
$this->CrudBase->startClmSortMode($field_data);

foreach($data as $i=>$ent){

	echo "<tr id=i{$ent['id']}>";
	
	// CBBXS-1051
	$this->FrontA->tdPlain($ent,'id');
	$this->FrontA->tdStr($ent,'title_name');
	$this->FrontA->tdPlain($ent,'title_ctg_id');
	$this->FrontA->tdNote($ent,'note','td_note');
	$this->FrontA->tdPlain($ent,'public_flg');
	$this->FrontA->tdPlain($ent,'sort_no');
	$this->FrontA->tdPlain($ent,'delete_flg');

	// CBBXE
	
	echo "</tr>";
}

?>
</tbody>
</table>

<div style="margin-top:8px;margin-bottom:8px;">
	<?php 
	echo $this->FrontA->topLinkBtn($pages);
	echo $this->FrontA->prevLinkBtn($pages);
	echo $this->FrontA->nextLinkBtn($pages); 
	?>
	<div style="display:inline-block"><?php echo $pages['page_index_html']; ?></div>
	<div style="display:inline-block">件数:<?php echo $data_count ?></div>
</div>
























