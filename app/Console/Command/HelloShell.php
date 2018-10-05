<?php
class HelloShell extends AppShell {
	public function main() {
		
		define('BIG_CAT', 'big_cat');
		
		CakeLog::config('big_cat', array(
				'engine' => 'FileLog',
				'types' => array('big_cat'),
				'file' => 'big_cat',
		));
		
		$this->log('test=neko',BIG_CAT);//■■■□□□■■■□□□■■■□□□
		
		$this->out('Hello world4.');
	}
}