var SERVER_URL = 'http://127.0.0.1:5000/sf/api/v1.0/';
var pos = 0;
var bartimer;
var gSid = '';
var gUrl = '';
var gProcessTime = 0;
var gProcessStart = 0;

$(document).ready(function(){
	
	$("#div_basegraph").hide();
	$("#res_table").hide();

});

function baseGraph(){
	
	$(document).ready(function(){
		
		//
		//$("body").css("cursor", "progress");
		
		
		$("#div_basegraph").show();
		$("#base_img1").attr("src","img/002250.SZ_100.jpg");
		$("#base_img2").attr("src","img/002250.SZ_100.jpg");
		$("#base_img3").attr("src","img/002250.SZ_100.jpg");
		
		//sleep(3000);
		
		//$("body").css("cursor", "default");
	});
}

function putParam(){

	// 获取相关参数值，调用接口推送到后台查询
	$(document).ready(function(){
		
		if ( !confirm("参数设置确认吗？") ){
			return;
		}
		var basestk = $("#basestk_txt").val();
		basestk = jQuery.trim( basestk );
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
			url:SERVER_URL+"stockfilter/",
			data:{
				basestk:basestk,
				delta2:delta2val,
				delta1factor:delta1factor,
				delta2factor:delta2factor,
				stkcount:stkcount_num
			},
			success:function( data ){
			$.each( data, function(key,value) {
				gSid = data[key];
				gUrl = "";
				// 启动定时查询
				startQuery();
				pos = 0;
				gProcessTime = 0;
				var time_start = new Date();
				gProcessStart = time_start.getTime();
				$("#process_time").text( "00:00:00" );
				
				$("#filterres_p").text("");
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
			url:SERVER_URL+"querypos/",
			data:{
				sid:gSid
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
		
		// 处理时间更新
		var time_now = new Date();
		gProcessTime = parseInt((time_now.getTime() - gProcessStart)/1000);
		var isec = gProcessTime % 60;
		var imin = parseInt( gProcessTime / 60 );
		var ihour = parseInt( gProcessTime / 3600 );
		var s_sec = "" + ((isec>9)?isec:"0"+isec);
		var s_min = "" + ((imin>9)?imin:"0"+imin);
		var s_hour = "" + ((ihour>9)?ihour:"0"+ihour);
		$("#process_time").text(s_hour+":"+s_min+":"+s_sec);
	});
}

function setProcess( pos ){
	var processbar = document.getElementById("processbar");
	if ( pos >= 100 ) {
		processbar.style.width = 100 + "%";
		
		$(document).ready(function(){
			$.ajax({
				type:"GET",
				url:SERVER_URL+"queryres/",
				data:{
					sid:gSid
				},
				success:function( data ){
				$.each( data, function(key,value) {
					res = data["res"];
					gUrl = data['purl'];
					
					// 设置结果
					if ( res.length > 0 ){
						$("#filterres_p").text( res );
						
						// 显示结果股票的图形数据
						$("#res_table").show();
						var shtml = "";
						shtml += "<tr><td>002314.SZ</td><td><img src='img/002250.SZ_100.jpg' height='300'>" +
							        "<img src='img/002250.SZ_D2.jpg' height='300'>" + 
							        "</td></tr>"
						$("#res_table").append(shtml);
						
					}
					else{
						$("#filterres_p").text("结果为空");
					}
					
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
	// test : http://47.104.252.239/test.tar.gz
	if ( gUrl.length > 0 ){
		window.open( gUrl );
	}
	else{
		alert( "当前暂无可下载的结果图片，请先提交过滤处理！" );
	}
}
