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
		'Neko/front_a'// 当画面専用CSS
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
<table id="neko_tbl" border="1"  class="table_transform">

<thead>
<tr>
	<!-- CBBXS-1050 -->
	<th>画像</th>
	<th>説明</th>
	<th>ID</th>
	<th>ネコ名</th>
	<th>ネコ日付</th>
	<th>ネコ日時</th>
	<th>更新日</th>
	<th>ネコ数値</th>
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
	$this->FrontA->tdImage($ent,'img_fn','td_image');
	$this->FrontA->tdNote($ent,'note','td_note');
	$this->FrontA->tdPlain($ent,'id');
	$this->FrontA->tdStr($ent,'neko_name');
	$this->FrontA->tdPlain($ent,'neko_date');
	$this->FrontA->tdPlain($ent,'neko_dt');
	$this->FrontA->tdPlain($ent,'modified');
	$this->FrontA->tdPlain($ent,'neko_val');
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

























