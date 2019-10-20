#!/bin/sh

# nekoテーブルが対象になっているので書き換えてください。
# 2_1_tbl_export.shもnekoテーブルになっているので書き換えてください。

echo 'リモート側の特定テーブルをエクスポートし、ローカル側テーブルにインポートする処理です。'

echo 'サーバー側のshファイルをサーバーに送信します。'
scp -r server amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2/shell/
echo 'サーバー側のshファイルをサーバーに送信しました。'

echo 'サーバー側のテーブルエクスポート・シェルを実行します。'
ssh -l amaraimusi amaraimusi.sakura.ne.jp "
	sh www/zss_rec2/shell/server/2_1_tbl_export.sh;
	"
echo 'サーバー側のテーブルからsqlファイルをエクスポート完了しました。';

echo 'sqlファイルをダウンロードします。'
scp amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2/shell/nekos.sql nekos.sql
echo 'sqlファイルのダウンロードが完了しました。'


echo "ローカルDBのパスワードを入力してください"
read pw

echo '一旦テーブルをDROPします。'
mysql -uroot -p$pw -e "
	use zss_rec2;
	drop table nekos;
	"
echo 'テーブルをDROPしました。'

echo 'ローカル側にテーブルsqlをインポートします。'
mysql -u root -p$pw zss_rec2 < nekos.sql

echo 'ローカル側テーブルにインポートしました。';

echo "サーバー側のシェルをすべて実行しました。"
cmd /k