# copyrights @ Mohammed Zahid Imtiyaz Wadiwale this is an Intellectual property of Mohammed Zahid Imtiyaz Wadiwale you cannot modify it
# This Web App is created by Mohammed Zahid Imtiyaz Wadiwale
import os

from flask import Flask, jsonify, render_template, request, redirect, url_for, abort, flash
from flask_socketio import emit, SocketIO, send, join_room, leave_room
import json
import requests

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)
channels=["lobby"]
messages = {"lobby": []}
users = {"admin":[]}
userslist = ["admin"]
usid={}
private_messages = []

@app.route("/")
def index():
    return login()
@app.route("/login", methods=['POST','GET'])
def login():
    if request.method == 'POST':
        userid=request.form['userid']
        password=request.form['password']
        if userid in users:
            temp=users.get(userid)
            if temp == password:
                print("login success")
                return redirect(url_for('logedin',redirector=userid))
            else:
                return render_template("index.html", message="<h5 style='color:red;background-color:hotpink;'>Error:Invalid Password</h5>")
    return render_template("index.html")
@app.route("/logedin/<string:redirector>")
def logedin(redirector):
    return render_template("redirector.html",username=redirector)
@app.route("/groups")
def group():
    return render_template("group.html", channel_list=channels)
@app.route("/home")
def user():
    return render_template("home.html", users=users, userlist=userslist)
@app.route("/c/<string:name>")
def channel(name):
    if name not in channels:
        return "The channel {} does not exist.".format(name)
    return render_template("groupchat.html", current_channel=name, messages=messages[name])
@app.route("/u/<string:name>")
def userchat(name):
    return render_template("userchatbox.html", name=name)
@app.route("/search", methods=['POST','GET'])
def search():
    if request.method == 'POST':
        keyword=request.form['search']
        if keyword in userslist:
            r="u"
        if keyword in channels:
            r="c"
        if keyword not in channels and keyword not in userslist:
            return render_template("search.html", error="No Such Group or User")
        return render_template("search.html", result=r, keyword=keyword)
    return render_template("search.html")
@socketio.on('message')
def handleMessage(msg):
    messages[msg["channel"]].append((msg["message"],msg["user"],msg["timestamp"]))
    print(messages)
    while(len(messages[msg["channel"]]) > 100):
        messages[msg["channel"]].pop(0)
    emit("messages",msg, broadcast=True)
@socketio.on('username')
def receive_username(username):
    usid[username] = request.sid
    print('User SID added!')
    print(usid)
@socketio.on('generator')
def generator(data):
    first = data['first']
    second = data['second']
    for this in private_messages:
        if (this['second']==second and this['first']==first) or (this['first']==second and this['second']==first):
            emit('recieve_old_chat', this['message'])
@socketio.on('private_message')
def private_message(payload):
    recipient_session_id = users[payload['username']]
    sender_id = users[payload['sender']]
    message = payload
    print(message)
    emit('new_private_message', {"first":payload['sender'],"second":payload['username'],"message":payload['message']}, broadcast=True)
    a_dictionary = {"first" : payload["username"], "second" : payload["sender"], "message" : payload["message"], "sender" : payload["sender"]}
    dictionary_copy = a_dictionary.copy()
    private_messages.append(dictionary_copy)
@socketio.on("newuser")
def newuser(usr):
    print(usr["user"])
    if usr["user"] not in userslist:
        username=usr["user"]
        userslist.append(usr["user"])
        print(userslist)
        users[usr["user"]]=usr["pass"]
        print(users)
        emit("anewuser",{"user":usr["user"]}, broadcast=True)
@socketio.on("add channel")
def add_channel(data):
    print(data['channel'] + " has been recived")
    if data['channel'] not in channels:
        print("channel is unique")
        channels.append(data['channel'])
        print(channels)
        messages.setdefault(data['channel'], [])
        print(messages)
        emit("add channel", {"channel": data['channel']}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
