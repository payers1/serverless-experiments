const Sequelize = require('sequelize');
const { username, password, database, host } = require('./config/config')[process.env.NODE_ENV];

const url = `postgres://${username}:${password}@${host}/${database}`;

const sequelize = new Sequelize(url, {
  dialect: 'postgres',
  define: {
    underscored: true,
    timestamps: false
  },
  dialectOptions: {
    ssl: true
  }
});

const models = require('./models')(sequelize);

exports.models = models;
exports.db = sequelize;
