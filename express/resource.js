import Method from "../nodejs/method.js";

const createRource = (app, path, obj) => {
  app.get(path, obj[Method.GET]);
  app.get(path + "/:id(\\d+)", obj[Method.GET]);
  app.post(path , obj[Method.POST]);
  app.put(path + "/:id(\\d+)", obj[Method.PUT]);
  app.patch(path + "/:id(\\d+)", obj[Method.PATCH]);
  app.delete(path + "/:id(\\d+)", obj[Method.DELETE]);
}

export default createRource
  