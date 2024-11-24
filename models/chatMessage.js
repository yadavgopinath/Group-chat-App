const Sequelize = require  ('sequelize');
const sequelize = require('../util/database');

const chatMessage = sequelize.define('chatMessage',{

    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
});
module.exports = chatMessage;