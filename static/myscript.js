var current_channel = document.URL.split("/").pop();
document.addEventListener("DOMContentLoaded", function(){
		if(localStorage.getItem("lastchannel") != null)
		{
			var lastchannelloc = localStorage.getItem("lastchannel");
			if(localStorage.getItem("lastchannel")!="lobby")
			{
				if(localStorage.getItem("lastchannel")!=current_channel)
				{
					window.location.href="../../c/"+localStorage.getItem("lastchannel");
				}
			}
		}
		if(localStorage.getItem("lastchannel") == null)
		{
			localStorage.setItem('lastchannel', current_channel);
		}
		else{
			localStorage.removeItem("lastchannel");
			localStorage.setItem('lastchannel', current_channel);
		}
		document.querySelectorAll('.linkit').forEach(function(a) {
			a.onclick = function() {
				const linkme=a.dataset.link;
				const channelnamelink=a.dataset.channelname;
				localStorage.removeItem("lastchannel");
				localStorage.setItem("lastchannel", channelnamelink);
				window.location.href=linkme;
			}
		});
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    socket.on('connect',function(){
        document.querySelector('#message').append('connected');
        document.querySelector('#send').onclick = function() {
                var susername = localStorage.getItem("username");
                const d = new Date();
                const hours=d.getHours();
                const minutes=d.getMinutes();
                const seconds=d.getSeconds();
                const time= hours+":"+minutes+":"+seconds;
                const day=d.getDate();
                const month=d.getMonth();
                const year=d.getFullYear();
                const timestamp=time+ "/"+day+"/"+month+"/"+year;
                const message = susername+" says:<br>"+document.querySelector('#mymessage').value;
                socket.emit('message',{'message':message,'channel':current_channel,'user':susername,'timestamp':timestamp});
                console.log("variable collected:"+message);
                document.querySelector('#mymessage').value="";
        };
    });
    document.getElementById("btnnewchannel").addEventListener("click", () => {
        let new_channel_name=document.querySelector('#newchannel').value;
        socket.emit('add channel', {'channel': new_channel_name});
        $(document).ready(function(){
            $("#createchannel").modal('hide');
        });
        document.querySelector('#newchannel').value="";
    });
    socket.on('messages', function(msg){
            if(msg['channel']==current_channel){
            console.log("variable recieved:"+msg['message']);
            const li = document.createElement('div');
            var fusername = localStorage.getItem("username");
            var nusername = fusername.length;
            var len=msg['message'].substr(0, nusername);
            if (len==fusername) {
            li.innerHTML = `<p align="right;" style="background-color:DodgerBlue;color:white;width:51%;border-radius:1vh;float: right;overflow-wrap: break-word;word-wrap:break-word;">Today ${msg['timestamp']} ${msg['message']}</p>`;}
            else{
                li.innerHTML = `<p align="left;" style="background-color:Gray;color:white;width:51%;border-radius:1vh;float: left;overflow-wrap: break-word;word-wrap:break-word;">Today ${msg['timestamp']} ${msg['message']}</p>`;
            }
            document.querySelector('#message').append(li);
        }
    });
    socket.on('add channel',function(data){
        console.log("channel recieved:"+data['channel']);
        const list = document.createElement('li');
        list.innerHTML=`<a onclick="redirector('${data['channel']}')" style="cursor: pointer;text-decoration:none;color:black;">${data['channel']}</a>`;
        document.querySelector('#channels_lists').append(list);

    });
});
function redirector(x)
{
    localStorage.removeItem("lastchannel");
    localStorage.setItem("lastchannel", x);
    window.location.href=x;
}
function store() {
    var username = document.getElementById('username');
    localStorage.setItem('username', username.value);
    $(document).ready(function(){
        $("#centralModalFluid").modal('hide');
    });
    document.querySelector('#me').innerHTML=username.value;
}
function logout()
{
    localStorage.removeItem("username");
    localStorage.removeItem("lastchannel");
    localStorage.clear();
    window.location.href="../../";
}
if(localStorage.getItem("username") == null)
{
    $(document).ready(function(){
        $("#centralModalFluid").modal('show');
    });
}
else{
    var storedusername = localStorage.getItem("username");
    var storedusername2 = localStorage.getItem("username");
    var storedusername3 = localStorage.getItem("username");
    var storedusername4 = localStorage.getItem("username");
    var storedusername5 = localStorage.getItem("username");
    var storedusername = localStorage.getItem("username");
    document.addEventListener("DOMContentLoaded", function(){
    	var storedusernames = localStorage.getItem("username");
		var unm=String(storedusernames);
    	document.querySelector('#me').innerHTML=unm;
    });
}