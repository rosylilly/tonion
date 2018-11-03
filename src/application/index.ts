import { createServer, Server, IncomingMessage, ServerResponse } from "http";
import onFinished from "on-finished";

import { Context } from "../context";
import { Request } from "../request";
import { Response } from "../response";
import { Router } from "../router";
import { NextFunction, Middleware, compose } from "../middleware";
import { RouteDelegate } from "../router/route_delegate";
import { ServerDelegate } from "./delegate";
import { Handler } from "../handler";

export class Application extends ServerDelegate implements RouteDelegate {
  public env: string;
  public router: Router;

  public middlewares: Handler[] = [];
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

  protected server: Server;

  private composedHandler: Middleware;

  constructor() {
    super();

    this.env = process.env.NODE_ENV || "development";
    this.router = new Router();

    const handler = this.handler.bind(this);
    this.server = createServer(handler);
    this.composedHandler = this.composeMiddleres();

    this.notFound = async (context: Context) => {
      context.res.send(404, `404 Not Found: ${context.req.pathname}`);
    };
  }

  public use(middleware: Handler) {
    this.middlewares.push(middleware);
    this.composedHandler = this.composeMiddleres();
  }

  public handler(req: IncomingMessage, res: ServerResponse): void {
    const request = new Request(req);
    const response = new Response(res);
    const context = new Context(this, request, response);

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

  public listen(...args: any[]): this {
    this.composedHandler = this.composeMiddleres();
    this.server.listen(...args);
    return this;
  }

  private composeMiddleres(): Middleware {
    return compose(...this.middlewares.concat(this.router));
  }
}
