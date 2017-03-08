// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = module.exports = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = module.exports = require('mongoose');

var config = require('./config'); // get our config file

module.exports = app;

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
//mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('server running at http://localhost:' + port);

mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// API ROUTES -------------------
var apiRoutes = express.Router();
app.use('/api', apiRoutes);



require('./app/routes/auth')(mongoose, app, apiRoutes);
require('./app/routes/groups')(mongoose, app, apiRoutes);




