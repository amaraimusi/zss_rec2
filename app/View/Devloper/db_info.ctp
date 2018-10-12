

<h2>DB情報</h2>



<h3>テーブル一覧</h3>
<ol>
	<?php 
	foreach($tblList as $tbl){
		echo "<li><a href='#{$tbl}'>{$tbl}</a></li>";
	}
	?>
</ol>

<hr>
<?php 
$keys=array('Field','Type','Null','Key','Default','Comment');
foreach($tblList as $i=> $tbl){
	$cmTbl = convModelName($tbl);// モデル名に変換する
	echo "<h3 id='{$tbl}'>{$tbl}\t{$cmTbl}</h3>";
	
	$fieldData=$fieldData2[$i];
	$trs='';
	foreach($fieldData as $ent){
		$tds='';
		foreach($keys as $k){
			$td="<td>{$ent[$k]}</td>";
			$tds.=$td;
		}
		$trs.="<tr>{$tds}</tr>";
	}
	
	echo 
		"<table class='table'>".
		" <thead>".
		" 	<tr>".
		" 		<th>フィールド</th><th>型</th><th>Null</th><th>主キー</th><th>デフォルト</th><th>コメント</th>".
		" 	</tr>".
		" </thead>".
		" <tbody>".
		$trs.
		" </tbody>".
		" </table>";
	
	
	echo "<hr>";
	
}
?>
<?php 
/**
 * テーブル名からモデル名に変換する
 * 
 * @note
 * テーブル名の末尾が"s"なら削る。
 *
 * @param string $tblName テーブル名（例：big_animals)
 * @return string モデル名
 */
function convModelName($tblName) {
	$tblName = strtr($tblName, '_', ' ');
	$tblName = ucwords($tblName);
	
	
	// 末尾が"s"であるなら削る
	if(mb_substr($tblName,-1) == 's'){
		$tblName=mb_substr($tblName,0,mb_strlen($tblName)-1);
	}
	
	
	return str_replace(' ', '', $tblName);
}
?>

<table class='table'>
<thead>
	<tr>
		<th>フィールド</th><th>型</th><th>Null</th><th>主キー</th><th>デフォルト</th><th>コメント</th>
	</tr>
</thead>
<tbody>
</tbody>
</table>