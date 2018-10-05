
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

		echo $this->Html->css(array(
			'bootstrap.min',
			'bootstrap-theme.min',
			'jquery-ui.min',
			'Layouts/default',
			'CrudBase/common',
		));


		echo $this->Html->script(array(
			'jquery-2.1.4.min',
			'bootstrap.min',
			'jquery-ui.min',
			'Layouts/default',
			));
		
		echo $this->fetch('meta');
		echo $this->fetch('css');
		echo $this->fetch('script');
	?>


</head>

<body>
<div class="container">


<div class="well" style="width: 200px;margin-left : auto ; margin-right : auto ;">
	<h2>ログイン</h2>
    <?php
    echo $this->Form->create('User', array(
        'inputDefaults' => array('label' => false, 'div' => false, 'legend' => false),
        'class' => 'bs-example form-horizontal'
    ));
    ?>
        <fieldset>
            <?php
            echo $this->Form->input('username', array(
                'div'   => false,
                'label' => false,
                'class' => 'form-control',
            ));
            echo $this->Form->input('password', array(
                'div'   => false,
                'label' => false,
                'class' => 'form-control',
            ));
        ?>
        </fieldset>
    <?php
    echo $this->Form->submit('login', array('div' => false, 'class' => 'btn btn-primary'));
    echo $this->Form->end();
    ?>
</div><!-- well -->
</div><!-- container -->


</body>
</html>