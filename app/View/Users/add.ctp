<style>
.users{
	margin-bottom:100px;
}
label{
	width:100px;
}
</style>


<div class="users form" >
<?php echo $this->Form->create('User'); ?>
    <fieldset>
        <legend><?php echo __('Add User'); ?></legend>
        <?php
        echo $this->Form->input('username');
        echo $this->Form->input('password');
        echo $this->Form->input('role', array(
            'options' => array('admin' => 'Admin', 'author' => 'Author')
        ));
    ?>
    </fieldset>
<?php echo $this->Form->end(array('class'=>'btn btn-warning')); ?>
</div>