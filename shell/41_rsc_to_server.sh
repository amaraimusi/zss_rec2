#!/bin/sh
echo 'sqlファイルをサーバーに送信します。'

cd ../app/webroot
echo '作業ディレクトリ'
pwd
scp cake_demo_rsc.tar.gz amaraimusi@amaraimusi.sakura.ne.jp:www/cake_demo/app/webroot
echo "cake_demo_rsc.tar.gzの送信完了"


cmd /k