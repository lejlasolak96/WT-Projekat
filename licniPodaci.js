const Sequelize = require("sequelize");

module.exports=function (sequelize, DataTypes) {

    const Podaci=sequelize.define('personalInfo',{

        ime_i_prezime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        index:{
            type: DataTypes.STRING(5),
            allowNull: true
        },
        grupa:{
            type:DataTypes.INTEGER,
            allowNull: true
        },
        url:{

            type:DataTypes.STRING,
            allowNull: true
        },
        ssh:{

            type:DataTypes.STRING,
            allowNull: true
        },
        repozitorij:{

            type:DataTypes.STRING,
            allowNull: true
        },
        email:{

            type:DataTypes.STRING,
            allowNull: true
        },
        max_broj_grupa:{

            type: DataTypes.INTEGER,
            allowNull: true
        },
        regex:{

            type:DataTypes.STRING,
            allowNull: true
        },
        semestar:{

            type:DataTypes.STRING,
            allowNull: true
        },
        akademska_godina:{

            type:DataTypes.STRING,
            allowNull: true
        }
    });

    return Podaci;
};