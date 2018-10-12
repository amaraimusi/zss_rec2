/**
 * ImgCompactK.js
 * 
 * 画像をコンパクト化する。
 * クリックで元のサイズになり、もう一度クリックするとコンパクトになる。
 * 
 * 使い方
 * img要素のclass属性に「img_compact_k」を指定する。
 * 
 * 使用例
 * <img src="xxx" class="img_compact_k" />
 * 
 * @version 1.0
 * @date 2016-4-27 新規作成
 * 
 * 
 */


$(function(){

	imgCompactK();
});


function imgCompactK(){
	$('.img_compact_k').each(function(){
		
		$(this).attr('class','');
		
		$(this).css ({'width':'160px',
			'height':'160px'
		});
		
		$(this).click(function() {
			
			var w = $(this).css('width');
			if(w=='160px'){
				$(this).attr('class','img-responsive');
				
				$(this).css ({
					'width':'auto',
					'height':'auto'
				});
			}else{
				$(this).attr('class','');
				
				$(this).css ({'width':'160px',
					'height':'160px'
				});
			}
		});
	});
}












