const Sequelize = require("sequelize");
const bcrypt=require('bcryptjs');

module.exports=function (sequelize, DataTypes) {

    const Korisnik=sequelize.define('users',{

            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password:{
                type:DataTypes.STRING,
                allowNull: false
            },
            verified:{
                type:DataTypes.STRING,
                allowNull: true
            }
        },
        {
            hooks: {

                beforeCreate: function (user, options) {

                    return bcrypt.hash(user.password, 10)
                        .then(function (h) {
                            user.password=h;
                        })
                        .catch(function (err) {
                            throw  new Error();
                        });
                }
            }
        }
    );

    Korisnik.prototype.comparePasswords=function (password, callback) {

        bcrypt.compare(password, this.password, function (error, matching) {

            if(error) return callback(error);
            return callback(null, matching);
        });
    }
    return Korisnik;
};