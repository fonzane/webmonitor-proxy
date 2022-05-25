import { NestFactory } from '@nestjs/core';
import { Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use('/', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    router: customRouter,
    logger: console,
    pathRewrite: onRewritePath,
  }))
  await app.listen(3333);
}

bootstrap();

function customRouter(req: Request) {
  let target = req.query.target;
  console.log('target: ', target);
  console.log('cookies: ', req.headers.cookie);
  let cookieTarget
  if (req.headers.cookie) {
    cookieTarget = req.headers.cookie.split("=")[1];
    cookieTarget = cookieTarget.slice(0,10);
  }
  console.log('cookieTarget: ', cookieTarget);
  if (target) {
    return `http://${target}`;
  } else if (cookieTarget) {
    return `http://${cookieTarget}`;
  } else {
    return 'http://localhost:3000';
  }
}

function onRewritePath(string: string):string {
  if (string.includes("?target")) return string.split("?")[0];
  else return string;
}