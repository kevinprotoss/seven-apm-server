'use strict';

const cluster = require('cluster');
const Koa = require('koa');
const Router = require('koa-router');
const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const serve = require('koa-static');
const send = require('koa-send');

// const numCPUs = require( 'os' ).cpus().length;
const numCPUs = 2; // Fix value, use 2 workers
if (cluster.isMaster) {
  for(let i=0; i < numCPUs; i++) {
      cluster.fork();
  }
  cluster.on('listening', (worker, address) => {
    console.log('worker ' + worker.process.pid + ', listen: ' + address.address + ":" + address.port);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker ' + worker.process.pid + ' died');
    //重启一个worker进程
    cluster.fork();
  });
} else {
  const app = new Koa();
  const router = new Router();
  
  router
    .get('*', async (ctx) => {
      // Fallback route for 404 error while refreshing angular app with hash
      await send(ctx, 'public/index.html');
    });

  app
    .use(compress())
    .use(conditional())
    .use(etag())
    .use(serve('public'))
    .use(router.routes())
    .use(router.allowedMethods());
  
  // app.listen(process.env.PORT, process.env.IP);
  app.listen(8080, '0.0.0.0');
}
