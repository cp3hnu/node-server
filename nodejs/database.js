import { Sequelize, DataTypes } from "sequelize";
import path, { dirname} from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = path.join(__dirname, 'database.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: filePath
});

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
  name: DataTypes.STRING,
  age: DataTypes.INTEGER
});
