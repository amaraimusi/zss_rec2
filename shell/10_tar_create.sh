#!/bin/sh

cd ../../
echo '作業ディレクトリ'
pwd
echo 'cake_demoを圧縮開始'
tar cvzf cake_demo.tar.gz cake_demo
echo 'cake_demo.tar.gzを作成'
echo "------------ 終わり"
cmd /k