'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  }).sort((a,b)=>{
    if (a === "favorites.js" || a === "futures.js" || a === "currents.js" || a === "previous.js" ) {
      return 1;
    } else if (b === "favorites.js" || b === "futures.js" || b === "currents.js" || b === "previous.js" ) {
      return -1;
    } else {
      return 0;
    }
  })
  .forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/* db.Book.belongsToMany(db.User, {through: 'favorite'});
db.User.belongsToMany(db.Book, {through: 'favorite'}); */
console.log( db.modelName)
module.exports = db;
