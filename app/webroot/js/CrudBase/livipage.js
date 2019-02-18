
$( function() {
	
	var cssData={
		'width':'auto'
	}
	var liviPage = new LiviPage();
	liviPage.execution(cssData);
	
});



/**
 * livipage.js | ページ内リンク先プレビュー
 * 
 * ページ内リンクにカーソルを合わせると、リンク先をプレビュー表示する。
 * アンカーのclass属性にlivipageを追加するだけで使用可能。
 * 
 * 要素の予約語
 * class=livipage
 * id=livipage_tooltip
 * 
 * @param cssData CSSデータ（オブジェクト形式）
 * 
 * @version 1.1
 * @date 2016-1-19 オブジェクト化。オプション指定。
 * @date 2016-1-14 ver 1.0
 * @date 2016-1-4 新規作成
 * @author wacgance 
 * 
 */
var LiviPage =function(){
	

	
	this.execution=function(p_cssData){
		//ツールチップ用DIV
		$(document.body).append("<div id='livipage_tooltip'></div>");

		
		//デフォルトCSSデータ
		var cssData = {
			'z-index':2,
			'background-color':'white',
			'position':'absolute',
			'border':'solid 2px #ccb1bf',
			'padding':'5px',
			'width':'280px',
			'height':'460px',
			'overflow-y':'auto',
		}
		
		//引数CSSデータが空でなければ、CSSデータにマージする
		if(p_cssData!=undefined){
			$.extend(cssData, p_cssData);
		}
		
		//ツールチップの外をクリックするとツールチップを閉じる
		$(document).click(
				function (){
					$('#livipage_tooltip').hide();
				});
		
		//領域外クリックでツールチップを閉じるが、ツールチップ自体は領域内と判定させ閉じないようにする。
		$('#livipage_tooltip').click(function(e) {
			e.stopPropagation();
		});
		

		//対象リンクをクリックするとツールチップを表示させる。
		$('.livipage').click(
				function(){
					
					//対象セレクタ
					var slt=$(this).attr('href');

					//対象要素の右上位置を取得
					var offset=$(this).offset();
					var left = offset.left;
					var top = offset.top;
			
					//対象要素の外幅を取得
					var width= $(slt).width();
					var height= $(slt).height();
					
					var tt_html=$(slt).html();
					
					//リンクを作成する
					var link_text=$(this).html();
					var link1="<a href='" + slt + "'>" + link_text + "</a><br>";
					
					tt_html = link1 + tt_html;
					
					$('#livipage_tooltip').show();
					

					
					$('#livipage_tooltip').css(cssData);
					
					
					//ツールチップにHTMLをセット
					$('#livipage_tooltip').html(tt_html);
					
					//ツールチップの位置を算出
					var tt_left=left;
					var tt_top=top + 16;

					//ツールチップ要素に位置をセット
					$('#livipage_tooltip').offset({'top':tt_top,'left':tt_left });
					
					return false;//リンク無効
				}
			);
		
		
		
	};
};
















