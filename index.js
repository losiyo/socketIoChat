var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

//在线用户
var onlineUsers = {};

//在线人数
var onlineCount = 0;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a user joined');

	//监听用户加入
	socket.on('login', function(obj){
		socket.name = obj.userid;

		//检查用户列表，如果不在则加入里面
		if(!onlineUsers.hasOwnProperty(obj.userid)){
			onlineUsers[obj.userid] = obj.username;

			//在线人数＋1
			onlineCount++;
		};

		//向所有客户端广播用户加入
		io.emit('login', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj});
		console.log(obj.username + "加入了聊天室");

	});

	//监听用户退出
	socket.on('disconnect', function(){
		//将退出的用户从列表中删除
		if(onlineUsers.hasOwnProperty(socket.name)){
			//退出用户的信息
			var obj = {userid: socket.name, username: onlineUsers[socket.name]};

			//删除用户
			delete onlineUsers[socket.name];

			//在线人数－1
			onlineCount--;

			//向所有客户端广播用户退出信息
			io.emit('logout', {onlineUsers: onlineUsers, onlineCountL: onlineCount, user: obj});
			console.log(obj.username + '退出了聊天室');

		}
		console.log('user disconnect');
	});

	//
	socket.on('message', function(obj){
		io.emit('message', obj);
		console.log(obj.username + '说： ' + obj.content);
	});
});

http.listen(3000, function(){
	console.log('Server is running...');
});