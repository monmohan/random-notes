import http = require('http');
import Url = require('url');
import fs = require('fs');

export default class CacheControlNative {
  lastModDate = Date.now();
  refreshInterval = 60 * 1000 * 30;
  
  requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) => {
    let uobj = Url.parse(request.url)
    console.log(`Request : ${uobj.path}` )
    if (uobj.path.startsWith('/maxage')) {
      return this.maxageHandler(uobj, request, response);
    }
    if (uobj.path.startsWith('/lastmod')) {
      return this.lastModHandler(uobj, request, response);
    }
    if (uobj.path.startsWith('/largefile')) {
      return this.largeFileHandler(request, response);
    }
    this.pageHandler(request, response)
  }
  refreshLasMod() {
    //refresh interval check
    if (Date.now() - this.lastModDate > this.refreshInterval) {
      this.lastModDate = Date.now();
    }

  }
  largeFileHandler= (request: http.IncomingMessage, response: http.ServerResponse) => {
    //Assumes current directory is .../random-notes/caching/http
    //Server is run via $node node build/test/Server.js
    var fileStream = fs.createReadStream('largefile.txt');
    response.writeHead(200, { "Content-Type": "application/octet-stream", "Cache-Control": "no-cache" });

    fileStream.pipe(response);

  }
  pageHandler = (request: http.IncomingMessage, response: http.ServerResponse) => {
    //Assumes current directory is .../random-notes/caching/http
    //Server is run via $node node build/test/Server.js
    var fileStream = fs.createReadStream('src/resources.html', "UTF-8");
    response.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-cache" });

    fileStream.pipe(response);

  }
  maxageHandler = (url: Url.Url, request: http.IncomingMessage, response: http.ServerResponse) => {
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('Cache-Control', 'public, max-age=30');
    response.statusCode = 200
    response.end("The awesome resource with max age TTL")

  }

  lastModHandler = (url: Url.Url, request: http.IncomingMessage, response: http.ServerResponse) => {
    let ifModSince = request.headers['if-modified-since']

    ifModSince = ifModSince && ifModSince.toString()

    this.refreshLasMod(); //refresh the last mod time once every minute

    console.log(`If modified since header is ${Date.parse(ifModSince)}, Last Mod time for resource is ${this.lastModDate}`)

    let isFresh = ifModSince && (this.lastModDate <= Date.parse(ifModSince));

    response.setHeader('Content-Type', 'text/html');
    /**
     * Without this header, Browser would apply heuristic to determine an expiration.
     * Adding "no-cache" directive forces them to always re-validate with the server
     */
    //response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Last-Modified', new Date(this.lastModDate).toISOString());

    if (isFresh) {
      console.log(`cache is still fresh !, return 304 NOT MODIFIED`)
      response.statusCode = 304;
      response.end()// no body
    } else {
      response.statusCode = 200;
      response.end("The awesome resource with last mod date set")
    }


  }


  startServer() {
    const port = 9000

    const server = http.createServer(this.requestHandler)

    server.listen(port, (err: any) => {
      if (err) {
        return console.log('Error', err)
      }

      console.log(`server is listening on ${port}`)
    })
  }

}
