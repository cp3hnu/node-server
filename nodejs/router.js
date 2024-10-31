import handlers from "./requestHandlers.js";

function router(pathname, response, request, id) {
  console.log("About to route a request for " + pathname);
  if (typeof handlers[pathname] === 'function') {
    handlers[pathname](response, request, id);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("404 Not found");
    response.end();
  }
}

export default router