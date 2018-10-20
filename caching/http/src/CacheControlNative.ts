import http = require('http');
import Url = require('url');
import fs = require('fs');

export default class CacheControlNative {
  lastModDate = Date.now();
  
  requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) => {
    let uobj = Url.parse(request.url)
    console.log(`path=${uobj.path}`)
    if (uobj.path.startsWith('/maxage')) {
      return this.maxageHandler(uobj, request, response);
    }
    if (uobj.path.startsWith('/lastmod')) {
      return this.lastModHandler(uobj, request, response);
    }
    this.pageHandler(request, response)
  }
  refreshLasMod() {
    //refresh every one minute
    if (Date.now() - this.lastModDate > 60000) {
      this.lastModDate = Date.now();
    }

  }
  pageHandler = (request: http.IncomingMessage, response: http.ServerResponse) => {
    var fileStream = fs.createReadStream('/Users/monmohans/code/github.com/random-notes/caching/http/src/resources.html', "UTF-8");
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
    ifModSince=ifModSince && ifModSince.toString()
    this.refreshLasMod();
    console.log(`If modified since header is ${Date.parse(ifModSince)}, Last Mod time for resource is ${this.lastModDate}`)
    let isFresh = ifModSince && (this.lastModDate <= Date.parse(ifModSince));
    if (isFresh) {
      console.log(`cache is still fresh !, return 304 NOT MODIFIED`)
      response.statusCode = 304;
    }
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('Last-Modified', new Date(this.lastModDate).toISOString());
    response.end("The awesome resource with last mod date fixed")

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
