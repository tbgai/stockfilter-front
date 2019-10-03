var pos = 0;
var bartimer;

function putParam(){
	// 提交相关参数到后台进行处理
	// 

	// 启动定时查询
	startQuery();
	pos = 0;
	// 将按钮disabled
	var btn = document.getElementById("btn_query");
	btn.disabled = true;
}


function queryRate(){
	// 查询后台处理进度
	// 
	
	pos = pos + 1;
	
	setProcess( pos )
}

function setProcess( pos ){
	var processbar = document.getElementById("processbar");
	if ( pos > 100 ) {
		processbar.style.width = 100;
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
	bartimer = window.setInterval(function(){queryRate();},100);
}

function downloadimg(){
	// 
	
}
