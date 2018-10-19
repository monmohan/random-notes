import http = require('http');
import express = require('express');
/**
 * This class uses express which does some extra work in terms of managing the headers returned in the call
 * 
 */
export default class CacheControlMaxAge {
  static app = express();
  startServer() {
    const port = 3000
    CacheControlMaxAge.app.set('etag', false);
    CacheControlMaxAge.app.use(express.static('/Users/monmohans/code/github.com/random-notes/caching/http/src', { "etag": false }))
    CacheControlMaxAge.app.get('/maxage', (req, res) => {
      console.log("request received "+req.path)
      /**
       * This will cache response for 10000 seconds
       */
      res.append('Cache-Control', 'public, max-age=30');
      //res.append('Cache-Control', 'no-cache');
      res.send('This is a sample resource !')
    });

    CacheControlMaxAge.app.listen(port, "10.148.78.63",() => console.log(`Example app listening on port ${port}!`))
  }
} 