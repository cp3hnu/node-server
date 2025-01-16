import Method from "../nodejs/method.js";
import { createSuccessResponse, createErrorResponse } from "../nodejs/response.js";
import { User } from '../nodejs/database.js';
import { Op } from 'sequelize'
import express from "express"
const router = express.Router()

class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserError';
    this.statusCode = 401;
  }
}

const getUsers = async (request, response, next) => {
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
      next(new UserError('User Not Found'))
      return
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
const postUsers = async (request, response) => {
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

const patchUsers = async (request, response, next) => {
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
      next(new UserError('User Not Found'))
      return 
    }
    const newUser = await user.update(userData);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(createSuccessResponse(newUser)));
  });
}

const putUsers = async (request, response, next) => {
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
      next(new UserError('User Not Found'))
      return
    }
    user.set(userData);
    const newUser = await user.save();
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(createSuccessResponse(newUser)));
  });
}

const deleteUsers = async (request, response, next) => {
  const id = request.params.id
  const idNum = Number(id);
  const result = await User.destroy({
    where: {
      id: idNum
    }
  })
  if (!result) {
    next(new UserError('User Not Found'));
    return 
  }
  response.statusCode = 200;
  response.end(JSON.stringify(createSuccessResponse(null)));
}

router.get("/", getUsers);
router.get("/:id(\\d+)", getUsers);
router.post("/" , postUsers);
router.put("/:id(\\d+)", putUsers);
router.patch("/:id(\\d+)", patchUsers);
router.delete("/:id(\\d+)", deleteUsers);

router.use((error, request, response, next) => {
  if (error instanceof UserError) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(createErrorResponse(404, error.message)));
    return
  }
  next(error)
});

export default router;