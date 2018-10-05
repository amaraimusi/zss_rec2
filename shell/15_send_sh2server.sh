#!/bin/sh
echo 'サーバー側のshファイルをサーバーに送信します。'

scp -r server amaraimusi@amaraimusi.sakura.ne.jp:www/cake_demo/shell/

echo 'サーバー側のshファイルをサーバーに送信しました。'
cmd /k