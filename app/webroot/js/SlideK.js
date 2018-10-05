/**
 * 要素のスライド＆ローテーション
 * 
 * 指定した要素グループをスライドアニメーションさせながら、ローテーションで切り替えられます。
 * 
 * @version 1.1.1
 * @date 2016-8-8 | 2017-10-4
 */
var SlideK =function(){
	
	
	this._index =0; // スライドインデックス
	this._elmList = [];// スライド要素リスト
	var self=this; // 自分自身のインスタンス。

	/**
	 * コンストラクタ
	 * 
	 * class属性がslide_kである要素を スライド要素リストとして取得します。
	 * また、スライド要素リストのうち、先頭以外は隠します。
	 */
	this.constract=function(){


		$('.slide_k').each(function(){
			
			self._elmList.push(this);
			
		});
		
		restart();
	}
	
	/**
	 * スライドショー再開
	 * @param index 最初に表示する要素のindex
	 */
	function restart(index){
		
		if(index==null){
			index = 0;
		}
		
		self._index = index;
		
		for(var i in self._elmList){
			
			var elm = $(self._elmList[i]);

			if(i == index){
				elm.show();
			}else{
				elm.hide();
			}


		}
	}
	this.restart = function(index){
		restart(index);
	}
	

	/**
	 * 右に１つスライドします。
	 * 
	 * @param delay 遅延(スライドの速さ) :省略可
	 * @param callback スライド後のコールバック ：省略可
	 * 
	 */
	function rotationNext(delay,callback){
		
		if(delay == null){
			delay=300;
		}
		
		if(self._index == self._elmList.length-1 ){
			return;
		}

		var elm1 = self._elmList[self._index];
		var elm2 = self._elmList[self._index + 1];
		
		self.slideNext(elm1,elm2,delay,callback);
		
		self._index ++;
	}
	this.rotationNext = function (delay,callback){
		return rotationNext(delay,callback)
	}


	/**
	 * 左に１つスライドします。
	 * 
	 * @param delay 遅延(スライドの速さ) :省略可
	 * @param callback スライド後のコールバック ：省略可
	 * 
	 */	
	function rotationPrev(delay,callback){
		
		if(delay == null){
			delay=300;
		}
		if(self._index == 0 ){
			return;
		}

		var elm2 = self._elmList[self._index];
		var elm1 = self._elmList[self._index - 1];
		
		self.slidePrev(elm1,elm2,delay,callback);
		
		self._index --;
	}
	this.rotationPrev = function (delay,callback){
		rotationPrev(delay,callback)

	}



	/**
	 * 次へスライド。
	 * スライド要素1からスライド要素2へ、スライドします。
	 * 
	 * @parma elm1 スライド要素1
	 * @parma elm2 スライド要素2
	 * @param delay 遅延(スライドの速さ) :省略可
	 * @param callback スライド後のコールバック ：省略可
	 * 
	 */
	function slideNext(elm1,elm2, delay,callback){
		$(elm1).hide("slide", {direction: 'left'}, delay, function(){
			$(elm2).show("slide", {direction: 'right'}, delay, function(){
				if(callback != undefined){
					callback();
				}
			});

		});

	}
	this.slideNext = function (elm1,elm2, delay,callback) {
		slideNext(elm1,elm2, delay,callback);

	}
	

	/**
	 * 戻りスライド。
	 * スライド要素2からスライド要素1へ、戻りながらスライドします。
	 * 
	 * @parma elm1 スライド要素1
	 * @parma elm2 スライド要素2
	 * @param delay 遅延(スライドの速さ) :省略可
	 * @param callback スライド後のコールバック ：省略可
	 * 
	 */
	function slidePrev(elm1,elm2, delay,callback){
		$(elm2).hide("slide", {direction: 'right'}, delay, function(){
			$(elm1).show("slide", {direction: 'left'}, delay, function(){
				if(callback != undefined){
					callback();
				}
			});

		});
	}
	this.slidePrev = function (elm1,elm2, delay,callback) {
		slidePrev(elm1,elm2, delay,callback);
	};
	
	

	
	//コンストラクタ呼出し(クラス末尾にて定義すること）
	this.constract();
	
};
	



	



