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
    fs.readFile("backend\\users.json", (err, data)=>{
        if(err){
            console.log();
            response.send("<h3>Internal server error</h3>");
        } else {
            var users = JSON.parse(data);
            var t1 = users.find(x => x.usrn==request.query.usrn);
            var t2 = users.find(x => x.pswd==request.query.pswd);
            if(t1==t2){
                response.send("<h3>Checked</h3>");
            } else {
                response.send("<h3>Wrong crdentials</h3>");
            }
        }
    });
});

apiServer.get("/register",  (request, response)=>{
    var usrn = request.query.usrn;
    var pswd = request.query.pswd;
    fs.readFile("backend/users.json", (err, data) => {
        if(err){
            console.log("Errore "+ err);
            response.send("<body>ERROR<br>Cannot read user</body>");
        } else {
            var users = JSON.parse(data);
            if(users.find(x => x.usrn==usrn) !== undefined){
                var newUser = {
                    "usrn": usrn,
                    "pswd": pswd,
                };
                users.push(newUser);
                fs.writeFile("users.json", JSON.stringify(users, null, users.length+2), (err) =>{
                    if(err){
                        console.log("Errore "+ err);
                        response.send("<body>ERROR<br>Cannot save user</body>");
                    } else {
                        console.log(students);
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