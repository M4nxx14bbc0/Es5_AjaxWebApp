var express = require("express");
var apiServer = express();
var fs = require("fs");
var cors = require("cors");

var port = 3000;
var host = "localhost";
apiServer.listen(port, host, () => {
    console.log("Server running at http://%s:%d", host, port);
});

apiServer.use(cors());

apiServer.get("/", (request, response)=>{
    response.send("Ciao client sei in home");
});

apiServer.get("/api/login", (request, response)=>{
    fs.readFile("backend/users.json", (err, data)=>{
        if(err){
            response.sendStatus(500);
        } else {
            var users = JSON.parse(data);
            var t1 = users.find(x => x.usrn==request.query.usrn);
            var t2 = users.find(x => x.pswd==request.query.pswd);
            if(t1==t2 && t1 !== undefined && t2 !== undefined){
                response.sendStatus(200);
            } else {
                response.sendStatus(404);
            }
        }
    });
});

apiServer.get("/api/register",  (request, response)=>{
    var usrn = request.query.usrn;
    var pswd = request.query.pswd;
    fs.readFile("backend/users.json", (err, data) => {
        if(err){
            console.log("Errore "+ err);
            response.send("<body>ERROR<br>Cannot read user</body>");
        } else {
            var users = JSON.parse(data);
            console.log(users.find(x => x.usrn==usrn));
            if(users.find(x => x.usrn==usrn) === undefined){
                var newUser = {
                    "usrn": usrn,
                    "pswd": pswd,
                };
                users.push(newUser);
                fs.writeFile("backend/users.json", JSON.stringify(users, null, users.length+2), (err) =>{
                    if(err){
                        console.log("Errore "+ err);
                        response.send("<body>ERROR<br>Cannot save user</body>");
                    } else {
                        console.log(users);
                        response.send("<h3>Registered new user</h3>");
                    }
                });
            } else {
                response.send("<h3>ERROR<br>User already exists</h3>");
            }
        }
    });
    fs.close(2);
});