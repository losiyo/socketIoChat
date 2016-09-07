$(document).ready(function(){
	var chat = new Chat();
	chat.init();
});

var Chat = function(){
	this.socket = null;
};

Chat.prototype.init = function(){
	var that = this;

	var userid = that.getUid();
	var username = null;

	this.socket = io.connect('http://localhost:3000');

	//提交用户名
	$("#sendName").click(function(){
		username = $("#username").val();

		if(username.trim().length > 0){
			$("#loginBox").hide();

			//告诉服务器端有用户登录
			socket.emit('login', {userid: userid, username: username});
		}
	});

	//监听用户登录
	this.socket.on('login', function(o){
		that.updateSysMes(o, 'login');
	});

	//监听用户退出
	this.socket.on('logout', function(o){
		that.updateSysMes(o, 'logout');
	});

	//监听消息
	this.socket.on('message', function(obj){
		$("#messages").append($('<li>').text(obj.content));
	});

	//发送消息
	$('form').submit(function(){

		var content = $("#m").val();
		var obj = {
			userid: userid,
			username: username,
			content: content
		};

		socket.emit('message', obj);
		$('#m').val('');
		return false;
	});

};

//通过当前时间和随机数获取用户ID
Chat.prototype.getUid = function(){
	return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 1000); 
};

//每次登录和退出时更新信息
Chat.prototype.updateSysMes = function(o, loginMes){
	var onlineUsers = o.onlineUsers;
	var onlineCount = o.onlineCount;
	var user = o.user;
	var action = null;

	//更新在线人数
	$("#userCount").val(onlineCount);

	//更新在线列表
	$("$.userlists").empty();
	for(var uid in onlineUsers){
		if(onlineUsers.hasOwnProperty(uid)){
			$(".userLists").append($('<li>').val(onlineUsers[uid]));
		}
	}

	//添加系统消息
	loginMes == 'login' ? action = '加入了聊天室' : action = '退出了聊天室';
	$("#messages").append($('<p>').text(user.username + action));
};


