
import Method from "./method.js";
import { createSuccessResponse } from "./response.js";
import { User } from './database.js';
import { Op } from 'sequelize'

const getUsers = async (response, request, id) => {
  if (id && !isNaN(id)) {
    const idNum = Number(id);
    const users = await User.findAll({
      where: {
        id: idNum
      }
    });
    const user = users[0];
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
    const users = await User.findAll({
      where: {
        name: {
          [Op.substring]: name, 
        }
      }
    })
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(createSuccessResponse(users)));
  }
}
const postUsers = async (response, request) => {
  request.setEncoding('utf8');
  let body = '';
  request.on('data', (data) => {
    body += data;
  });
  request.on('end', async () => {
    const userData = JSON.parse(body);
    const user = await User.create(userData);
    response.statusCode = 201;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(createSuccessResponse(user)));
  });
}

const patchUsers = async (response, request, id) => {
  const idNum = Number(id);
  request.setEncoding('utf8');
  let body = '';
  request.on('data', (data) => {
    body += data;
  });
  request.on('end', async () => {
    const userData = JSON.parse(body);
    const users = await User.findAll({
      where: {
        id: idNum
      }
    });
    const user = users[0];
    if (!user) {
      response.statusCode = 404;
      response.end('User Not Found');
      return;
    }
    const newUser = await user.update(userData);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(createSuccessResponse(newUser)));
  });
}

const putUsers = async (response, request, id) => {
  const idNum = Number(id);
  request.setEncoding('utf8');
  let body = '';
  request.on('data', (data) => {
    body += data;
  });
  request.on('end', async() => {
    const userData = JSON.parse(body);
    const users = await User.findAll({
      where: {
        id: idNum
      }
    });
    const user = users[0];
    if (!user) {
      response.statusCode = 404;
      response.end('User Not Found');
      return;
    }
    user.set(userData);
    const newUser = await user.save();
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(createSuccessResponse(newUser)));
  });
}

const deleteUsers = async (response, request, id) => {
  const idNum = Number(id);
  const result = await User.destroy({
    where: {
      id: idNum
    }
  })
  if (!result) {
    response.statusCode = 404;
    response.end('User Not Found');
    return;
  }
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

export const handleUsers = async (response, request, id) => {
  const method = request.method;
  const func = usersHandlers[method];
  if (func) {
    await func(response, request, id);
  } else {
    response.statusCode = 405;
    response.end('Method Not Allowed');
  }
}

