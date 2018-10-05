#!/bin/bash

echo "DBパスワードを入力してください"
mysqldump -Q -h mysql303.db.sakura.ne.jp -u amaraimusi -p amaraimusi_cake_demo > www/cake_demo/shell/cake_demo.sql 2> www/cake_demo/shell/dump.error.txt

echo "出力完了"