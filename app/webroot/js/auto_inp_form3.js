

$( function() {
	
    // ページの読み込みが完了した後に実行するコード
	$obj=new AutoInpForm();
	$obj.init();
	
});

/**
 * 
 * フォーム自動入力
 * 
 * 「Ctrl + F2」を押すとローカルストレージにフォーム入力値が保存されます。
 * 「F2」を押すとローカルストレージに保存した入力値を画面のフォームにセット表示されます。
 * 
 * 「Shit + F2」を押すと入力ダイアログが表示されます。
 * このダイアログはフォーム入力値のエクスポートとインポートの役割をしています。
 * また、フォーム入力値はJSON文字列として扱っています。
 * 
 * * 注意 *
 * id属性を指定しているフォームの値のみが対象です。
 * id属性を指定していないフォームは無視されます。
 * 
 * * 使い方 *
 * jQueryと当ライブラリauto_inp_form3.jsをインクルードするだけです。
 * 
 * * 操作 *
 * Ctrl＋F2でフォーム値を保存
 * F2で反映
 * Shift + F2でインポートおよびエクスポート
 * 
 * @version 3.0
 * 
 * @date 2011-10-17 新規作成
 * @date 2016-1-15	ローカルストレージへ保存
 */
var AutoInpForm =function(){
	
	//初期化。イベントのセッティング
	this.init=function() {

			//▼キーダウンイベント
			$(document).keydown(function(event){
	
		        //▽Ctrl＋F2　フォームの値をクッキーへ保存
		        if( event.shiftKey === false && event.ctrlKey === true && event.which === 113 ){
		        	console.log('ctrlキーとF2が同時に押されました');

		            //すべてのinputエレメントから//inputデータ文字列を作成。
		            var ary=new Array();
		            
		            var props={};
		            
		            $('input').each(
		        		function(){
		        			
		        			var id=$(this).attr("id");
		        			if(id != undefined){
		        				props[id]=$(this).val();
		        			}

		        		}
		            );
		            $('textarea').each(
			        		function(){
			        			var id=$(this).attr("id");
			        			if(id != undefined){
			        				props[id]=$(this).val();
			        			}

			        		}
			            );
		            $('select').each(
			        		function(){
			        			var id=$(this).attr("id");
			        			if(id != undefined){
			        				props[id]=$(this).val();
			        			}

			        		}
			            );
		            
		            
		            var str_json=JSON.stringify(props);
		            
		            //現ページのURLをキーにして、inputデータ文字列をクッキーに保存
		            var url=location.href;
		            
		            localStorage.setItem(url,str_json);
		            
	                
		        }
		        
		        //▽F2　クッキーの値をフォームに反映。
		        if( event.shiftKey === false && event.ctrlKey === false && event.which === 113 ){

	                //$('#test').html('F2が押されました。');
	
		        	//現ページのURLを取得する。
	                var url=location.href;
	                
	                var str_json=localStorage.getItem(url);
	                if(str_json==null){
	                	console.log('auto_inp_form3:保存中のフォームデータはありません。');
	                	return;
	                }
	                
	                var props =JSON.parse(str_json);//※オブジェクトに戻す場合
	                
	                
	                for(var id in props){
	                	var value=props[id];
	                	$('#' + id).val(value);
	                	
	                }

	                
		        	
		        }
		        
		        //▽Shift+F2 コンマデータ入力ダイアログ表示。
		        if( event.shiftKey === true && event.ctrlKey === false && event.which === 113 ){
	                //$('#test').html('ShiftキーとF2が同時に押されました。');
	                
	                
	                //現ページのURLを取得する。
	                var url=location.href;
	                
	                //URLをキーにクッキーからInputデータ文字列を表示する。
	                var str_json=localStorage.getItem(url);
	                
	                //入力ダイアログを表示する。その際、デフォルトテキストにInputデータ文字列をセット。
	                var rtn = window.prompt("FROMデータ文字列", str_json);
	                
	                //返値がnullなら処理終了。
	                if(rtn==null){
		        
	                	return;
	                }
	                
	                var props =JSON.parse(str_json);//※オブジェクトに戻す場合
	                
	                
	                for(var id in props){
	                	var value=props[id];
	                	$('#' + id).val(value);
	                	
	                }

	        
		        }

			});
		
	};
	

};
 
