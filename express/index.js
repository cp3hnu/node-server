import express from 'express'
import { sequelize, authenticateAndSync } from '../nodejs/database.js';
import process from 'node:process';
import Users from "./users.js"
import createResource from './resource.js';

const app = express()
const port = 3000

createResource(app, "/users", Users)

authenticateAndSync();

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
})

process.on('exit', (code) => {
  console.log(`Node.js 进程退出，退出码：${code}`);
  sequelize.close();
});

process.on('SIGINT', () => {
  console.log('接收到 SIGINT 信号，进程即将终止');
  sequelize.close();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('接收到 SIGTERM 信号，进程即将终止');
  sequelize.close();
  process.exit();
});