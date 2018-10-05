



$(function() {
	
	wt_init();//初期化
	
});

/// ワーカースレッドの間隔（ミリ秒）
var mwt_interval=2000;

/// ワーカースレッドカウンター
var mwt_counter=0;

/// setIntervalのハンドラリスト。ワーカースレッド停止に使用。
var mwt_handlers=new Array();

/// ワーカースレッドリスト
var mwt_workers=[];

/// ワーカーログ | ワーカースレッド用ログ関係のクラスオブジェクト
var mwt_LogW = new LogForWorkerThread();



/**
 * カニ・ワーカースレッドの初期化
 * 
 * ワーカーリストにワーカーを追加したのち、ワーカースレッドを起動します。
 * 
 * @date 2015-11-24 新規作成
 *
 */
function wt_init(){
	var web_root = $('#wt_web_root').val();//Ajax通信先URL
	var debug_mode = $('#wt_debug_mode').val();//CakePHPのデーバッグモードを取得

	
	//通知ワーカーの生成と初期化
	var notifiWorker=new NotifiWoker();
	notifiWorker.init({
		'web_root':web_root,
		'debug_mode':debug_mode,
	});
	mwt_workers.push(notifiWorker);

	wt_initEventListener();//イベントリスナーに関する初期化
	wt_start();//setIntervalによるスレッドを開始する。
	wt_thread();//一回目の実行
}




/**
 * setIntervalによるワーカースレッドを開始
 */
function wt_start(){
	var h=setInterval("wt_thread()",mwt_interval);//スレッド開始。スレッドにする関数と間隔（ミリ秒）を指定する。
	mwt_handlers.push(h);//ハンドラをリストに追加
	
	//リロード関連項目の表示切替
	$('#wt_nomarl').show();
	$('#wt_error').hide();
	
}

/**
 * ★★★ワーカースレッド
 * 
 * 定期的に呼び出される関数です。
 */
function wt_thread(){
	mwt_counter++;
	$('#wt_counter').html(mwt_counter);
	
	var worker=wt_getNextWorker(mwt_counter);//次に実行するスレッドワーカーを取得する。
	
	//★スレッドワーカーの実行
	worker.execution(worker,wt_errCallback,wt_afterShowDataCallback);//窓口更新ワーカーを実行
	
}

/**
 * エラーコールバック
 * 
 * エラーがあったときに呼び出されるコールバック関数です。
 * 
 * @param res コード
 * @param worker_name ワーカー名
 */
function wt_errCallback(res,worker_name){

	//ワーカーログへ追加
	var str=worker_name + ":" + res;
	mwt_LogW.log(str);

	if(res=='error'){
		wt_stop();
	}
}

/**
 * 一覧表示後コールバック
 * 
 * 一覧が再生成されたときに呼び出されるコールバック関数です。
 * 
 */
function wt_afterShowDataCallback(){
	clmShowHide.refresh();//列のリフレッシュ
}

/**
 * 次に実行するワーカーを取得する。
 * @param mwt_counter ワーカースレッドカウンター
 * @returns ワーカー
 */
function wt_getNextWorker(mwt_counter){
	var index=mwt_counter % mwt_workers.length;
	var w=mwt_workers[index];
	return w;
}

/**
 * ワーカースレッドを停止する。
 */
function wt_stop(){
	for(var i=0;i<mwt_handlers.length;i++){
		var h=mwt_handlers[i];//ハンドラを指定してスレッドを停止する。
		clearInterval(h);
	}
	
	//リロード関連項目の表示切替
	$('#wt_nomarl').hide();
	$('#wt_error').show();
	
	console.log('ワーカースレッドを停止しました。');
}


/**
 * イベントリスナーに関する初期化
 */
function wt_initEventListener(){
	
	//リロードカウンターのダブルクリックイベント。
	$("#wt_counter").dblclick(function(e){
		wt_printLogForWorker()//ワーカーログをデバッグ要素に表示する。
	});
}

/**
 * ワーカーログをデバッグ要素に表示する。
 */
function wt_printLogForWorker(){
	
	//最初のログ10件
	$fLogs=mwt_LogW.getFirstLogs();
	var hf=$fLogs.join('<br>');
	
	//最後のログ10件
	$lLogs=mwt_LogW.getLastLogs();
	var hl=$lLogs.join('<br>');
	
	//ログHTMLの組み立てと出力
	var h=hf;
	if($lLogs.length > 0){
		h = h + "<br>～中略～<br>" + hl;
	}
	$('#wt_debug').html(h);

}














