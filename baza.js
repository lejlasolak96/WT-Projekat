const Sequelize = require("sequelize");

 const sequelize = new Sequelize(
"sql11217591",
"sql11217591",
"CWPTkiE9AW",
{
	host:"sql11.freemysqlhosting.net",
	dialect:"mysql", 
	pool:{
		max:5,
		min:0,
		acquire: 30000,
		idle: 10000
	}
});

module.exports = sequelize;
