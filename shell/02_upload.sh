#!/bin/sh
echo 'ソースコードを差分アップロードします。'

rsync -auvz ../app/Vendor amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2/app

echo "------------ 送信完了"
cmd /k