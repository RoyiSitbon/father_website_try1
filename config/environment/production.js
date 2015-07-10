'use strict';

// Production specific configuration
// =================================

module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/test'
            //'mongodb://<dbuser>:<dbpassword>@hostname:27017/<dbName>'
  },

  mysql: {
    //uri: 'mysql://root:pass@host/db?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700'
    uri: 'mysql://root@host/buysell'
  }

};