'use strict';

//var _ = require('lodash');
//var loadData = require('./loadData.model');
var path = require('path');
var fs = require('fs');
var express = require('express');

var postgresqlConnection = require('../utils/sqlConnection').getPostgresqlConnection();

exports.getAllErrors = function(req, res) {

	//when want to clean the table
	// postgresqlConnection.query("DELETE FROM ic_detection_index_types",function(err, result){
	// 	if (!err){
	// 		getTable(req, res);
	// } else {
	// 	console.log('Error while performing delete.');
	// 	res.status(404).send("delete failed");
	// }
	// });

	getTable(req, res);
    //mySqlConnection.end();
};

exports.addError = function(req, res) {

	var currentError = req.body.currentError;
	postgresqlConnection.query("INSERT INTO ic_detection_index_types(detection_type, detection_index, name) VALUES($1, $2, $3)",[currentError.detection_type,currentError.detection_index,currentError.name],function(err, result) {
		if (!err){
			getTable(req, res);
		} else {
			console.log('Error while performing update.');
			res.status(404).send("insert failed");
		}
	});
};

exports.editError = function(req, res) {

	var editError = req.body.editError;
	var currentError = req.body.currentError;

	postgresqlConnection.query("UPDATE ic_detection_index_types SET detection_type = ($1), detection_index = ($2), name=($3) WHERE detection_type=($4) and detection_index=($5) and name=($6)",[currentError.detection_type,currentError.detection_index,currentError.name,editError.detection_type,editError.detection_index,editError.name], function(err, result) {
		if (!err){
			getTable(req, res);
		} else {
			console.log('Error while performing update.');
			res.status(404).send("edit failed");
		}
    });
};

exports.deleteError = function(req, res) {

	var currentError = req.body.currentError;

 	postgresqlConnection.query("DELETE FROM ic_detection_index_types WHERE detection_type = ($1) and detection_index = ($2) and name=($3)", [currentError.detection_type,currentError.detection_index,currentError.name],function(err, result){
 		if (!err){
 			getTable(req, res);
		} else {
			console.log('Error while performing delete.');
			res.status(404).send("delete failed");
		}
 	});
};


var getTable = function(req, res){
	postgresqlConnection.query('SELECT detection_type,detection_index,name from ic_detection_index_types ORDER BY detection_type,detection_index,name', function(err, rows, fields) {

	  	if (!err){
	    	console.log('The solution is: ', rows.rows);
			res.status(200).send(rows.rows);
		} else{
			console.log('Error while performing Query.');
			res.status(404).send("no fields where found");
		}
	});
}
