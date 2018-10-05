#!/bin/bash

echo 'さくらスタンダードのコントロールパネルで先にデータベースを作成してくだい'
echo "DBパスワードを入力してください"
read pw

mysql -h mysql716.db.sakura.ne.jp -u amaraimusi -p$pw -B amaraimusi_zss_rec2 < www/zss_rec2/shell/zss_rec2.sql
echo "出力完了"