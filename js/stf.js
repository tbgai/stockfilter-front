var pos = 0;
var bartimer;

//String.prototype.trim = function() {
//  return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
//}

var sid = '';

function putParam(){

	// 获取相关参数值，调用接口推送到后台查询
	$(document).ready(function(){
		
		var basestk = $("#basestk_txt").val();
		if ( basestk.length == "" ) {
			alert("基准股票数据不能为空");
			return;
		}
		
		var delta2 = [];
		var delta2val = 0;
		$('input[id="delta2_chk"]:checked').each(function(){//遍历每一个id为delta2_chk的复选框，其中选中的执行函数    
            delta2.push($(this).val());//将选中的值添加到数组delta2中
            });
		if ( delta2.length > 0 ){
			delta2val = 1;
		}

		var delta1factor = $("#delta1_txt").val();
		delta1factor = parseFloat(delta1factor);
		if ( delta1factor <=0 || delta1factor > 3 )
		{
			alert( "一阶因子范围：0< 因子 <=3 " );
			return;
		}
		var delta2factor = $("#delta2_txt").val();
		if ( delta2factor <=0 || delta2factor > 3 )
		{
			alert( "二阶因子范围：0< 因子 <=3 " );
			return;
		}

		var stkcount_num = $("#stkcount_num").val();
		stkcount_num = parseInt(stkcount_num);
		if ( stkcount_num < 30 || stkcount_num > 200 )
		{
			alert( "股票曲线展示记录数范围：30 <= 记录数 <=200 " );
			return;
		}

		// 推送至服务器端接口
		$.ajax({
			type:"POST",
			url:"http://127.0.0.1:5000/sf/api/v1.0/stockfilter/",
			data:{
				basestk:basestk,
				delta2:delta2val,
				delta1factor:delta1factor,
				delta2factor:delta2factor,
				stkcount:stkcount_num
			},
			success:function( data ){
			$.each( data, function(key,value) {
				sid = data[key];
				
				// 启动定时查询
				startQuery();
				pos = 0;
				// 将按钮disabled
				var btn = document.getElementById("btn_query");
				btn.disabled = true;
			});
			},
			error:function(){
				alert("请求服务失败，请稍后再试！")
			}
		});

	});
	
}


function queryRate(){
	// 查询后台处理进度
	$(document).ready(function(){
		
		$.ajax({
			type:"GET",
			url:"http://127.0.0.1:5000/sf/api/v1.0/querypos/",
			data:{
				sid:sid
			},
			success:function( data ){
			$.each( data, function(key,value) {
				pos = parseInt(data[key]);
				setProcess( pos );
			});
			},
			error:function(){
				console.log("querypos - 请求服务失败，请稍后再试！")
			}
		});
		
	});
}

function setProcess( pos ){
	var processbar = document.getElementById("processbar");
	if ( pos > 100 ) {
		processbar.style.width = 100 + "%";
		
		$(document).ready(function(){
			$.ajax({
				type:"GET",
				url:"http://127.0.0.1:5000/sf/api/v1.0/queryres/",
				data:{
					sid:sid
				},
				success:function( data ){
				$.each( data, function(key,value) {
					res = data[key];
					
					// 设置结果
					$("#filterres_p").text( res );
					
					
				});
				},
				error:function(){
					console.log("queryres - 请求服务失败，请稍后再试！")
				}
			});
		});
		processbar.innerHTML = processbar.style.width;
		window.clearInterval(bartimer);
		var btn = document.getElementById("btn_query");
		btn.disabled = false;

	}
	else {
  		processbar.style.width = pos + "%";
  		processbar.innerHTML = processbar.style.width;
	}
}

function startQuery(){
	// 定时查询 1秒钟查询一次
	bartimer = window.setInterval(function(){queryRate();},1000);
}

function downloadimg(){
	// 
	
}
