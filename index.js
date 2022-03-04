const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mysql = require("mysql");
const dotenv = require('dotenv');

var bodyParser = require('body-parser')
//var app = express()

const db = mysql.createConnection({
	host: 'localhost',
	port: 3307,
	user: 'root',
	password: 'zephyr1119',
	database: 'gym'
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// dotenv.config({ path: './.env' });
// const db = mysql.createConnection({
// 	host: process.env.DATABASE_HOST, user: process.env.DATABASE_USER, password: process.env.DATABASE_PASSWORD,
// 	database: process.env.DATABASE
// });
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.set('view engine', 'hbs');
db.connect((error) => {
	if (error) {
		console.log(error)
	} else {
		console.log("mysql connected...")
	}
})
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + "/views/index1.html"));
});

app.get('/signup', function(req,res) {
	console.log(req.body);
	return res.sendFile(path.join(__dirname + '/views/signup.html'));
})

app.post('/auth', function (request, response) {
	// Capture the input fields
	let username = request.body.un;
	let password = request.body.pw;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.query('SELECT * FROM member WHERE c_id = ? AND password = ?', [username, password], function (error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				return response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
app.listen(port, () => {
	console.log(`app listening on port ${port}`);
})