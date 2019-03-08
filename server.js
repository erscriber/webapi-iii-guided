const express = require('express'); // importing a CommonJS module
const logger = require('morgan'); // importing Morgan; used to log what requests are made
const helmet = require('helmet'); // importing Helmet; used for added security

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json(), logger('dev'), helmet());

server.use('/api/hubs', restricted, hubsRouter);



//defining custom middleware
function teamNamer(req, res, next) {
	req.team = 'PT3';
	next();
} 

function teamLogger(req, res, next) {
	if(req.team) {
		console.log('team is:', req.team);
	}
	next();
}

function moodyGateKeeper(req, res, next) {
	// if the seconds are a multiple of 3
	// sends back status 403 and the message "shall not pass"
	const seconds = new Date().getSeconds();
	if(seconds % 3 === 0) {
		res
			.status(403)
			.json({ error: "shall not pass!" });
	}
	else {
		next();
	}
}



// middleware attached to specific route
function restricted(req, res, next) {
	const password = req.headers.authorization;
	if(password === 'mellon') {
		next();
	} 
	else if (password) {
		res
			.status(401)
			.json({ err: 'invalid credentials' });
	}
	else {
		next({ err: 'no credentials provided' });
	}
} 



// invoking custom middleware; can also be attached to above server.use
server.use(teamNamer, teamLogger, /*moodyGateKeeper*/); 

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team}, to the Lambda Hubs API</p>
    `);
});


// Catching server errors
server.use((err, req, res, next) => {
	res
		.status(400)
		.json({ message: 'error thrown in server', err: err });
});



module.exports = server;
