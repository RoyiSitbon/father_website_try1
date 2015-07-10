var errorCtrl = require('../models/errorCtrl'),
 	express = require('express'),
	router = express.Router();

module.exports.rootRoutes =  function (app) {
	router.post('/getAllErrors', errorCtrl.getAllErrors);
	router.post('/addError', errorCtrl.addError);
	router.post('/editError', errorCtrl.editError);
	router.post('/deleteError', errorCtrl.deleteError);

	app.use('/', router); 
};
