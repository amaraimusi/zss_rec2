#!/bin/sh

echo 'サーバー先で解凍します。'
ssh -l amaraimusi amaraimusi.sakura.ne.jp "
	cd www;
	pwd;
	tar vxzf zss_rec2.tar.gz;
	exit;
	"

echo "------------ 解凍完了"
cmd /k