var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/login',
	function (req, res) {
		res.redirect('/');
	}
);

app.post('/login/auth',
	function (request, response) {
		var username = request.body.username;
		var password = request.body.password;
		if (username && password) {
			if (username === "dummy.john@gmail.com" && password === "123456") {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			}
			else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		} else {
			response.send('Please enter Username and Password!');
			response.end();
		}
	});

app.get('/home', function (request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

