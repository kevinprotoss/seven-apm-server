'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const serve = require('koa-static');
const send = require('koa-send');
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

app.listen(process.env.PORT, process.env.IP);
