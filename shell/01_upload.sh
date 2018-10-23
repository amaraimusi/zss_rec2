#!/bin/sh
echo 'ソースコードを差分アップロードします。'

rsync -auvz ../app amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2

echo "------------ 送信完了"
cmd /k