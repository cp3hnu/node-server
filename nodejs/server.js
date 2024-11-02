import http from 'node:http';
import process from 'node:process';
import router from "./router.js";
import { sequelize, User } from './database.js';

const startServer = async () => {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost:3000');
    const paths = url.pathname.split('/').filter(Boolean);
    const pathname = "/" + paths[0];
    const id = paths[1];
    await router(pathname, res, req, id);
  });

  await sequelize.sync();

  server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });

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
}

export default startServer;
