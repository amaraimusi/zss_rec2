#!/bin/sh
echo 'sqlファイルをサーバーに送信します。'

scp cake_demo.sql amaraimusi@amaraimusi.sakura.ne.jp:www/cake_demo/shell
echo "------------ 送信完了"
cmd /k