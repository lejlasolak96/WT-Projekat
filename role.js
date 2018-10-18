const Sequelize = require("sequelize");

module.exports=function (sequelize, DataTypes) {

    const Role=sequelize.define('roles', {
        roles: {
            type:   DataTypes.ENUM,
            values: ['student', 'nastavnik', 'administrator']
        }
    });

    return Role;
};