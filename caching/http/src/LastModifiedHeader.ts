import http = require('http');
import express = require('express');


export default class LastModifiedHeader {
  static app = express();
  startServer() {
    const port = 3000
    let lastModDate=new Date(Date.now());//fixed at server start time
    LastModifiedHeader.app.set('etag', false);
    LastModifiedHeader.app.use(express.static('/Users/monmohans/code/github.com/random-notes/caching/http/src', { "etag": false }))
    LastModifiedHeader.app.get('/maxage', (req, res) => {
      console.log("request received "+req.path + "\n"+req.rawHeaders )
      console.log("If-Modified-Since "+ req.headers['if-modified-since'])
      console.log("--------------------")
      res.append('Last-Modified',lastModDate .toISOString());
      //res.append('Cache-Control', 'no-cache');
      res.send('This is a sample resource !')
    });

    LastModifiedHeader.app.listen(port, "192.168.0.101",() => console.log(`Example app listening on port ${port}!`))
  }
} 