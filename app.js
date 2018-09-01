'use strict';

const Koa = require('koa');
const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const serve = require('koa-static');
const app = new Koa();

app.use(compress());
app.use(conditional());
app.use(etag());
app.use(serve('public'));
app.listen(process.env.PORT, process.env.IP);
