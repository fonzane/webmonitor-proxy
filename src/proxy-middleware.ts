import { NestMiddleware } from "@nestjs/common";
import { ClientRequest } from "http";
import { Request, Response } from 'express';
import { createProxyMiddleware } from "http-proxy-middleware";
import { HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";

export class ProxyMiddleware implements NestMiddleware {
    proxy = createProxyMiddleware({
        target: 'http://localhost:3000',
        changeOrigin: true,
        router: this.customRouter,
        logger: console,
        pathRewrite: this.onRewritePath,
        on: {
        proxyReq: (proxyReq: ClientRequest, req: Request, res: Response) => {
            let target;
            if (req.query.target) target = req.query.target;
            console.log('got target: ', target);
            if (target) res.cookie('target', target);
        }
        }
    })

    customRouter(req: Request) {
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
      
      onRewritePath(string: string):string {
        if (string.includes("?target")) return string.split("?")[0];
        else return string;
      }

      use(req: Request, res: Response, next: (error?: any) => void) {
          console.log('headers: ', req.headers);
          this.proxy(req, res, next);
      }
}