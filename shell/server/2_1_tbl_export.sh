#!/bin/bash

echo "DBパスワードを入力してください"
mysqldump -Q -h mysql716.db.sakura.ne.jp -u amaraimusi -p amaraimusi_zss_rec2 titles > www/zss_rec2/shell/titles.sql 2> www/zss_rec2/shell/dump.error.txt

echo "出力完了"