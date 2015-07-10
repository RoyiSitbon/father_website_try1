/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/users/users.model');
var encrypt = require('../utils/encryption');
// User.find({}).remove(function() {
//   User.create({
//     name: {
//       firstName: "רועי",
//       lastName: "סיטבון"
//     },
//     email: "royimosh@gmail.com",
//     password: "123456",
//     age: 30,
//     address: {
//       city: "Holon",
//       street: "Avraham Yaffe 3",
//       zipCode: "11155",
//       phone: "037528989"
//     },
//     newsLetter: true,
//     suspended: false,
//     paypalAddress: "royiMoshPaypal@gmail.com",
//   },
//   {
//     name: {
//       firstName: "liran",
//       lastName: "tweg"
//     },
//     email: "liraniom5@gmail.com",
//     password: "123456",
//     age: 30,
//     address: {
//       city: "ramatGan",
//       street: "Rehovout Hanahr 13",
//       zipCode: "11155",
//       phone: "037528989"
//     },
//     newsLetter: true,
//     suspended: false,
//     paypalAddress: "liraniom5@gmail.com",
//   });
// });

User.find({}).exec(function(err,collection) {
  if(collection.length === 0) {
    var salt,hash;
    salt = encrypt.createSalt();
    hash = encrypt.hashPwd(salt,"123456");

    User.create({
      name: {
        firstName: "רועי",
        lastName: "סיטבון"
      },
      email: "royimosh@gmail.com",
      password: hash,
      age: 30,
      address: {
        city: "Holon",
        street: "Avraham Yaffe 3",
        zipCode: "11155",
        phone: "037528989"
      },
      newsLetter: true,
      suspended: false,
      paypalAddress: "royiMoshPaypal@gmail.com",
      salt: salt
    });

    salt = encrypt.createSalt();
    hash = encrypt.hashPwd(salt,"123456");
    User.create({
      name: {
      firstName: "liran",
      lastName: "tweg"
      },
      email: "liraniom5@gmail.com",
      password: hash,
      age: 30,
      address: {
        city: "ramatGan",
        street: "Rehovout Hanahr 13",
        zipCode: "11155",
        phone: "037528989"
      },
      newsLetter: true,
      suspended: false,
      paypalAddress: "liraniom5@gmail.com",
      salt: salt
    });
  }
});