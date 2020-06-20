document.addEventListener("DOMContentLoaded", function(){
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
	socket.on('connect',function(){
		document.getElementById("btn-signup").addEventListener("click", () => {
			let username=document.querySelector('#username').value;
			let pass=document.querySelector('#pass').value;
			let email=document.querySelector('#email').value;
			socket.emit('newuser',{'user':username,'email':email,'pass':pass});
			document.querySelector('#email').value="";
			document.querySelector('#pass').value="";
			document.querySelector('#username').value="";
			document.querySelector('#signupalert').style.display="block;";
		});
	});
});