<?php

/**
 * CrudBaseのロジッククラス
 * 
 * @version 2.2.0
 * @date 2016-1-21 | 2018-10-3
 * @history
 * 2018-10-3 v2.2.0 アップロードファイルの抹消処理を追加
 * 2016-1-21 v1.0.0 新規作成
 * 
 */
class CrudBase{


    public $useTable = false; /* データベースのテーブルを使用しない */
    public $validate = null;


	
	/**
	 * 列並替アクティブデータの昇順ソートと構造変換を行う。
	 * 
	 *  列並替アクティブデータはフィールデータに含まれており、現在の列並び状態を表す。
	 * 
	 * @param array $active	列並替アクティブデータ
	 * @return 列並替アクティブ(昇順ソート適用、構造変換後）
	 */
	public function sortAndCombine($active){
	
		//構造変換
		$data=array();
		foreach($active as $id=>$ent){
			$ent['id']=$id;
			$data[]=$ent;
		}
	
		//列並番号でデータを並び替える
		$sorts=Hash::extract($data, '{n}.clm_sort_no');
		array_multisort($sorts,SORT_ASC,$data);
	
		return $data;
	}
	
	
	/**
	 * フィールドデータが空でなければ、フィールドデータから一覧列情報を作成する。
	 * @param array $field_data フィールドデータ
	 * @return array 一覧列情報
	 */
	public function makeTableFieldFromFieldData($field_data){
		$fields=array();
		$clms=$field_data['active'];
	
		foreach($clms as $clm){
			$row_order = $clm['row_order'];
			$name = $clm['name'];
			$fields[$row_order] = $name;
		}
	
		return $fields;
	}
	
	/**
	 * nullでないかチェック(フラグ用）
	 *
	 * @note
	 * false : null,空文字,未セット
	 * true : TRUE系値,0,false
	 * @param array $kjs
	 * @param string $field
	 * @return boolean
	 */
	protected function isnotNull($kjs,$field){
		if(isset($kjs[$field])){
			if(empty($kjs[$field])){
				if($kjs[$field] ==='0' || $kjs[$field] ===0 || $kjs[$field] ===false){
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		}else{
			return false;
		}
	}
	
	
	/**
	 * 部分的な日時文字列から日時情報を推測する。
	 *
	 * @note
	 * 部分的な日時文字列とは「2018-8」,「8/31」,「10:30」などを指す。
	 *
	 * @param string $str 部分的日時文字列
	 * @param $option
	 *  - time_priority 時刻優先フラグ(あいまいな数値並びである場合、日付と時刻のどちらを優先判定するか)    0:日付フォーマットを優先判定 , 1:時刻フォーマットを優先判定
	 *  - format_b 出力の１つであるdatetime_bのフォーマット（デフォルト→ Y-m-d H:i:s)
	 * @return array
	 *  - orig_datetime 元の日時文字列
	 *  - datetime_a 部分日時
	 *  - format_a 部分日時フォーマット
	 *  - datetime_b 日時
	 *  - format_b 日時フォーマット
	 *  - format_mysql_a 部分日時フォーマット（MySQL用）
	 *  - format_mysql_b 日時フォーマット（MySQL用）
	 *
	 */
	public function guessDatetimeInfo($str,$option=array()){
	    
	    App::uses('DatetimeGuess','Vendor/Wacg');
	    if(empty($this->DatetimeGuess)) $this->DatetimeGuess = new DatetimeGuess();
	    
	    $info = $this->DatetimeGuess->guessDatetimeInfo($str,$option);
	    return $info;
	    
	}
	
	
	/**
	 * 文字列から適切な日時のフォーマットを取得する
	 *
	 * @param string $str 日付文字列
	 * @param $format =  string フォーマット
	 * @param $option
	 *  - time＿priority 時刻優先フラグ    0:日付フォーマットを優先判定 , 1:時刻フォーマットを優先判定
	 *  - mysql_format_flg MySQLフォーマットフラグ 0:PHP型の日時フォーマット , 1:MySQL型の日時フォーマット
	 */
	public function getDateFormatFromString($str,$option=array()){
	    
	    $time＿priority = 0;
	    if(!empty($option['time＿priority'])) $time＿priority = $option['time＿priority'];
	    
	    $mysql_format_flg = 0;
	    if(!empty($option['mysql_format_flg'])) $mysql_format_flg = $option['mysql_format_flg'];
	    
	    
	    $format = '';
	    
	    if(preg_match('/^\d+$/', $str)){
	        
	        $len = strlen($str);
	        if($len == 14){
	            $format =  'Y-m-d H:i:s';
	        }else if($len == 8){
	            $format =  'Y-m-d';
	        }else if($len == 6){
	            if($time＿priority == 0){
	                $format =  'Y-m-d';
	            }else{
	                $format =  'H:i:s';
	            }
	            
	        }else if($len == 4){
	            if($time＿priority == 0){
	                if(preg_match('/^[1-9][0-9]{3}$/', $str)){
	                    $format =  'Y';
	                }else{
	                    $format =  'm-d';
	                }
	            }else{
	                $format =  'H:i';
	            }
	        }else if($len == 1 || $len == 2){
	            if($time＿priority == 0){
	                $format =  'd';
	            }else{
	                $format =  'h';
	            }
	        }
	    }
	    else if(preg_match('/^[1-9]([0-9]{3})(\/|-)([0-9]{1,2})(\/|-)([0-9]{1,2}) ([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})/', $str)){
	        $format =  'Y-m-d H:i:s';
	    }
	    else if(preg_match('/^[1-9]([0-9]{3})(\/|-)([0-9]{1,2})(\/|-)([0-9]{1,2}) ([0-9]{1,2}):([0-9]{1,2})/', $str)){
	        $format =  'Y-m-d H:i';
	    }
	    else if(preg_match('/^[1-9]([0-9]{3})(\/|-)([0-9]{1,2})(\/|-)([0-9]{1,2}) ([0-9]{1,2})/', $str)){
	        $format =  'Y-m-d H';
	    }
	    else if(preg_match('/^[1-9]([0-9]{3})(\/|-)([0-9]{1,2})(\/|-)([0-9]{1,2})/', $str)){
	        $format =  'Y-m-d';
	    }
	    else if(preg_match('/^[1-9]([0-9]{3})(\/|-)([0-9]{1,2})/', $str)){
	        $format =  'Y-m';
	    }
	    else if(preg_match('/^[1-9]([0-9]{3})$/', $str)){
	        $format =  'Y';
	    }
	    else if(preg_match('/([0-9]{1,2})(\/|-)([0-9]{1,2})/', $str)){
	        $format =  'm-d';
	    }
	    else if(preg_match('/([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})/', $str)){
	        $format =  'H:i:s';
	    }
	    else if(preg_match('/([0-9]{1,2}):([0-9]{1,2})/', $str)){
	        $format =  'H:i';
	    }
	    
	    // MySQLフォーマットフラグがONであるならば、日時フォーマットをMySQL用の日時フォーマットに変換する（例：Y-m-d → %Y-%m-%d)
	    if(!empty($mysql_format_flg)){
	        $format = $this->convDateformatForMySql($format);
	    }
	    
	    return $format;
	}
	
	/**
	 * 日時フォーマットをMySQL用の日時フォーマットに変換する（例：Y-m-d → %Y-%m-%d)
	 * @param string $format 日時フォーマット
	 * @return string MySQL用の日時フォーマット
	 */
	public function convDateformatForMySql($format){
	    $format2='';
	    $ary = str_split($format);
	    for($i=0;$i<count($ary);$i++){
	        if($i % 2==0){
	            $format2 .= '%' . $ary[$i];
	        }else{
	            $format2 .= $ary[$i];
	        }
	    }
	    return $format2;
	}
	
	
	/**
	 * 番号文字列から適切な日時のフォーマットを取得する
	 *
	 * @param string $str 日付文字列
	 * @param $option
	 *  - time＿priority 時刻優先フラグ    0:日付フォーマットを優先判定 , 1:時刻フォーマットを優先判定
	 * @return string フォーマット
	 */
	public function convNumStr2date($str,$option = array()){
	    
	    if(empty($str)) return $str;
	    if(!preg_match('/^\d+$/', $str)) return $str;
	    
	    $ary = str_split($str, 2);
	    $len = strlen($str);
	    if($len == 14){
	        
	        // Y-m-d H:i:s
	        return "{$ary[0]}{$ary[1]}-{$ary[2]}-{$ary[3]} {$ary[4]}:{$ary[5]}:{$ary[6]}";
	    }else if($len == 8){
	        // Y-m-d
	        return "{$ary[0]}{$ary[1]}-{$ary[2]}-{$ary[3]}";
	        
	        
	    }else if($len == 6){
	        if($time＿priority == 0){
	            if(preg_match('/^[1-9]([0-9]{3}(\/|-)([0-9]{1,2})/', $str)){
	                // Y-m-d
	                return "{$ary[0]}{$ary[1]}-{$ary[2]}";
	            }else{
	                // Y-m-d
	                return "20{$ary[0]}-{$ary[1]}-{$ary[2]}";
	            }
	        }else{
	            // H:i:s
	            return "{$ary[0]}:{$ary[1]}:{$ary[2]}";
	        }
	        
	    }else if($len == 4){
	        if($time＿priority == 0){
	            if(preg_match('/^20/', $str)){
	                // Y
	                return "{$ary[0]}{$ary[1]}";
	            }else{
	                // m-d
	                return "{$ary[0]}-{$ary[1]}";
	            }
	        }else{
	            // H:i
	            return "{$ary[0]}:{$ary[1]}:00";
	        }
	    }else if($len == 1 || $len == 2){
	        if($time＿priority == 0){
	            return "{$ary[0]}";
	        }else{
	            return "{$ary[0]}:00:00";
	        }
	    }
	    
	    
	    return null;
	}
	
	/**
	 * 部分的日時のフォーマット変換
	 * @param string $str 部分的日時
	 * @param string $format1 部分的日時のフォーマット
	 * @param string $format2 変換先のフォーマット
	 * @param array $option オプション
	 *  - digit2_flg 2桁そろえフラグ    0:2桁に揃えず , 1(デフォルト）:2桁に揃える（ 例： 8 → 08）
	 * @return string フォーマット変換された日時
	 */
	public function convDatetimeFormat($str,$format1,$format2,$option=array()){
	    
	    $digit2_flg = 1;
	    if(isset($option['digit2_flg'])) $digit2_flg = $option['digit2_flg'];
	    
	    $list = preg_split("/[-\/\s:]/", $str);
	    $fmts1 = preg_split("/[-\/\s:]/", $format1);
	    $fKeys1 = array_flip($fmts1);
	    $fmts2 = preg_split("/[-\/\s:]/", $format2);
	    
	    $str2 = $format2;
	    foreach($fmts2 as $i => $key){
	        $v = null;
	        if(isset($fKeys1[$key])){
	            $fk_i = $fKeys1[$key];
	            $v = $list[$fk_i];
	        }else{
	            switch ($key) {
	                case 'Y': $v = date('Y'); break;
	                case 'm': $v = '1'; break;
	                case 'd': $v = '1'; break;
	                case 'H': $v = '0'; break;
	                case 'i': $v = '0'; break;
	                case 's': $v = '0'; break;
	            }
	        }
	        
	        if(!empty($digit2_flg) && strlen($v) == 1){
	            $v = '0' . $v;
	        }
	        
	        $str2 = str_replace($key, $v, $str2);
	    }
	    return $str2;
	}
	
	/**
	 * 末尾順番を取得する
	 * @param Model $model モデル
	 * @return int 末尾順番
	 */
	public function getLastSortNo(&$model){
		$tbl_name = $model->useTable;
		$sql = "SELECT MAX(sort_no) as max_sort_no FROM {$tbl_name} WHERE delete_flg=0";
		$data = $model->query($sql);
		$max_sort_no = 0;
		if(!empty($data[0][0]['max_sort_no'])) $max_sort_no = $data[0][0]['max_sort_no'];
		$last_sort_no = $max_sort_no + 1;
		return $last_sort_no;
	}
	
	/**
	 * 先頭順番を取得する
	 * @param Model $model モデル
	 * @return int 先頭順番
	 */
	public function getFirstSortNo(&$model){
		$tbl_name = $model->useTable;
		$sql = "SELECT MIN(sort_no) as min_sort_no FROM {$tbl_name} WHERE delete_flg=0";
		$data = $model->query($sql);
		$min_sort_no = 0;
		if(!empty($data[0][0]['min_sort_no'])) $min_sort_no = $data[0][0]['min_sort_no'];
		$first_sort_no = $min_sort_no - 1;
		return $first_sort_no;
	}
	
	
	/**
	 * SQLインジェクションサニタイズ
	 *
	 * @note
	 * SQLインジェクション対策のためデータをサニタイズする。
	 * 高速化のため、引数は参照（ポインタ）にしている。
	 *
	 * @param any サニタイズデコード対象のデータ | 値および配列を指定
	 * @return void
	 */
	public function sql_sanitize(&$data){
		
		if(is_array($data)){
			foreach($data as &$val){
				$this->sql_sanitize($val);
			}
			unset($val);
		}elseif(gettype($data)=='string'){
			$data = addslashes($data);// SQLインジェクション のサニタイズ
		}else{
			// 何もしない
		}
	}
	
	/**
	 * SQLサニタイズデコード
	 *
	 * @note
	 * SQLインジェクションでサニタイズしたデータを元に戻す。
	 * 高速化のため、引数は参照（ポインタ）にしている。
	 *
	 * @param any サニタイズデコード対象のデータ | 値および配列を指定
	 * @return void
	 */
	public function sql_sanitize_decode(&$data){
		
		if(is_array($data)){
			foreach($data as &$val){
				$this->sql_sanitize_decode($val);
			}
			unset($val);
		}elseif(gettype($data)=='string'){
			$data = stripslashes($data);
		}else{
			// 何もしない
		}
	}
	
	/**
	 * スネークケースにキャメルケースから変換
	 * @param string $str キャメルケース
	 * @return string スネークケース
	 */
	public function snakize($str) {
		$str = preg_replace('/[A-Z]/', '_\0', $str);
		$str = strtolower($str);
		return ltrim($str, '_');
	}
	
	/**
	 * キャメルケースにスネークケースから変換する
	 *
	 * 先頭も大文字になる。
	 *
	 * @param string $str スネークケースの文字列
	 * @return string キャメルケースの文字列
	 */
	public function camelize($str) {
		$str = strtr($str, '_', ' ');
		$str = ucwords($str);
		return str_replace(' ', '', $str);
	}
	
	/**
	 * ローワーキャメルケースに変換する
	 *
	 * @note
	 * ローワーキャメルケースは先頭の一文字が小文字のキャメルケース。
	 *
	 * @param string $str スネーク記法、またはキャメル記法の文字列
	 * @return string ローワーキャメルケースの文字列
	 */
	public function lowerCamelize($str){
		
		if(empty($str)) return $str;
		
		// 先頭の一文字が小文字である場合、一旦キャメルケースに変換する。
		$h_str = substr($str,0,1);
		if(ctype_lower($h_str)){
			// キャメルケースに変換する
			$str = strtr($str, '_', ' ');
			$str = ucwords($str);
			$str = str_replace(' ', '', $str);
		}
		
		// 先頭の一文字を小文字に変換する。
		$str = lcfirst($str);
		
		return $str;
		
	}
	
	
	/**
	 * アップロードファイルの抹消処理
	 *
	 * @note
	 * 他のレコードが保持しているファイルは抹消対象外
	 *
	 * @param Model $model モデル
	 * @param int $id
	 * @param string $fn_field_strs ファイルフィールド群文字列（複数ある場合はコンマで連結）
	 * @param array $dtpData ディレクトリパステンプレート情報
	 */
	public function eliminateFiles(&$model,$id,$fn_field_strs,&$dtpData){

		// モデルと紐づいているテーブルからidに紐づくレコードを取得する。
		$tbl_name = $model->useTable;
		$sql = "SELECT * FROM {$tbl_name} WHERE id={$id}";
		$res = $model->query($sql);
		if(empty($res)) return;
		if(empty($res[0])) return;
		$ent = $res[0][$tbl_name];
		
		// ▼削除データを作成する
		$delData = array(); // 削除データ
		$fnFields = explode(",",$fn_field_strs); // ファイルフィールドリスト
		foreach($fnFields as $fn_field){
			
			// ▼削除データにファイル名をセットする
			$delEnt = array('fn'=>null,'fps'=>array());
			if(empty($ent[$fn_field])){
				$delData[$fn_field] = $delEnt;
				continue;
			}
			$fn = $ent[$fn_field];
			$delEnt['fn'] = $fn;
			
			// ▼削除データにファイルパスリストをセットする。
			$fps = array();
			foreach($dtpData as $dtp){
				$fp = str_replace('%field', $fn_field, $dtp);
				$fp .= $fn;
				$fps[] = $fp;
			}
			$delEnt['fps'] = $fps;
			
			// ▼削除するファイル名が他のレコードで使われていないなら抹消フラグをONにする。使われているならfalseにする。
			$sql2 = "SELECT * FROM {$tbl_name} WHERE {$fn_field}='{$fn}' AND id != {$id} LIMIT 1";
			$res2 = $model->query($sql2);
			if(empty($res2)){
				$delEnt['eliminate_flg'] = true;
			}else{
				$delEnt['eliminate_flg'] = false;
			}

			$delData[$fn_field] = $delEnt;
			
		}
		
		// ▼削除データをループし、抹消フラグがfalseでないならファイル抹消を行う。
		foreach($delData as $delEnt){
			if($delEnt['eliminate_flg'] == false) continue;
			
			// ▼ファイルパスリストをループし、ファイルパスに紐づくファイルを削除する。
			$fps = $delEnt['fps'];
			foreach($fps as $fp){
				unlink($fp);
			}
			 
		}

	}
	
	
	
	

}