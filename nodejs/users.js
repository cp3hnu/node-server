import path, { dirname} from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import Method from "./method.js";
import { createSuccessResponse } from "./response.js";

const users = [];
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = path.join(__dirname, 'data.json');

export const saveUserData = () => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  console.log('数据已保存到 data.json 文件');
};

export const readUserData = () => {
  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        try {
          const userList = JSON.parse(data);
          users.push(...userList);
        } catch (err) {
          console.error(err);
        }
      }
    });
  }
};

const findMaxId = (users) => {
  const ids = users.map(user => user.id);
  if (ids.length === 0) {
    return 0;
  }
  return Math.max(...users.map(user => user.id));
}

const getUsers = (response, request, id) => {
  if (id && !isNaN(id)) {
    const idNum = Number(id);
    const user = users.find(user => user.id === idNum);
    if (!user) {
      response.statusCode = 404;
      response.end('User Not Found');
      return;
    } else {
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(createSuccessResponse(user)));
    }
  } else {
    const url = new URL(request.url, 'http://localhost:3000');
    const query = url.searchParams;
    const name = query.get('name');
    let filteredUsers = users;
    if (name) {
      filteredUsers = users.filter(user => user.name === name);
    }
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(createSuccessResponse(filteredUsers)));
  }
}
const postUsers = (response, request) => {
  request.setEncoding('utf8');
  let body = '';
  request.on('data', (data) => {
    body += data;
  });
  request.on('end', () => {
    const newUser = JSON.parse(body);
    newUser.id = findMaxId(users) + 1;
    users.push(newUser);
    response.statusCode = 201;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(createSuccessResponse(newUser)));
  });
}

const patchUsers = (response, request, id) => {
  const idNum = Number(id);
  request.setEncoding('utf8');
  let body = '';
  request.on('data', (data) => {
    body += data;
  });
  request.on('end', () => {
    const updatedUser = JSON.parse(body);
    const index = users.findIndex(user => user.id === idNum);
    if (index === -1) {
      response.statusCode = 404;
      response.end('User Not Found');
      return;
    }
    users[index] = { ...users[index], ...updatedUser };
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(createSuccessResponse(users[index])));
  });
}

const putUsers = (response, request, id) => {
  const idNum = Number(id);
  request.setEncoding('utf8');
  let body = '';
  request.on('data', (data) => {
    body += data;
  });
  request.on('end', () => {
    const updatedUser = JSON.parse(body);
    const index = users.findIndex(user => user.id === idNum);
    if (index === -1) {
      response.statusCode = 404;
      response.end('User Not Found');
      return;
    }
    updatedUser.id = idNum;
    users[index] = updatedUser;
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(createSuccessResponse(users[index])));
  });
}

const deleteUsers = (response, request, id) => {
  const idNum = Number(id);
  const index = users.findIndex(user => user.id === idNum);
  if (index === -1) {
    response.statusCode = 404;
    response.end('User Not Found');
    return;
  }
  users.splice(index, 1);
  response.statusCode = 200;
  response.end(JSON.stringify(createSuccessResponse(null)));
}

const usersHandlers = {
  [Method.GET]: getUsers,
  [Method.POST]: postUsers,
  [Method.PATCH]: patchUsers,
  [Method.PUT]: putUsers,
  [Method.DELETE]: deleteUsers
}

export const handleUsers = (response, request, id) => {
  const method = request.method;
  const func = usersHandlers[method];
  if (func) {
    return func(response, request, id);
  } else {
    response.statusCode = 405;
    response.end('Method Not Allowed');
  }
}

