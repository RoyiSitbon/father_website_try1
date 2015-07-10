'use strict';

// Development specific configuration
// ==================================

module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/test-dev'
  },

  mysql: {
    //uri: 'mysql://root:pass@host/db?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700'
    uri: 'mysql://root@127.0.0.1/buysell?debug=true'
  }

  seedDB: true
 	
};