<!DOCTYPE html>
<html>
<head>
	<?php echo $this->Html->charset("utf-8"); ?>
	<title>
		<?php echo $title_for_layout; ?>
	</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php
		echo $this->Html->meta('icon');
		
		echo $this->fetch('meta');
		echo $this->fetch('css');
		echo $this->fetch('script');
	?>


</head>
<body>

	<?php 
	if(empty($header)) $header = 'header';
	echo $this->element($header);
	?>
	
	<div class="container">
		<?php 
		echo $this->Session->flash();
		echo $content_for_layout;
		echo $this->element('footer');
		?>
	</div>

	<?php 
	// SQLダンプ
	if(!empty($sql_dump_flg)){
		echo $this->element('sql_dump'); 
	}
	?>
</body>
</html>
