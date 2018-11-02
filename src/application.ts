import { createServer, Server, IncomingMessage, ServerResponse } from "http";
import onFinished from "on-finished";

import { Context } from "./context";
import { Request } from "./request";
import { Response } from "./response";
import { Router } from "./router";
import { NextFunction, Middleware, compose } from "./middleware";
import { RouteDelegate } from "./router/route_delegate";

export class Application implements RouteDelegate {
  public set keepAliveTimeout(ms: number) { this.server.keepAliveTimeout = ms; }
  public get keepAliveTimeout(): number { return this.server.keepAliveTimeout; }
  public set maxConnections(count: number) { this.server.maxConnections = count; }
  public get maxConnections(): number { return this.server.maxConnections; }
  public set maxHeadersCount(count: number) { this.server.maxHeadersCount = count; }
  public get maxHeadersCount(): number { return this.server.maxHeadersCount; }
  public set timeout(ms: number) { this.server.timeout = ms; }
  public get timeout(): number { return this.server.timeout; }

  public get listening(): boolean { return this.server.listening; }

  public env: string;
  public router: Router;
  public server: Server;

  public middlewares: Middleware[] = [];
  public notFound: NextFunction;

  public match = RouteDelegate.prototype.match;
  public get = RouteDelegate.prototype.get;
  public post = RouteDelegate.prototype.post;
  public put = RouteDelegate.prototype.put;
  public patch = RouteDelegate.prototype.patch;
  public delete = RouteDelegate.prototype.delete;
  public head = RouteDelegate.prototype.head;
  public options = RouteDelegate.prototype.options;
  public all = RouteDelegate.prototype.all;

  private composedHandler?: Middleware;

  constructor() {
    this.env = process.env.NODE_ENV || "development";
    this.router = new Router();

    const handler = this.handler.bind(this);
    this.server = createServer(handler);

    this.notFound = async (context: Context) => {
      context.res.send(404, "404 Not Found");
    };
  }

  public handler(req: IncomingMessage, res: ServerResponse): void {
    const request = new Request(req);
    const response = new Response(res);
    const context = new Context(this, request, response);

    if (!this.composedHandler) {
      this.composedHandler = this.composeMiddleres();
    }

    const onError = (err?: any) => { context.onError(err); };
    const respond = this.respond.bind(this, context);

    onFinished(response, onError);
    this.composedHandler.call(context, this.notFound).then(respond).catch(onError);
  }

  public async respond(ctx: Context) {
    const { res } = ctx;

    if (!res.writable) { return; }

    res.end(res.body);
  }

  public getConnections(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
     this.server.getConnections((error, count) => {
       if (error) { return reject(error); }

       resolve(count);
     });
    });
  }

  public listen(port: number) {
    this.composeMiddleres();
    return this.server.listen(port);
  }

  public close(callback?: () => void) {
    this.server.close(callback);
  }

  private composeMiddleres(): Middleware {
    return compose(...this.middlewares.concat(this.router));
  }
}
