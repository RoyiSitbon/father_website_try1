var postgresqlConnection =  null;

module.exports.getPostgresqlConnection = function(){
	return postgresqlConnection;
}

module.exports.setPostgresqlConnection = function(connection){
	postgresqlConnection = connection;
}