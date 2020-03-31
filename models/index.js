const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
  {
    dialect: config.dialect,
    dialectOptions: {
      supportBigNumbers: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: true
    },
    logging: true
  }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Post = require("./post")(sequelize, Sequelize);
db.Hashtag = require("./hashtag")(sequelize, Sequelize);

db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

db.Post.belongsToMany(db.Hashtag, { through: "Register" });
db.Hashtag.belongsToMany(db.Post, { through: "Register" });

db.User.belongsToMany(db.User, {
  foreignKey: "followingId",
  as: "Follwers",
  through: "Follow"
});

db.User.belongsToMany(db.User, {
  foreignKey: "followerId",
  as: "Followings",
  through: "Follow"
});

module.exports = db;
