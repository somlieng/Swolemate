
//TODO: fix line 69 with content  "if(rows.username != usernameToLookup)". It doesn't work. I want to check if the username exists.


// Prerequisites - first run:
//   npm install express
//   npm install body-parser
//   npm install sqlite3


//TODO: make emails unique (currently only usernnames are unique)
var express = require('express');
var app = express();

// required to support parsing of POST request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('site_files'));

var fs = require("fs");
var file = "users.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
  if(!exists){
    db.run("CREATE TABLE users (email TEXT, password TEXT, username TEXT, firstname TEXT, PRIMARY KEY (username))");
  }
});


app.use(express.static('site_files'));


// CREATE a new user
app.post('/users', function (req, res) {
  var postBody = req.body;
  var email = postBody.email;
  var username = postBody.username;
  var password = postBody.password;
  var first = postBody.firstname;
 // var last = postBody.lastname;


  // must fill in all slots
  if (!username) {
    res.send("Error: Username is undefined.");

    return; // return early!
  }
  else if (!password) {
    res.send("Error: Password is undefined.");

    return; // return early!
  }
  else if (!first) {
    res.send("Error: First Name is undefined.");

    return; // return early!
  }
  else if (!email) {
    res.send("Error: Email is undefined.");

    return; // return early!
  }
//insert USER into database db
//removed last name
  db.run("INSERT INTO users VALUES (?,?,?,?)", email, password, username, first, function(err,result)
  {
	 if (err)
	 {res.send('error');}
		  else
		  {res.send('OK');}
	 		 
  });
  
});
///logging in
app.post('/users/*', function (req, res) {
  var postBody = req.body;
  var usernameToLookup = postBody.username;
  var givenPassword = postBody.password;
    db.each("SELECT * FROM users WHERE username = \"" + usernameToLookup + "\"", function(err, rows){
      if(rows.username != usernameToLookup){ 
        console.log("No user with that username was found.");
        res.send('error');
        return;
      }else if(rows.password == givenPassword){
        console.log("Hello, " + rows.username);
        console.log("password matched, sending");
        res.send('OK');
        return;
      }
      else{
        console.log("Password incorrect");
        res.send('error');
        return;
      }
    });
  });

// start the server on http://localhost:1111/
var server = app.listen(1111, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});

