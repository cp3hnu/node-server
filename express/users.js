import Method from "../nodejs/method.js";
import { createSuccessResponse } from "../nodejs/response.js";
import { User } from '../nodejs/database.js';
import { Op } from 'sequelize'

export const getUsers = async (request, response) => {
  const id = request.params.id
  const idNum = Number(id);
  if (id && !isNaN(idNum)) {
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
    const name = query.get('name') ?? '';
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
export const postUsers = async (request, response) => {
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

export const patchUsers = async (request, response) => {
  const id = request.params.id
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

export const putUsers = async (request, response) => {
  const id = request.params.id
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

export const deleteUsers = async (request, response) => {
  const id = request.params.id
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

const Users = {
  [Method.GET]: getUsers,
  [Method.POST]: postUsers,
  [Method.PATCH]: patchUsers,
  [Method.PUT]: putUsers,
  [Method.DELETE]: deleteUsers
}

export default Users