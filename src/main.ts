import { NestFactory } from '@nestjs/core';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ClientRequest } from 'http';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());

  // app.use('/', 
  // createProxyMiddleware({
  //   target: 'http://localhost:3000',
  //   changeOrigin: true,
  //   router: customRouter,
  //   logger: console,
  //   pathRewrite: onRewritePath,
  //   on: {
  //     proxyReq: (proxyReq: ClientRequest, req: Request, res: Response) => {
  //       let target;
  //       if (req.query.target) target = req.query.target;
  //       console.log('got target: ', target);
  //       if (target) res.cookie('target', target);
  //     }
  //   }
  // }))
  await app.listen(3333);
  Logger.log('[NestApp] Server listening on port 3333');
}

bootstrap();

function customRouter(req: Request) {
  let target = req.query.target;
  console.log('target in router: ', target);
  let cookieTarget = req.cookies.target;
  console.log('cookieTarget in router: ', cookieTarget);
  if (target) {
    return `http://${target}`;
  } else if (cookieTarget) {
    return `http://${cookieTarget}`;
  } 
}

function onRewritePath(string: string):string {
  if (string.includes("?target")) return string.split("?")[0];
  else return string;
}