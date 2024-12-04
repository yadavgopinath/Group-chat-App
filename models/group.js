const Sequelize =  require('sequelize');
const sequelize = require('../util/database');
const Group = sequelize.define('group', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false
    } // This will store the ID of the user who created the group.
});

module.exports = Group;