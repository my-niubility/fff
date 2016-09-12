//此功能用来实现,登录之后页面的头部变化   注：登录、注册、忘记密码、注册协议页面不能调用
var custId = sessionStorage.getItem("custId");
var loginName;
if(!custId){
	alert("登录超时，请重新登录");
	location.href = "login.html";
}
$(function(){
	if(custId){
		Utils.ajax({
			url:"/restful/custinfo/baseinfo/query",
			type:"post",
			data:{"custId":custId},
			success:function(data,xml){
				localStorage.setItem("loginName",data.data.userName);//未实名认证时，手机号为用户名
//				localStorage.setItem("nickName",data.data.nickName);//实名认证后，有了昵称
				loginName = data.data.userName;
				var str = '<a>您好，'+(data.data.nickname&&data.data.nickname!="null"&&data.data.nickname!=""?data.data.nickname:data.data.userName)+'</a>|'+
			        	'<a href="myAsset.html">会员中心</a>|'+
			        	'<a href="javascript:;">退出登录</a>|'+
			            '<a href="newBie.html">新手指南</a>|'+
			        	'<a href="comProblem.html">常见问题</a>';
				$(".top p").html(str);
				
			}
		})
	}
	$(".top a[href='javascript:;']").live("click",function(){
//		退出登录
		Utils.ajax({
	        url: "/restful/user/logout",              //请求地址
	        type: "POST",                       			   //请求方式
	        data: {"custId":custId,"mobile":loginName},         				   //请求参数
	        success: function (response, xml) {
	            // 此处放成功后执行的代码
	            if(response.meta.success){
	            	alert("退出成功");
            		localStorage.clear();
            		sessionStorage.clear();
					location.href = "login.html";
	            }else{
	            	alert(response.meta.message);
	            }
	        }
	    });
	})
})
//点击侧导航的一级菜单，列表收缩或展开
$(".nav_list").delegate("a","click",function(){
	if($(this).next().hasClass("none")){
		$(this).next().removeClass("none");
	}else{
		$(this).next().addClass("none");
	}
})

/*
 * 银行 JSON
 */
var backJson = [
		{"ABC":"农业银行","bankIcon":"img/ABCBank.png"},
		{"CBC":"建设银行","bankIcon":"img/CBCBank.png"},
		{"ICBC":"工商银行","bankIcon":"img/ICBCBank.png"},
		{"BC":"中国银行","bankIcon":"img/BCBack.png"}
	];