'use strict';

//var _ = require('lodash');
//var loadData = require('./loadData.model');
var path = require('path');
var fs = require('fs');
var express = require('express');

var postgresqlConnection = require('../utils/sqlConnection').getPostgresqlConnection();

exports.getAllErrors = function(req, res) {
	//initializeArrManually();
	getTable(req, res);
};

exports.addError = function(req, res) {

	var currentError = req.body.currentError;

	var type = currentError.detection_type.toUpperCase();
	var name = currentError.name.toUpperCase();
	var os = currentError.os.toUpperCase();
	var regkey = currentError.regkey.toUpperCase();
	var keyvalue = currentError.keyvalue.toUpperCase();
	postgresqlConnection.query('SELECT * FROM ic_detection_index_types WHERE upper(detection_type)=($1) and upper(name)=($2) and upper(os)=($3) and upper(regkey)=($4) and upper(keyvalue)=($5)',[type,name,os,regkey,keyvalue], function(err, rows, fields) {
	  	if (rows.rows[0]){
			console.log('Fields already exist');
			res.status(404).send("Fields already exist");
		} else{
			postgresqlConnection.query("INSERT INTO ic_detection_index_types(detection_type, detection_index, name, os, regkey, keyvalue) VALUES($1, $2, $3, $4, $5, $6)",[type,currentError.detection_index,name,os,regkey,keyvalue],function(err, result) {
				if (!err){
					getTable(req, res);
				} else {
					console.log('Error while performing update.');
					res.status(404).send("insert failed");
				}
			});
		}
	});
};

exports.editError = function(req, res) {

	var editError = req.body.editError;
	var currentError = req.body.currentError;

	var type = currentError.detection_type.toUpperCase();
	var name = currentError.name.toUpperCase();
	var os = currentError.os.toUpperCase();
	var regkey = currentError.regkey.toUpperCase();
	var keyvalue = currentError.keyvalue.toUpperCase();
	
	postgresqlConnection.query('SELECT * FROM ic_detection_index_types WHERE upper(detection_type)=($1) and upper(name)=($2) and upper(os)=($3) and upper(regkey)=($4) and upper(keyvalue)=($5)',[type,name,os,regkey,keyvalue], function(err, rows, fields) {
	  	if (rows.rows[0]){
			console.log('Fields already exist');
			res.status(404).send("Fields already exist");
		} else{
			postgresqlConnection.query("UPDATE ic_detection_index_types SET detection_type = ($1), detection_index = ($2), name=($3), os=($4), regkey=($5), keyvalue=($6) WHERE detection_type=($7) and detection_index=($8) and name=($9)",[type,currentError.detection_index,name,os,regkey,keyvalue,editError.detection_type,editError.detection_index,editError.name], function(err, result) {
				if (!err){
					getTable(req, res);
				} else {
					console.log('Error while performing update.');
					res.status(404).send("edit failed");
				}
		    });
		}
	});
};

exports.deleteError = function(req, res) {

	var currentError = req.body.currentError;
 	postgresqlConnection.query("DELETE FROM ic_detection_index_types WHERE upper(detection_type)=($1) and detection_index=($2) and upper(name)=($3) and upper(os)=($4) and upper(regkey)=($5) and upper(keyvalue)=($6)", [currentError.detection_type.toUpperCase(),currentError.detection_index,currentError.name.toUpperCase(),currentError.os.toUpperCase(),currentError.regkey.toUpperCase(),currentError.keyvalue.toUpperCase()],function(err, result){
 		if (!err){
 			getTable(req, res);
		} else {
			console.log('Error while performing delete.');
			res.status(404).send("delete failed");
		}
 	});
};

var getTable = function(req, res){
	postgresqlConnection.query('SELECT * from ic_detection_index_types ORDER BY upper(detection_type),detection_index,upper(os),upper(name)', function(err, rows, fields) {
	  	if (!err){
	    	console.log('The solution is: ', rows.rows);
			res.status(200).send(rows.rows);
		} else{
			console.log('Error while performing Query.');
			res.status(404).send("no fields where found");
		}
	});
}

/*when we want to clean the table*/
var deleteAllTable = function(req, res){
	
	postgresqlConnection.query("DELETE FROM ic_detection_index_types",function(err, result){
		if (!err){
			getTable(req, res);
		} else {
			console.log('Error while performing delete.');
			res.status(404).send("delete failed");
		}
	});
}

/*when we want to insert all rows at beginning*/
var initializeArrManually = function(){
	var arr = [
		//example

		/*photoshop*/
		// {	
		// 	detection_index : 1,
		// 	detection_type : 'photoshop',
		// 	name : 'blabla',
		// 	os :   'windows',
		// 	regkey: 'HKEY_LOCAL_MACHINE/SOFTWARE/blabla/blabla/1.0',
		// 	keyvalue:''
		// },

		// /*Mac*/
		// {	
		// 		detection_index :1,
		// 		detection_type:'Mac',
		// 		name:'blabla',
		// 		os:'mac',
		// 		regkey: 'com.blabla.bl',
		// 		keyvalue:''
		// }					
		
	];


	for(var i=0; i<arr.length; i++){
		(function queryMe(ind) {
			postgresqlConnection.query("INSERT INTO ic_detection_index_types(detection_type,detection_index,name, os, regkey, keyvalue) VALUES($1, $2, $3, $4, $5, $6)",[arr[ind].detection_type,arr[ind].detection_index,arr[ind].name,arr[ind].os,arr[ind].regkey,arr[ind].keyvalue],function(err, result) {
				if(err){
					console.log('Error while performing initialize.');
					res.status(404).send("initialize failed");
				} else {
					console.log(ind);
				}
			});
		})(i);
	}

 }


