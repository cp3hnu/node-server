import { Sequelize, DataTypes } from "sequelize";

export const createDatabase = async () => {
  const sequelize = new Sequelize('sqlite::memory:');
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    name: DataTypes.STRING,
    age: DataTypes.INTEGER
  });

  await User.sync();
  return { sequelize, User };
}