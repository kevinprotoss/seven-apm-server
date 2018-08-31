'use strict';

const Koa = require('koa');
const serve = require('koa-static');
const app = new Koa();

app.use(serve('public'));
app.listen(8080, '0.0.0.0');
