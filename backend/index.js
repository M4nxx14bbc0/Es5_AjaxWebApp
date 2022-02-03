const { request, response } = require("express");
var express = require("express");
var apiServer = express();
var fs = require("fs");

var port = 3000;
var host = "localhost";
apiServer.listen(port, host, () => {
    console.log("Server running at http://%s:%d", host, port);
});

apiServer.get("/", (request, response)=>{
    response.send("Ciao client sei in home");
});

apiServer.get("/login", (request, response)=>{
    fs.readFile("users.json", (err, data)=>{
        if(err){
            response.status(501);
            response.send("error: ", err);
        } else {
            var users = JSON.parse(data);
            var t1 = users.find(x => x.user==request.query.user);
            var t2 = users.find(x => x.pswd==request.query.pswd);
            if(t1==t2){
                response.status(200);
                response.send("<h3>Checked</h3>");
            } else {
                response.status(500);
                response.send("<h3>Wrong crdentials</h3>");
            }
        }
    });
    fs.close(2);
});

apiServer.get("/addUser",  (request, response)=>{
    var user = request.query.user;
    var pswd = request.query.pswd;
    fs.readFile("users.json", (err, data) => {
        if(err){
            console.log("Errore "+ err);
            response.status(502);
            response.send("<body>ERROR<br>Cannot read user</body>");
        } else {
            var users = JSON.parse(data);
            if(students.find(x => x.user==user)!== undefined){
                var newUser = {
                    "user": user,
                    "pswd": pswd,
                }
                users.push(newUser);
                fs.writeFile("users.json", JSON.stringify(users), (err) =>{
                    if(err){
                        console.log("Errore "+ err);
                        response.status(504);
                        response.send("<body>ERROR<br>Cannot save user</body>");
                    } else {
                        console.log(students);
                        response.status(200);
                        response.send("<h3>Registered new user</h3>");
                    }
                });
            } else {
                response.status(400);
                response.send("<h3>ERROR<br>User already exists</h3>");
            }
        }
    });
    fs.close(2);
});