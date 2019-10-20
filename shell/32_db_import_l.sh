#!/bin/sh

echo "ローカルDBのパスワードを入力してください"
read pw


echo 'ローカル側DBにバックアップsqlファイルをインポートします。'
mysql -u root -p$pw zss_rec2 < zss_rec2.sql
echo "処理終了"
cmd /k