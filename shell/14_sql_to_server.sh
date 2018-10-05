#!/bin/sh
echo 'sqlファイルをサーバーに送信します。'

scp zss_rec2.sql amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2/shell
echo "------------ 送信完了"
cmd /k