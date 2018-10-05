#!/bin/sh
echo 'sqlファイルをサーバーに送信します。'

cd ../app/webroot
echo '作業ディレクトリ'
pwd
scp zss_rec2_rsc.tar.gz amaraimusi@amaraimusi.sakura.ne.jp:www/zss_rec2/app/webroot
echo "zss_rec2_rsc.tar.gzの送信完了"


cmd /k