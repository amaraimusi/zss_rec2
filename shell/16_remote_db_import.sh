#!/bin/sh

echo 'サーバー側のシェルを実行します。'
ssh -l amaraimusi amaraimusi.sakura.ne.jp "
	sh www/zss_rec2/shell/server/1_2_db_import.sh;
	"

echo "サーバー側のシェルをすべて実行しました。"
cmd /k