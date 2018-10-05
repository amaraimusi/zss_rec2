#!/bin/sh

echo 'サーバー先でcake_demo_rsc.tar.gzを解凍します。'
ssh -l amaraimusi amaraimusi.sakura.ne.jp "
	cd www/cake_demo/app/webroot;
	pwd;
	tar vxzf cake_demo_rsc.tar.gz;
	exit;
	"

echo "------------ 解凍完了"
cmd /k