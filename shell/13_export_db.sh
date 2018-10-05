#!/bin/sh

echo '作業ディレクトリ'
pwd

echo "ローカルDBのパスワードを入力してください"
read pw

echo 'SQLをエクスポートします。'
mysqldump -uroot -p$pw cake_demo > cake_demo.sql
echo 'エクスポートしました。'

echo 'SQLファイルをサーバーに転送します。'
scp cake_demo.sql amaraimusi@amaraimusi.sakura.ne.jp:www/cake_demo/shell
echo '転送しました。'

echo "------------ 終わり"
cmd /k