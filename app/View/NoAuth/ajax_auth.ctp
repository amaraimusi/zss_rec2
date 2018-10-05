<script>
	function test1(){

		var data={'neko':'ネコ','same':{'hojiro':'ホオジロザメ','shumoku':'シュモクザメ'},'xxx':111};
		var json_str = JSON.stringify(data);

		$.ajax({
			type: "POST",
			url: "/cake_demo/no_auth/ajax_auth_test1",
			data: "key1="+json_str,
			cache: false,
			dataType: "text",
			success: function(str_json, type) {
				$("#xxx").html(str_json);
			},
			error: function(xmlHttpRequest, textStatus, errorThrown){
				$('#xxx').html(xmlHttpRequest.responseText);//詳細エラーの出力
			}
		});
	}
</script>
<ol class="breadcrumb">
	<li><a href="/">ホーム</a></li>
	<li><a href="/sample/index.html">サンプル</a></li>
	<li><a href="/cake_demo">Cake Demo</a></li>
	<li><a href="/cake_demo/no_auth/">ログイン認証の検証</a></li>
	<li>Ajaxとログイン認証</li>
</ol>
<h2>Ajaxとログイン認証</h2>


<a href="<?php echo $this->Html->webroot?>users/login">ログイン</a><br>
<a href="<?php echo $this->Html->webroot?>users/logout">ログアウト</a><br>
<br>
<hr>

<input type="button" value="test1" onclick="test1()" />
<div id="xxx"></div>




<br><br>
